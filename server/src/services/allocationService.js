const User = require('../models/User');
const Trader = require('../models/Trader');
const Allocation = require('../models/Allocation');
const { getMatchExplanation } = require('./geminiService');
const { calculateMatchScore } = require('./scoringService');
const { getWorkloadPenalty, isOverloaded } = require('./workloadService');

const runAutoAllocation = async () => {
  const unassignedClients = await User.find({ role: 'Customer', assignedTraderId: null });
  const availableTraders = await Trader.find({ isAvailable: true });

  if (unassignedClients.length === 0 || availableTraders.length === 0) {
    return { message: 'No unassigned clients or available traders found.' };
  }

  const results = [];

  for (const client of unassignedClients) {
    let bestTrader = null;
    let highestScore = -1;

    for (const trader of availableTraders) {
      if (trader.currentLoad >= trader.capacity) continue;

      let score = calculateMatchScore(trader, client);
      score -= getWorkloadPenalty(trader);
      score = Math.max(0, score);

      if (score > highestScore) {
        highestScore = score;
        bestTrader = trader;
      }
    }

    if (bestTrader) {
      const explanation = await getMatchExplanation(bestTrader, client, highestScore);

      const allocation = await Allocation.create({
        clientId: client._id,
        traderId: bestTrader._id,
        matchScore: highestScore,
        aiExplanation: explanation
      });

      client.assignedTraderId = bestTrader._id;
      await client.save();

      bestTrader.currentLoad += 1;
      await bestTrader.save();

      results.push({
        allocation,
        clientName: client.name,
        traderName: bestTrader.name
      });
    }
  }

  return results;
};

// Feature 3: Real-Time Reallocation Triggers
const checkReallocations = async () => {
  const activeAllocations = await Allocation.find({ status: 'Active' })
    .populate('clientId')
    .populate('traderId');

  const triggers = [];

  for (const alloc of activeAllocations) {
    const client = alloc.clientId;
    const trader = alloc.traderId;

    if (!client || !trader) continue;

    // Trigger: Workload Breach
    if (isOverloaded(trader)) {
      triggers.push({
        type: 'Workload Breach',
        clientId: client._id,
        clientName: client.name,
        currentTrader: trader.name,
        reason: 'Trader at >85% capacity'
      });
    }

    // Trigger: Performance Drop
    if (trader.performanceScore < 60) {
      triggers.push({
        type: 'Performance Drop',
        clientId: client._id,
        clientName: client.name,
        currentTrader: trader.name,
        reason: `Trader performance score (${trader.performanceScore}) is below threshold.`
      });
    }

    // Trigger: Skill Mismatch
    if (trader.specialization && !trader.specialization.includes(client.preferredSpecialization)) {
      triggers.push({
        type: 'Skill Mismatch',
        clientId: client._id,
        clientName: client.name,
        currentTrader: trader.name,
        reason: `Trader is not specialized in ${client.preferredSpecialization}.`
      });
    }
  }

  return triggers;
};

const runSingleAllocation = async (clientId) => {
  const client = await User.findById(clientId);
  if (!client) {
    throw new Error('Client not found.');
  }

  const availableTraders = await Trader.find({ isAvailable: true });
  if (availableTraders.length === 0) {
    throw new Error('No available traders found at the moment.');
  }

  let bestTrader = null;
  let highestScore = -1;

  for (const trader of availableTraders) {
    if (trader.currentLoad >= trader.capacity) continue;

    let score = calculateMatchScore(trader, client);
    score -= getWorkloadPenalty(trader);
    score = Math.max(0, score);

    if (score > highestScore) {
      highestScore = score;
      bestTrader = trader;
    }
  }

  if (bestTrader) {
    const explanation = await getMatchExplanation(bestTrader, client, highestScore);
    
    // Create a Proposed allocation for review
    const allocation = await Allocation.create({
      clientId: client._id,
      traderId: bestTrader._id,
      matchScore: highestScore,
      aiExplanation: explanation,
      status: 'Proposed'
    });

    return {
      allocationId: allocation._id,
      trader: {
        id: bestTrader._id,
        name: bestTrader.name,
        level: bestTrader.level,
        experience: bestTrader.experience,
        specialization: bestTrader.specialization,
        performanceScore: bestTrader.performanceScore,
        currentLoad: bestTrader.currentLoad,
        capacity: bestTrader.capacity
      },
      aiExplanation: explanation,
      matchScore: highestScore
    };
  }

  throw new Error('Could not find a suitable match.');
};

const finalizeAllocation = async (allocationId) => {
  const allocation = await Allocation.findById(allocationId);
  if (!allocation || allocation.status !== 'Proposed') {
    throw new Error('Invalid or expired allocation proposal.');
  }

  const client = await User.findById(allocation.clientId);
  const trader = await Trader.findById(allocation.traderId);

  if (!client || !trader) {
    throw new Error('Client or Trader not found.');
  }

  // Handle re-assignment workload balancing
  if (client.assignedTraderId) {
    await User.findByIdAndUpdate(client.assignedTraderId, { $inc: { currentLoad: -1 } });
  }

  // Finalize assignment
  await User.findByIdAndUpdate(client._id, { assignedTraderId: trader._id });
  await Trader.findByIdAndUpdate(trader._id, { $inc: { currentLoad: 1 } });

  allocation.status = 'Active';
  await allocation.save();

  return { message: 'Trader assignment finalized successfully.' };
};

const rejectAllocation = async (allocationId) => {
  const allocation = await Allocation.findById(allocationId);
  if (allocation) {
    allocation.status = 'Inactive';
    await allocation.save();
  }
  return { message: 'Allocation proposal rejected.' };
};

const unassignTrader = async (clientId) => {
  const client = await User.findById(clientId);
  if (!client || !client.assignedTraderId) {
    throw new Error('Client not found or no trader assigned.');
  }

  const traderId = client.assignedTraderId;

  // Update old trader load
  await Trader.findByIdAndUpdate(traderId, { $inc: { currentLoad: -1 } });

  // Unassign client
  await User.findByIdAndUpdate(clientId, { assignedTraderId: null });

  // Update allocation record
  await Allocation.updateMany(
    { clientId: clientId, traderId: traderId, status: 'Active' },
    { $set: { status: 'Inactive' } }
  );

  return { message: 'Trader successfully unassigned.' };
};

module.exports = { 
  runAutoAllocation, 
  checkReallocations, 
  runSingleAllocation,
  finalizeAllocation,
  rejectAllocation,
  unassignTrader
};
