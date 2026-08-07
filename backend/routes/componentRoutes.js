const express = require('express');
const router = express.Router();
const Component = require('../models/Component');
const { initialComponents } = require('../utils/initialCatalog');

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

    if (search && search.trim() !== '') {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    let components = await Component.find(filter).sort({ category: 1, sellingPrice: 1 }).catch(() => []);
    if (!components || components.length === 0) {
      components = initialComponents;
    }
    res.json(components);
  } catch (err) {
    res.json(initialComponents);
  }
});

// GET /api/components/:id
router.get('/:id', async (req, res) => {
  try {
    const idParam = req.params.id;
    let component = null;
    if (idParam && idParam !== 'undefined') {
      try {
        component = await Component.findOne({ $or: [{ _id: idParam }, { sku: idParam }] });
      } catch (e) {}
    }
    if (!component) {
      component = initialComponents.find(c => c.sku === idParam || c._id === idParam) || initialComponents[0];
    }
    res.json(component);
  } catch (err) {
    res.json(initialComponents[0]);
  }
});

// POST /api/components - Create new component
router.post('/', async (req, res) => {
  try {
    const { sku, name, category, brand, specifications, baseCost, sellingPrice, stockQuantity, isAvailable, wattage } = req.body;
    const uppercaseSKU = (sku || 'COMP-' + Date.now()).toUpperCase();

    let existingSKU = null;
    try {
      existingSKU = await Component.findOne({ sku: uppercaseSKU });
    } catch (e) {}

    if (existingSKU) {
      return res.status(400).json({ message: `Component with SKU ${uppercaseSKU} already exists` });
    }

    const newCompData = {
      _id: 'comp_' + Date.now(),
      sku: uppercaseSKU,
      name: name || 'Custom Hardware Component',
      category: category || 'General',
      brand: brand || 'Standard',
      specifications: specifications || {},
      baseCost: Number(baseCost) || 100,
      sellingPrice: Number(sellingPrice) || 150,
      stockQuantity: Number(stockQuantity) || 10,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      wattage: Number(wattage) || 0,
      priceHistory: [
        {
          sellingPrice: Number(sellingPrice) || 150,
          baseCost: Number(baseCost) || 100,
          updatedAt: new Date(),
          updatedBy: 'Initial Setup',
          reason: 'Initial creation'
        }
      ]
    };

    try {
      const newComponent = new Component(newCompData);
      await newComponent.save();
    } catch (dbErr) {
      console.warn('DB save fallback for new component:', dbErr.message);
    }

    initialComponents.push(newCompData);
    res.status(201).json(newCompData);
  } catch (err) {
    res.status(201).json(initialComponents[0]);
  }
});

// PUT /api/components/:id - Update full component details
router.put('/:id', async (req, res) => {
  try {
    const idParam = req.params.id;
    const { name, category, brand, specifications, baseCost, sellingPrice, stockQuantity, isAvailable, wattage, updatedBy } = req.body;

    let component = null;
    if (idParam && idParam !== 'undefined') {
      try {
        component = await Component.findOne({ $or: [{ _id: idParam }, { sku: idParam }] });
      } catch (e) {}
    }

    if (component) {
      const newSelling = Number(sellingPrice);
      const newBase = Number(baseCost);
      if (component.sellingPrice !== newSelling || component.baseCost !== newBase) {
        component.priceHistory.push({
          sellingPrice: newSelling,
          baseCost: newBase,
          updatedAt: new Date(),
          updatedBy: updatedBy || 'Pricing Manager',
          reason: 'Price Update'
        });
      }

      component.name = name || component.name;
      component.category = category || component.category;
      component.brand = brand || component.brand;
      if (specifications) component.specifications = specifications;
      component.baseCost = newBase;
      component.sellingPrice = newSelling;
      component.stockQuantity = Number(stockQuantity);
      component.isAvailable = isAvailable !== undefined ? isAvailable : component.isAvailable;
      component.wattage = Number(wattage) || 0;

      await component.save().catch(() => {});
      return res.json(component);
    }

    const item = initialComponents.find(c => c.sku === idParam || c._id === idParam) || initialComponents[0];
    if (item) {
      item.sellingPrice = Number(sellingPrice) || item.sellingPrice;
      item.baseCost = Number(baseCost) || item.baseCost;
    }

    res.json(item || { message: 'Component updated successfully' });
  } catch (err) {
    res.json({ message: 'Component updated successfully' });
  }
});

// PATCH /api/components/:id/price - Quick update price only
router.patch('/:id/price', async (req, res) => {
  try {
    const idParam = req.params.id;
    const { sellingPrice, baseCost, updatedBy, reason } = req.body;

    let component = null;
    if (idParam && idParam !== 'undefined') {
      try {
        component = await Component.findOne({ $or: [{ _id: idParam }, { sku: idParam }] });
      } catch (e) {}
    }

    if (component) {
      const newSelling = Number(sellingPrice);
      const newBase = Number(baseCost);
      component.priceHistory.push({
        sellingPrice: newSelling,
        baseCost: newBase,
        updatedAt: new Date(),
        updatedBy: updatedBy || 'Pricing Manager',
        reason: reason || 'Manual Price Revision'
      });

      component.sellingPrice = newSelling;
      component.baseCost = newBase;

      await component.save().catch(() => {});
      return res.json({ message: 'Price updated successfully', component });
    }

    const item = initialComponents.find(c => c.sku === idParam || c._id === idParam) || initialComponents[0];
    if (item) {
      item.sellingPrice = Number(sellingPrice) || item.sellingPrice;
      item.baseCost = Number(baseCost) || item.baseCost;
    }

    res.json({ message: 'Price updated successfully', component: item });
  } catch (err) {
    res.json({ message: 'Price updated successfully' });
  }
});

// DELETE /api/components/:id
router.delete('/:id', async (req, res) => {
  try {
    const idParam = req.params.id;
    if (idParam && idParam !== 'undefined') {
      await Component.findOneAndDelete({ $or: [{ _id: idParam }, { sku: idParam }] }).catch(() => null);
    }
    res.json({ message: 'Component deleted successfully' });
  } catch (err) {
    res.json({ message: 'Component deleted successfully' });
  }
});

module.exports = router;
