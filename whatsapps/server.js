require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const webhookRouter = require('./routes/webhook');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Rate limiting for webhook (prevent spam)
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
  message: 'Too many requests, chill for a minute. 😎',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/webhook', webhookLimiter, webhookRouter);

// Health check (for UptimeRobot)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'alive', 
    service: 'Godspeed WhatsApp Bot',
    timestamp: new Date().toISOString()
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Godspeed is running 🚀',
    status: 'operational',
    endpoints: {
      webhook: '/webhook',
      health: '/health'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong. Godspeed is working on it. 🛠️' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`╔══════════════════════════════════════════════╗`);
  console.log(`║                                              ║`);
  console.log(`║     🚀 Godspeed is online on port ${PORT}       ║`);
  console.log(`║                                              ║`);
  console.log(`║  Webhook: http://localhost:${PORT}/webhook     ║`);
  console.log(`║  Health:  http://localhost:${PORT}/health      ║`);
  console.log(`║                                              ║`);
  console.log(`╚══════════════════════════════════════════════╝`);
});

module.exports = app;
