const asyncHandler = require('express-async-handler');
const axios = require('axios');

// @desc    Get AI trading advice / reasoning from OpenRouter
// @route   POST /api/ai/advice
// @access  Private
const getTradingAdvice = asyncHandler(async (req, res) => {
  const { symbol, marketData, query } = req.body;

  const prompt = `As an expert AI trading assistant, give advice for the following scenario: 
Symbol: ${symbol}
Market Data: ${JSON.stringify(marketData)}
Query: ${query}`;

  try {
    // Using OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.0-flash-lite-preview-02-05:free', // Using a free-tier model on OpenRouter
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000', // Update with your actual domain
          'X-Title': 'AllocateIQ', 
        },
      }
    );

    const advice = response.data.choices[0].message.content;
    res.json({ advice });
  } catch (error) {
    console.error('Error fetching AI advice:', error?.response?.data || error.message);
    res.status(502);
    throw new Error('Failed to fetch AI reasoning from OpenRouter');
  }
});

module.exports = { getTradingAdvice };
