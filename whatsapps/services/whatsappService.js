const axios = require('axios');

const META_API_BASE = 'https://graph.facebook.com/v18.0';

/**
 * Send a WhatsApp message to a customer
 * @param {string} to - Recipient phone number (with country code)
 * @param {string} message - Text to send
 * @returns {Promise<Object>} API response
 */
const sendWhatsAppMessage = async (to, message) => {
  try {
    const response = await axios.post(
      `${META_API_BASE}/${process.env.META_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log(`✅ Message sent to ${to}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to send message to ${to}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Send order summary to owner via WhatsApp
 * @param {Object} orderDetails - Collected order info
 * @param {string} customerPhone - Customer's phone number
 */
const sendOrderAlertToOwner = async (orderDetails, customerPhone) => {
  const message = `
🛒 *NEW ORDER RECEIVED!*

👤 Customer: ${orderDetails.customerName}
📱 Number: ${customerPhone}
📦 Service/Product: ${orderDetails.whatTheyNeed}
📝 Details: ${orderDetails.details}
💰 Budget: ${orderDetails.budget || 'Not specified'}
⏰ Timeline: ${orderDetails.timeline || 'Not specified'}

Status: ✅ Confirmed

Reply to this thread on your business account to follow up!
  `.trim();

  await sendWhatsAppMessage(process.env.OWNER_PHONE_NUMBER, message);
  console.log(`🛒 Order alert sent to owner for ${customerPhone}`);
};

/**
 * Send escalation alert to owner via WhatsApp
 * @param {string} customerPhone - Customer's phone number
 * @param {Array} messages - Recent conversation history
 */
const sendEscalationAlertToOwner = async (customerPhone, messages) => {
  const recentChat = messages.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
  
  const message = `
🚨 *ESCALATION REQUEST!*

📱 Customer: ${customerPhone} wants to speak to a human.

📝 Recent chat:
${recentChat}

Tap to reply on your business account!
  `.trim();

  await sendWhatsAppMessage(process.env.OWNER_PHONE_NUMBER, message);
  console.log(`🚨 Escalation alert sent to owner for ${customerPhone}`);
};

/**
 * Verify webhook with Meta
 * @param {string} mode - hub.mode
 * @param {string} token - hub.verify_token
 * @returns {boolean}
 */
const verifyWebhook = (mode, token) => {
  return mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN;
};

module.exports = {
  sendWhatsAppMessage,
  sendOrderAlertToOwner,
  sendEscalationAlertToOwner,
  verifyWebhook
};
