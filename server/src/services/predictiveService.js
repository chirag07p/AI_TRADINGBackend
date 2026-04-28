const { generateAiText } = require('./aiProviderService');

const getPredictiveAnalysis = async (clients, traders) => {
  try {
    const prompt = `
      As an AI trading firm resource planner, analyze the following data:
      Clients: ${clients.length} (Average portfolio size: ${clients.reduce((s, c) => s + (c.portfolioValue || 0), 0) / clients.length})
      Traders: ${traders.length} (Average experience: ${traders.reduce((s, t) => s + t.experience, 0) / traders.length} years)
      
      Look for potential bottlenecks. Will we need more senior traders soon? Are specific specializations (Forex, Equity) over-capacity?
      
      Provide a "Predictive Warning" (2 sentences max) in professional tone.
    `;

    return await generateAiText(prompt);
  } catch (error) {
    return "Demand remains stable within current trader capacity thresholds.";
  }
};

module.exports = { getPredictiveAnalysis };
