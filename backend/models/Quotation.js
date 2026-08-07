const mongoose = require('mongoose');

const componentSnapshotSchema = new mongoose.Schema({
  componentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Component',
    required: true
  },
  sku: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, default: '' },
  
  // Snapshotted price at the exact time of quote creation (HISTORICAL PRESERVATION)
  sellingPriceAtQuote: { type: Number, required: true },
  baseCostAtQuote: { type: Number, required: true },
  
  specifications: {
    type: Map,
    of: String,
    default: {}
  }
});

const quotationSchema = new mongoose.Schema({
  quoteNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  configName: {
    type: String,
    required: true,
    trim: true,
    default: 'Custom Laptop Build'
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    default: ''
  },
  components: [componentSnapshotSchema],
  
  // Financial breakdown calculations
  pricingSummary: {
    componentsSubtotalCost: { type: Number, required: true }, // Sum of base costs
    componentsSubtotalSelling: { type: Number, required: true }, // Sum of component selling prices
    discountPercentage: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    taxPercentage: { type: Number, default: 10 },
    taxAmount: { type: Number, default: 0 },
    finalTotal: { type: Number, required: true },
    marginAmount: { type: Number, required: true }, // finalTotal - tax - subtotalCost
    marginPercentage: { type: Number, required: true }
  },
  
  status: {
    type: String,
    enum: ['Draft', 'Quoted', 'Approved', 'Rejected', 'Fulfilled'],
    default: 'Quoted'
  },
  validUntil: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days valid
  },
  notes: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdByName: {
    type: String,
    default: 'Sales Executive'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quotation', quotationSchema);
