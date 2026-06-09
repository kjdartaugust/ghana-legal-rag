const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const { getAIResponse } = require('../services/aiService');
const { sendWhatsAppMessage, sendOrderAlertToOwner, sendEscalationAlertToOwner, verifyWebhook } = require('../services/whatsappService');
const { detectIntent } = require('../utils/intentDetector');
const { processOrderStep } = require('../utils/orderStateMachine');

/**
 * GET /webhook - Meta verification endpoint
 */
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('🔍 Webhook verification attempt:', { mode, token: token?.substring(0, 10) + '...' });

  if (verifyWebhook(mode, token)) {
    console.log('✅ Webhook verified successfully');
    return res.status(200).send(challenge);
  }

  console.log('❌ Webhook verification failed - token mismatch');
  return res.sendStatus(403);
});

/**
 * POST /webhook - Receive incoming WhatsApp messages
 */
router.post('/', async (req, res) => {
  res.sendStatus(200); // Acknowledge immediately to prevent Meta retries

  try {
    const body = req.body;

    if (!body.object || body.object !== 'whatsapp_business_account') {
      return;
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages || value.messages.length === 0) {
      return; // No messages (could be status update)
    }

    const message = value.messages[0];
    const from = message.from; // Customer phone number
    const msgBody = message.text?.body?.trim() || '';

    console.log(`📩 Message from ${from}: "${msgBody.substring(0, 100)}..."`);

    // Get or create conversation
    let conversation = await Conversation.findOne({ phoneNumber: from });
    if (!conversation) {
      conversation = new Conversation({ phoneNumber: from });
    }

    // Save user message
    conversation.messages.push({
      role: 'user',
      content: msgBody,
      timestamp: new Date()
    });

    // Check escalation first
    const intent = detectIntent(msgBody);
    
    if (intent.intent === 'escalation' || conversation.escalated) {
      if (!conversation.escalated) {
        conversation.escalated = true;
        conversation.escalatedAt = new Date();
        conversation.context = 'escalated';
        await conversation.save();

        // Send escalation notice to customer
        await sendWhatsAppMessage(from, "🏃‍♂️ I'm tapping out — getting the real boss for you. Hold tight!");
        
        // Alert owner
        await sendEscalationAlertToOwner(from, conversation.messages);
        return;
      }
      
      // If already escalated, do nothing (owner handles manually)
      return;
    }

    // Handle order flow
    if (conversation.context === 'ordering' || (intent.intent === 'order' && conversation.context === 'general')) {
      if (conversation.context === 'general') {
        conversation.context = 'ordering';
        conversation.orderStep = 1;
        await sendWhatsAppMessage(from, "Let's get you sorted! What's your name? 👤");
        await conversation.save();
        return;
      }

      const orderResult = processOrderStep(conversation, msgBody);
      
      if (orderResult.confirmed) {
        // Order complete — notify owner
        await sendOrderAlertToOwner(conversation.orderDetails, from);
        await sendWhatsAppMessage(from, orderResult.response);
      } else {
        await sendWhatsAppMessage(from, orderResult.response);
      }
      
      await conversation.save();
      return;
    }

    // General conversation — use AI
    const aiMessages = conversation.messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    const aiResponse = await getAIResponse(aiMessages);

    // Save assistant message
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    await conversation.save();

    // Send AI response to customer
    await sendWhatsAppMessage(from, aiResponse);

  } catch (error) {
    console.error('❌ Error processing webhook:', error);
  }
});

module.exports = router;
