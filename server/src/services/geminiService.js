const { OpenRouter } = require('@openrouter/sdk');
const fs = require('fs');
const path = require('path');

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

// Helper to load and fill prompt
const getPrompt = (templateName, data) => {
  const filePath = path.join(__dirname, 'ai', 'prompts', `${templateName}.txt`);
  let content = fs.readFileSync(filePath, 'utf8');
  Object.keys(data).forEach(key => {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
  });
  return content;
};

const getMatchExplanation = async (trader, client, score) => {
  try {
    const prompt = getPrompt('matchExplanation', {
      traderName: trader.name,
      traderExp: trader.experience,
      traderLevel: trader.level,
      traderSpec: trader.specialization?.join(', '),
      traderPerf: trader.performanceScore,
      clientName: client.name,
      portfolioValue: client.portfolioValue?.toLocaleString(),
      risk: client.riskAppetite,
      complexity: client.complexity,
      need: client.preferredSpecialization,
      score: score
    });

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
    const prompt = getPrompt('riskAnalysis', {
      traderName: trader.name,
      load: Math.round((trader.currentLoad / trader.capacity) * 100),
      current: trader.currentLoad,
      max: trader.capacity
    });

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
