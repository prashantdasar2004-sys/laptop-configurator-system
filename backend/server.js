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

// Database Connection & Server Initialization
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully.');
    // Check if database is empty, auto-seed if needed
    const Component = require('./models/Component');
    const count = await Component.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Auto-seeding initial dataset...');
      await seedDatabase();
    }
  })
  .catch(async (err) => {
    console.warn('MongoDB standalone connection failed:', err.message);
    console.warn('Attempting to initialize application in resilient mock mode...');
  });

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`Laptop Configuration & Pricing Backend running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`=======================================================`);
});
