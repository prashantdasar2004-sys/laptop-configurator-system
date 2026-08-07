require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { seedDatabase } = require('./utils/seedData');

const authRoutes = require('./routes/authRoutes');
const componentRoutes = require('./routes/componentRoutes');
const quotationRoutes = require('./routes/quotationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/laptop_configurator_db';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1 style="color: #0284c7;">⚡ OmniConfig Backend API is Running Live</h1>
      <p style="color: #475569;">System Status: <strong style="color: #16a34a;">Operational</strong></p>
      <p><a href="/api/health" style="color: #2563eb;">Check API Health (/api/health)</a></p>
    </div>
  `);
});
app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Seed API endpoint for instant re-seeding via UI or HTTP
app.post('/api/seed', async (req, res) => {
  const result = await seedDatabase();
  if (result) {
    res.json({ message: 'Database re-seeded successfully with initial laptop components and quotations' });
  } else {
    res.status(500).json({ message: 'Failed to seed database' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    dbState: mongoose.connection.readyState === 1 ? 'Connected to MongoDB' : 'Connecting/Disconnected',
    timestamp: new Date()
  });
});

// Serverless Resilient MongoDB Middleware
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000
      });
      console.log('Serverless MongoDB connected successfully.');
      const Component = require('./models/Component');
      const count = await Component.countDocuments();
      if (count === 0) {
        await seedDatabase();
      }
    } catch (err) {
      console.warn('Serverless MongoDB connection issue:', err.message);
    }
  }
  next();
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`Laptop Configuration & Pricing Backend running on port ${PORT}`);
    console.log(`API Base URL: http://localhost:${PORT}/api`);
    console.log(`=======================================================`);
  });
}

module.exports = app;

