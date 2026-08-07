const express = require('express');
const router = express.Router();
const Quotation = require('../models/Quotation');
const Component = require('../models/Component');

// GET /api/analytics/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalQuotations = await Quotation.countDocuments();
    const totalComponents = await Component.countDocuments();

    const approvedQuotes = await Quotation.countDocuments({ status: 'Approved' });
    const pendingQuotes = await Quotation.countDocuments({ status: 'Quoted' });

    // Calculate total pipeline revenue and margin
    const quotations = await Quotation.find();
    const totalPipelineValue = quotations.reduce((acc, q) => acc + (q.pricingSummary?.finalTotal || 0), 0);
    const totalMarginProfit = quotations.reduce((acc, q) => acc + (q.pricingSummary?.marginAmount || 0), 0);

    // Component counts by category
    const categoryDistribution = await Component.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, avgSellingPrice: { $avg: '$sellingPrice' } } }
    ]);

    // Quotation Status breakdown
    const statusDistribution = await Quotation.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent 5 quotations
    const recentQuotations = await Quotation.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      summary: {
        totalQuotations,
        totalComponents,
        approvedQuotes,
        pendingQuotes,
        totalPipelineValue: Math.round(totalPipelineValue || 0),
        totalMarginProfit: Math.round(totalMarginProfit || 0),
        avgMarginPercentage: (totalPipelineValue && totalPipelineValue > 0) ? Math.round((totalMarginProfit / totalPipelineValue) * 100 * 10) / 10 : 0
      },
      categoryDistribution,
      statusDistribution,
      recentQuotations
    });
  } catch (err) {
    res.status(500).json({ message: 'Error loading dashboard analytics', error: err.message });
  }
});

module.exports = router;
