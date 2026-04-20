const User = require('../models/User');
const Allocation = require('../models/Allocation');
const { getMatchExplanation } = require('./geminiService');

const calculateMatchScore = (trader, client) => {
  let score = 0;

  // 1. Experience Match (30 pts)
  // High complexity (8-10) needs Senior/Expert
  // Medium complexity (4-7) needs Mid/Senior
  // Low complexity (1-3) can take Junior
  if (client.complexity >= 8) {
    if (trader.level === 'Expert') score += 30;
    else if (trader.level === 'Senior') score += 20;
    else if (trader.level === 'Mid') score += 10;
  } else if (client.complexity >= 4) {
    if (trader.level === 'Senior') score += 30;
    else if (trader.level === 'Mid') score += 25;
    else if (trader.level === 'Expert') score += 20;
    else score += 5;
  } else {
    if (trader.level === 'Junior') score += 30;
    else if (trader.level === 'Mid') score += 20;
    else score += 10;
  }

  // 2. Skill Match (25 pts)
  if (trader.specialization.includes(client.preferredSpecialization)) {
    score += 25;
  }

  // 3. Performance Score (25 pts)
  score += (trader.performanceScore / 100) * 25;

  // 4. Workload Penalty (-20 pts)
  const loadPercentage = (trader.currentLoad / trader.capacity) * 100;
  if (loadPercentage > 85) score -= 20;
  else if (loadPercentage > 60) score -= 10;
  else if (loadPercentage > 30) score -= 5;

  return Math.max(0, Math.min(100, Math.round(score)));
};

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
      // Skip if trader is at max capacity
      if (trader.currentLoad >= trader.capacity) continue;

      const score = calculateMatchScore(trader, client);
      if (score > highestScore) {
        highestScore = score;
        bestTrader = trader;
      }
    }

    if (bestTrader) {
      // Create Allocation
      const explanation = await getMatchExplanation(bestTrader, client, highestScore);
      
      const allocation = await Allocation.create({
        clientId: client._id,
        traderId: bestTrader._id,
        matchScore: highestScore,
        aiExplanation: explanation
      });

      // Update Client
      client.assignedTraderId = bestTrader._id;
      await client.save();

      // Update Trader
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

module.exports = { runAutoAllocation };
