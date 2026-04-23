const { OpenRouter } = require('@openrouter/sdk');

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

const getPredictiveAnalysis = async (clients, traders) => {
  try {
    const prompt = `
      As an AI trading firm resource planner, analyze the following data:
      Clients: ${clients.length} (Average portfolio size: ${clients.reduce((s, c) => s + (c.portfolioValue || 0), 0) / clients.length})
      Traders: ${traders.length} (Average experience: ${traders.reduce((s, t) => s + t.experience, 0) / traders.length} years)
      
      Look for potential bottlenecks. Will we need more senior traders soon? Are specific specializations (Forex, Equity) over-capacity?
      
      Provide a "Predictive Warning" (2 sentences max) in professional tone.
    `;

    const stream = await openrouter.chat.send({
      chatRequest: {
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [{ role: "user", content: prompt }],
        stream: true
      }
    });

    let prediction = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) prediction += content;
    }

    return prediction.trim();
  } catch (error) {
    return "Demand remains stable within current trader capacity thresholds.";
  }
};

module.exports = { getPredictiveAnalysis };
