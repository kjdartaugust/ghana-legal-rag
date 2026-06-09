/**
 * Order State Machine
 * Manages the step-by-step order collection process
 */

const ORDER_STEPS = {
  0: 'none',
  1: 'name',
  2: 'need',
  3: 'details',
  4: 'budget',
  5: 'timeline',
  6: 'confirm'
};

/**
 * Process incoming message based on current order step
 * @param {Object} conversation - Mongoose conversation document
 * @param {string} messageText - User's message
 * @returns {Object} {response, nextStep, shouldSave}
 */
const processOrderStep = (conversation, messageText) => {
  const step = conversation.orderStep || 0;

  switch (step) {
    case 1: // Collecting name
      conversation.orderDetails.customerName = messageText.trim();
      conversation.orderStep = 2;
      return {
        response: `Nice to meet you, ${messageText.trim()}! What can I hook you up with? 📦`,
        nextStep: 2
      };

    case 2: // Collecting what they need
      conversation.orderDetails.whatTheyNeed = messageText.trim();
      conversation.orderStep = 3;
      return {
        response: `Got it. Any specific details, colors, sizes, or requirements I should note down? 📝`,
        nextStep: 3
      };

    case 3: // Collecting details
      conversation.orderDetails.details = messageText.trim();
      conversation.orderStep = 4;
      return {
        response: `Good stuff. What's your budget looking like? (Or just say "skip" if you want to discuss pricing later) 💰`,
        nextStep: 4
      };

    case 4: // Collecting budget
      const budget = messageText.toLowerCase().trim();
      if (budget === 'skip' || budget === 'no' || budget === 'n/a') {
        conversation.orderDetails.budget = 'Not specified';
      } else {
        conversation.orderDetails.budget = messageText.trim();
      }
      conversation.orderStep = 5;
      return {
        response: `And when do you need this magic to happen? (Or say "no rush") ⏰`,
        nextStep: 5
      };

    case 5: // Collecting timeline
      const timeline = messageText.toLowerCase().trim();
      if (timeline === 'no rush' || timeline === 'skip' || timeline === 'whenever') {
        conversation.orderDetails.timeline = 'No specific timeline';
      } else {
        conversation.orderDetails.timeline = messageText.trim();
      }
      conversation.orderStep = 6;
      return {
        response: generateOrderSummary(conversation.orderDetails),
        nextStep: 6
      };

    case 6: // Confirmation
      const confirmText = messageText.toLowerCase().trim();
      if (confirmText.includes('yes') || confirmText.includes('correct') || confirmText.includes('confirm') || confirmText.includes('sure')) {
        conversation.orderDetails.confirmed = true;
        conversation.orderStep = 0;
        conversation.context = 'general';
        return {
          response: `Boom! Order locked in. The boss will be notified and will hit you up soon. Thanks for rolling with Godspeed! 🚀`,
          nextStep: 0,
          confirmed: true
        };
      } else {
        // They said no or asked to change something
        conversation.orderStep = 1;
        return {
          response: `No worries, let's run it back from the top. What's your name again? 👤`,
          nextStep: 1
        };
      }

    default:
      return {
        response: `Hey! Ready to place an order? What's your name? 👋`,
        nextStep: 1
      };
  }
};

const generateOrderSummary = (details) => {
  return `
Quick sanity check — does this look right?

👤 Name: ${details.customerName}
📦 Need: ${details.whatTheyNeed}
📝 Details: ${details.details}
💰 Budget: ${details.budget || 'Not specified'}
⏰ Timeline: ${details.timeline || 'Not specified'}

Reply *yes* to confirm, or *no* to start over.
  `.trim();
};

module.exports = {
  ORDER_STEPS,
  processOrderStep
};
