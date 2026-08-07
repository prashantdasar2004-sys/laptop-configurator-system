const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  sellingPrice: { type: Number, required: true },
  baseCost: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String, default: 'System' },
  reason: { type: String, default: 'Supplier Price Update' }
});

const componentSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Processor',
      'RAM',
      'Storage',
      'Graphics Card',
      'Display',
      'Battery',
      'Keyboard',
      'Operating System'
    ]
  },
  brand: {
    type: String,
    default: 'Generic'
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  baseCost: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  stockQuantity: {
    type: Number,
    default: 10,
    min: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  wattage: {
    type: Number,
    default: 0 // For compatibility calculations
  },
  priceHistory: [priceHistorySchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Component', componentSchema);
