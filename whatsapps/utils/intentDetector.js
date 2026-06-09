/**
 * Detect user intent from incoming message
 * @param {string} text - Lowercase user message
 * @returns {Object} {intent, confidence}
 */
const detectIntent = (text) => {
  const lowerText = text.toLowerCase().trim();

  // Escalation keywords
  const escalationKeywords = [
    'human', 'agent', 'speak to someone', 'talk to someone', 
    'real person', 'manager', 'owner', 'your boss', 
    'i want to talk to a person', 'connect me', 'transfer',
    'speak to a human', 'talk to a human', 'human please'
  ];

  if (escalationKeywords.some(kw => lowerText.includes(kw))) {
    return { intent: 'escalation', confidence: 0.95 };
  }

  // Order keywords
  const orderKeywords = [
    'order', 'buy', 'purchase', 'get', 'want', 'need', 
    'looking for', 'interested in', 'how much', 'price',
    'can i get', 'i want to order', 'place order'
  ];

  if (orderKeywords.some(kw => lowerText.includes(kw))) {
    return { intent: 'order', confidence: 0.75 };
  }

  // Help/inquiry
  const helpKeywords = ['help', 'support', 'question', 'assist'];
  if (helpKeywords.some(kw => lowerText.includes(kw))) {
    return { intent: 'help', confidence: 0.7 };
  }

  return { intent: 'general', confidence: 0.5 };
};

module.exports = { detectIntent };
