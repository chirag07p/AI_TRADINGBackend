const { OpenRouter } = require('@openrouter/sdk');

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

const getMatchExplanation = async (trader, client, score) => {
  try {
    const prompt = `
      You are an AI matching engine for a trading firm called AllocateIQ.
      Explain why this is the optimal match in 2-3 sentences of professional reasoning.
      Mention specific data points like specialization, experience, or performance.
      
      Trader: ${trader.name}, ${trader.experience}y exp, ${trader.level}, ${trader.specialization?.join(', ')} spec, ${trader.performanceScore}/100 perf.
      Client: ${client.name}, Portfolio ₹${client.portfolioValue?.toLocaleString()}, ${client.riskAppetite} risk, ${client.complexity}/10 complexity, ${client.preferredSpecialization} preference.
      Match Score: ${score}/100.
    `;

    const stream = await openrouter.chat.send({
      chatRequest: {
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [{ role: "user", content: prompt }],
        stream: true
      }
    });

    let explanation = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) explanation += content;
    }

    return explanation.trim();
  } catch (error) {
    console.error('AI Matching Explanation Error:', error.message);
    return `Matched based on ${trader.level} expertise and ${client.riskAppetite} risk alignment.`;
  }
};

const getRiskAnalysis = async (trader) => {
  try {
    const prompt = `
      Trader ${trader.name} at ${Math.round((trader.currentLoad / trader.capacity) * 100)}% capacity.
      Should this trader be flagged for reassignment? Return "FLAG" or "OK" and 1 sentence.
    `;

    const stream = await openrouter.chat.send({
      chatRequest: {
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [{ role: "user", content: prompt }],
        stream: true
      }
    });

    let analysis = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) analysis += content;
    }

    return analysis.trim();
  } catch (error) {
    return 'FLAG - Capacity limit reached.';
  }
};

module.exports = { getMatchExplanation, getRiskAnalysis };
