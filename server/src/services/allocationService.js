const User = require('../models/User');
const Allocation = require('../models/Allocation');
const { getMatchExplanation } = require('./geminiService');
const { calculateMatchScore } = require('./scoringService');
const { getWorkloadPenalty, isOverloaded } = require('./workloadService');

const runAutoAllocation = async () => {
  const unassignedClients = await User.find({ role: 'Customer', assignedTraderId: null });
  const availableTraders = await User.find({ role: 'Employee', isAvailable: true });

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

module.exports = { runAutoAllocation, checkReallocations };
