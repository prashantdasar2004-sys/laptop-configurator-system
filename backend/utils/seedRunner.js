const mongoose = require('mongoose');
const { seedDatabase } = require('./seedData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/laptop_configurator_db';

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    await seedDatabase();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Failed to run seed script:', err);
    process.exit(1);
  }
}

run();
