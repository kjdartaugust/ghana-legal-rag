const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const orderDetailsSchema = new mongoose.Schema({
  customerName: { type: String, default: null },
  whatTheyNeed: { type: String, default: null },
  details: { type: String, default: null },
  budget: { type: String, default: null },
  timeline: { type: String, default: null },
  confirmed: { type: Boolean, default: false }
});

const conversationSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  messages: [messageSchema],
  context: {
    type: String,
    enum: ['general', 'ordering', 'escalated', 'completed'],
    default: 'general'
  },
  orderDetails: {
    type: orderDetailsSchema,
    default: () => ({})
  },
  orderStep: {
    type: Number,
    default: 0 // 0=none, 1=name, 2=need, 3=details, 4=budget, 5=timeline, 6=confirm
  },
  escalated: {
    type: Boolean,
    default: false
  },
  escalatedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp on every save
conversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Conversation', conversationSchema);
