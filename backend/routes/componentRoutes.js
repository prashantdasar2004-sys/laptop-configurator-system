const express = require('express');
const router = express.Router();
const Component = require('../models/Component');

// GET /api/components - List all components with filtering & search
router.get('/', async (req, res) => {
  try {
    const { category, search, availableOnly } = req.query;
    let filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (availableOnly === 'true') {
      filter.isAvailable = true;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const components = await Component.find(filter).sort({ category: 1, sellingPrice: 1 }).catch(() => []);
    res.json(components || []);
  } catch (err) {
    res.json([]);
  }
});

// GET /api/components/:id
router.get('/:id', async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.json(component);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching component', error: err.message });
  }
});

// POST /api/components - Create new component
router.post('/', async (req, res) => {
  try {
    const { sku, name, category, brand, specifications, baseCost, sellingPrice, stockQuantity, isAvailable, wattage } = req.body;

    const existingSKU = await Component.findOne({ sku: sku.toUpperCase() });
    if (existingSKU) {
      return res.status(400).json({ message: `Component with SKU ${sku} already exists` });
    }

    const newComponent = new Component({
      sku: sku.toUpperCase(),
      name,
      category,
      brand,
      specifications,
      baseCost: Number(baseCost),
      sellingPrice: Number(sellingPrice),
      stockQuantity: Number(stockQuantity) || 10,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      wattage: Number(wattage) || 0,
      priceHistory: [
        {
          sellingPrice: Number(sellingPrice),
          baseCost: Number(baseCost),
          updatedAt: new Date(),
          updatedBy: 'Initial Setup',
          reason: 'Initial creation'
        }
      ]
    });

    const savedComponent = await newComponent.save();
    res.status(201).json(savedComponent);
  } catch (err) {
    res.status(500).json({ message: 'Error creating component', error: err.message });
  }
});

// PUT /api/components/:id - Update full component details
router.put('/:id', async (req, res) => {
  try {
    const { name, category, brand, specifications, baseCost, sellingPrice, stockQuantity, isAvailable, wattage, updatedBy } = req.body;

    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    // Track price history if prices changed
    const oldSelling = component.sellingPrice;
    const oldBase = component.baseCost;
    const newSelling = Number(sellingPrice);
    const newBase = Number(baseCost);

    if (oldSelling !== newSelling || oldBase !== newBase) {
      component.priceHistory.push({
        sellingPrice: newSelling,
        baseCost: newBase,
        updatedAt: new Date(),
        updatedBy: updatedBy || 'Pricing Manager',
        reason: 'Price Update'
      });
    }

    component.name = name;
    component.category = category;
    component.brand = brand || component.brand;
    if (specifications) component.specifications = specifications;
    component.baseCost = newBase;
    component.sellingPrice = newSelling;
    component.stockQuantity = Number(stockQuantity);
    component.isAvailable = isAvailable !== undefined ? isAvailable : component.isAvailable;
    component.wattage = Number(wattage) || 0;

    const updatedComponent = await component.save();
    res.json(updatedComponent);
  } catch (err) {
    res.status(500).json({ message: 'Error updating component', error: err.message });
  }
});

// PATCH /api/components/:id/price - Quick update price only
router.patch('/:id/price', async (req, res) => {
  try {
    const { sellingPrice, baseCost, updatedBy, reason } = req.body;
    const component = await Component.findById(req.params.id);
    
    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    const newSelling = Number(sellingPrice);
    const newBase = Number(baseCost || component.baseCost);

    component.priceHistory.push({
      sellingPrice: newSelling,
      baseCost: newBase,
      updatedAt: new Date(),
      updatedBy: updatedBy || 'Pricing Executive',
      reason: reason || 'Supplier Tariff Update'
    });

    component.sellingPrice = newSelling;
    component.baseCost = newBase;

    const updatedComponent = await component.save();
    res.json(updatedComponent);
  } catch (err) {
    res.status(500).json({ message: 'Error updating component price', error: err.message });
  }
});

// DELETE /api/components/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedComponent = await Component.findByIdAndDelete(req.params.id);
    if (!deletedComponent) {
      return res.status(404).json({ message: 'Component not found' });
    }
    res.json({ message: 'Component deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting component', error: err.message });
  }
});

module.exports = router;
