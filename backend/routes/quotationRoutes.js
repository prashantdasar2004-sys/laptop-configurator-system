const express = require('express');
const router = express.Router();
const Quotation = require('../models/Quotation');
const Component = require('../models/Component');

// Helper to generate unique Quote Number
const generateQuoteNumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const count = await Quotation.countDocuments();
  const seq = String(count + 1).padStart(4, '0');
  return `QUO-${dateStr}-${seq}`;
};

// GET /api/quotations - List quotations with search & filters
router.get('/', async (req, res) => {
  try {
    const { search, status, minPrice, maxPrice, startDate, endDate } = req.query;
    let filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { quoteNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { configName: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      filter['pricingSummary.finalTotal'] = {};
      if (minPrice) filter['pricingSummary.finalTotal'].$gte = Number(minPrice);
      if (maxPrice) filter['pricingSummary.finalTotal'].$lte = Number(maxPrice);
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const quotations = await Quotation.find(filter).sort({ createdAt: -1 });
    res.json(quotations);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quotations', error: err.message });
  }
});

// GET /api/quotations/:id - Get detailed quotation with price snapshot analysis
router.get('/:id', async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    // Compare saved historical snapshot vs current component catalog prices
    const componentIds = quotation.components.map(c => c.componentId);
    const currentComponents = await Component.find({ _id: { $in: componentIds } });
    const currentMap = new Map(currentComponents.map(c => [c._id.toString(), c]));

    const comparisonDetails = quotation.components.map(comp => {
      const currentComp = currentMap.get(comp.componentId.toString());
      const currentSellingPrice = currentComp ? currentComp.sellingPrice : comp.sellingPriceAtQuote;
      const currentBaseCost = currentComp ? currentComp.baseCost : comp.baseCostAtQuote;
      const priceDifference = currentSellingPrice - comp.sellingPriceAtQuote;

      return {
        ...comp.toObject(),
        currentSellingPrice,
        currentBaseCost,
        priceDifference,
        isPriceChanged: priceDifference !== 0
      };
    });

    const currentTotalSelling = comparisonDetails.reduce((sum, c) => sum + c.currentSellingPrice, 0);

    res.json({
      quotation,
      comparisonDetails,
      historicalSellingTotal: quotation.pricingSummary.componentsSubtotalSelling,
      currentSellingTotal: currentTotalSelling,
      totalCatalogPriceDelta: currentTotalSelling - quotation.pricingSummary.componentsSubtotalSelling
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching quotation details', error: err.message });
  }
});

// POST /api/quotations - Create new laptop quotation (Historical Price Preservation)
router.post('/', async (req, res) => {
  try {
    const {
      configName,
      customerName,
      customerEmail,
      customerPhone,
      componentIds, // Array of component ObjectIds selected
      discountPercentage = 0,
      taxPercentage = 10,
      notes,
      createdByName
    } = req.body;

    if (!customerName || !customerEmail) {
      return res.status(400).json({ message: 'Customer name and email are required' });
    }

    if (!componentIds || !Array.isArray(componentIds) || componentIds.length === 0) {
      return res.status(400).json({ message: 'At least one component must be selected' });
    }

    // Fetch live components from database
    const dbComponents = await Component.find({ _id: { $in: componentIds } });
    if (dbComponents.length === 0) {
      return res.status(400).json({ message: 'Selected components were not found' });
    }

    // Create Snapshots of each component with exact current price
    const snapshots = dbComponents.map(comp => ({
      componentId: comp._id,
      sku: comp.sku,
      name: comp.name,
      category: comp.category,
      brand: comp.brand,
      sellingPriceAtQuote: comp.sellingPrice,
      baseCostAtQuote: comp.baseCost,
      specifications: comp.specifications
    }));

    // Financial Calculation logic
    const subtotalCost = snapshots.reduce((sum, item) => sum + item.baseCostAtQuote, 0);
    const subtotalSelling = snapshots.reduce((sum, item) => sum + item.sellingPriceAtQuote, 0);

    const discountAmount = Math.round((subtotalSelling * (Number(discountPercentage) / 100)) * 100) / 100;
    const discountedTotal = subtotalSelling - discountAmount;
    const taxAmount = Math.round((discountedTotal * (Number(taxPercentage) / 100)) * 100) / 100;
    const finalTotal = Math.round((discountedTotal + taxAmount) * 100) / 100;

    const marginAmount = Math.round((discountedTotal - subtotalCost) * 100) / 100;
    const marginPercentage = subtotalCost > 0 
      ? Math.round(((discountedTotal - subtotalCost) / subtotalCost * 100) * 10) / 10 
      : 0;

    const quoteNumber = await generateQuoteNumber();

    const newQuotation = new Quotation({
      quoteNumber,
      configName: configName || 'Custom Laptop Configuration',
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      components: snapshots,
      pricingSummary: {
        componentsSubtotalCost: subtotalCost,
        componentsSubtotalSelling: subtotalSelling,
        discountPercentage: Number(discountPercentage),
        discountAmount,
        taxPercentage: Number(taxPercentage),
        taxAmount,
        finalTotal,
        marginAmount,
        marginPercentage
      },
      notes: notes || '',
      createdByName: createdByName || 'Sales Executive'
    });

    const savedQuotation = await newQuotation.save();
    res.status(201).json(savedQuotation);
  } catch (err) {
    console.error('Error creating quotation:', err);
    res.status(500).json({ message: 'Error generating quotation', error: err.message });
  }
});

// PUT /api/quotations/:id/status - Update Quotation Status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    quotation.status = status;
    const updatedQuotation = await quotation.save();
    res.json(updatedQuotation);
  } catch (err) {
    res.status(500).json({ message: 'Error updating quotation status', error: err.message });
  }
});

// DELETE /api/quotations/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!deletedQuotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json({ message: 'Quotation deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting quotation', error: err.message });
  }
});

module.exports = router;
