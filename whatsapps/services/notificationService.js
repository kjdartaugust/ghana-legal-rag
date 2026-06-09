const { sendWhatsAppMessage } = require('./whatsappService');

/**
 * Send notification to owner via WhatsApp
 * @param {string} type - 'order' or 'escalation'
 * @param {Object} payload - Order details or escalation info
 */
const notifyOwner = async (type, payload) => {
  try {
    if (type === 'order') {
      const { orderDetails, customerPhone } = payload;
      const summary = `
🛒 *NEW ORDER*

👤 ${orderDetails.customerName}
📱 ${customerPhone}
📦 ${orderDetails.whatTheyNeed}
💰 ${orderDetails.budget || 'N/A'}
⏰ ${orderDetails.timeline || 'N/A'}

✅ Confirmed and saved.
      `.trim();
      
      await sendWhatsAppMessage(process.env.OWNER_PHONE_NUMBER, summary);
      console.log(`✅ Order notification sent to owner`);
    }
    
    else if (type === 'escalation') {
      const { customerPhone } = payload;
      const summary = `
🚨 *HUMAN REQUESTED*

📱 ${customerPhone} wants to talk to you.

I'm stepping aside — take it from here, boss! 🏃‍♂️
      `.trim();
      
      await sendWhatsAppMessage(process.env.OWNER_PHONE_NUMBER, summary);
      console.log(`✅ Escalation notification sent to owner`);
    }
  } catch (error) {
    console.error('❌ Failed to notify owner:', error.message);
  }
};

module.exports = { notifyOwner };
