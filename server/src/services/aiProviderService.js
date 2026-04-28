const axios = require('axios');
const { OpenRouter } = require('@openrouter/sdk');

const NEMOTRON_MODEL = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free';
const GEMINI_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-latest'
].filter(Boolean);

const getOpenRouterClient = () => new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY
});

const getGeminiApiKey = () => process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const readStreamText = async (stream) => {
  let content = '';

  for await (const chunk of stream) {
    const chunkText = chunk.choices[0]?.delta?.content;
    if (chunkText) {
      content += chunkText;
    }
  }

  return content.trim();
};

const extractGeminiText = (data) => {
  const candidates = data?.candidates || [];
  const parts = candidates[0]?.content?.parts || [];

  return parts
    .map((part) => part.text || '')
    .join('')
    .trim();
};

const runNemotronPrompt = async (prompt) => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured.');
  }

  const openrouter = getOpenRouterClient();
  const stream = await openrouter.chat.send({
    chatRequest: {
      model: NEMOTRON_MODEL,
      messages: [{ role: 'user', content: prompt }],
      stream: true
    }
  });

  const responseText = await readStreamText(stream);
  if (!responseText) {
    throw new Error('Nemotron returned an empty response.');
  }

  return responseText;
};

const runGeminiPrompt = async (prompt) => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is not configured.');
  }

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ]
        },
        {
          params: { key: apiKey },
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000
        }
      );

      const responseText = extractGeminiText(response.data);
      if (responseText) {
        return responseText;
      }

      throw new Error(`Gemini returned an empty response for ${model}.`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Gemini generation failed.');
};

const generateAiText = async (prompt) => {
  try {
    return await runNemotronPrompt(prompt);
  } catch (primaryError) {
    console.error('Nemotron AI error:', primaryError.message);

    try {
      return await runGeminiPrompt(prompt);
    } catch (fallbackError) {
      console.error('Gemini fallback error:', fallbackError.message);
      throw new Error(
        `Primary Nemotron request failed: ${primaryError.message}; Gemini fallback failed: ${fallbackError.message}`
      );
    }
  }
};

module.exports = {
  generateAiText,
  runNemotronPrompt,
  runGeminiPrompt
};