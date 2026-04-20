const asyncHandler = require('express-async-handler');
const { OpenRouter } = require('@openrouter/sdk');

// @desc    Get AI trading advice / reasoning from OpenRouter
// @route   POST /api/ai/advice
// @access  Private
const getTradingAdvice = asyncHandler(async (req, res) => {
  const { symbol, marketData, query } = req.body;

  const prompt = `As an expert AI trading assistant, give brief, direct advice for the following scenario.
IMPORTANT RULES: 
1. Do NOT use markdown formatting like asterisks (*), hashes (#), or bullet points. Use plain text only.
2. Keep your answer simple, concise. 
3. Do not ask clarifying questions; just give your best general advice based on the info provided.

Symbol: ${symbol}
Market Data: ${JSON.stringify(marketData)}
Query: ${query}`;

  try {
    const openrouter = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY
    });

    const stream = await openrouter.chat.send({
      chatRequest: {
        model: "nvidia/nemotron-3-super-120b-a12b:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        stream: true
      }
    });

    let advice = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        advice += content;
      }
      
      // We can log usage if needed
      // if (chunk.usage) {
      //   console.log("\\nReasoning tokens:", chunk.usage.reasoningTokens);
      // }
    }

    res.json({ advice });
  } catch (error) {
    console.error('Error fetching AI advice:', error?.response?.data || error.message);
    res.status(502);
    throw new Error('Failed to fetch AI reasoning from OpenRouter');
  }
});

module.exports = { getTradingAdvice };

