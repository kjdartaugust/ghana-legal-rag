const axios = require('axios');
const { buildSystemPrompt } = require('../utils/promptBuilder');

const SYSTEM_PROMPT = buildSystemPrompt();

/**
 * Send message history to OpenRouter and get AI response
 * @param {Array} messages - Array of {role, content} message objects
 * @returns {Promise<string>} AI response text
 */
const getAIResponse = async (messages) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.slice(-20) // Keep last 20 messages for context (cost control)
        ],
        temperature: 0.8,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://godspeed-bot.onrender.com',
          'X-Title': 'Godspeed WhatsApp Bot'
        },
        timeout: 30000
      }
    );

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('Invalid response structure from OpenRouter');
    }

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ OpenRouter API error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return "Hey boss, I'm having trouble with my brain connection. Mind checking if my API key is valid? 🔑";
    }
    if (error.response?.status === 429) {
      return "Whoa, too many messages! Give me a sec to catch my breath. 😮‍💨";
    }
    
    return "Oof, my circuits are a bit overloaded right now. Can you try again in a moment? ⚡";
  }
};

module.exports = { getAIResponse };
