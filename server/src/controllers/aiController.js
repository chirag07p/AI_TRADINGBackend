const asyncHandler = require('express-async-handler');
const { generateAiText } = require('../services/aiProviderService');
const AiMarkdownNote = require('../models/AiMarkdownNote');

// @desc    Get AI trading advice / reasoning from the AI provider chain
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
    const advice = await generateAiText(prompt);

    const savedNote = await AiMarkdownNote.create({
      userId: req.user._id,
      userRole: req.user.role,
      source: 'employee-copilot',
      prompt,
      markdownContent: advice,
      modelUsed: 'nemotron-primary-with-gemini-fallback',
      metadata: {
        symbol,
        marketData,
        query
      }
    });

    res.json({ advice, noteId: savedNote._id, format: 'markdown' });
  } catch (error) {
    console.error('Error fetching AI advice:', error?.response?.data || error.message);
    res.status(502);
    throw new Error('Failed to fetch AI reasoning from the provider chain');
  }
});

module.exports = { getTradingAdvice };

