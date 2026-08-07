const express = require('express');
const router = express.Router();
const Quotation = require('../models/Quotation');
const Component = require('../models/Component');

// GET /api/analytics/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalQuotations = await Quotation.countDocuments().catch(() => 0);
    const totalComponents = await Component.countDocuments().catch(() => 0);

    const approvedQuotes = await Quotation.countDocuments({ status: 'Approved' }).catch(() => 0);
    const pendingQuotes = await Quotation.countDocuments({ status: 'Quoted' }).catch(() => 0);

    // Calculate total pipeline revenue and margin
    const quotations = await Quotation.find().catch(() => []);
    const totalPipelineValue = quotations.reduce((acc, q) => acc + (q.pricingSummary?.finalTotal || 0), 0);
    const totalMarginProfit = quotations.reduce((acc, q) => acc + (q.pricingSummary?.marginAmount || 0), 0);

    // Component counts by category
    const categoryDistribution = await Component.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, avgSellingPrice: { $avg: '$sellingPrice' } } }
    ]).catch(() => []);

    // Quotation Status breakdown
    const statusDistribution = await Quotation.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).catch(() => []);

    // Recent 5 quotations
    const recentQuotations = await Quotation.find().sort({ createdAt: -1 }).limit(5).catch(() => []);

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
      categoryDistribution: categoryDistribution || [],
      statusDistribution: statusDistribution || [],
      recentQuotations: recentQuotations || []
    });
  } catch (err) {
    res.json({
      summary: {
        totalQuotations: 0,
        totalComponents: 0,
        approvedQuotes: 0,
        pendingQuotes: 0,
        totalPipelineValue: 0,
        totalMarginProfit: 0,
        avgMarginPercentage: 0
      },
      categoryDistribution: [],
      statusDistribution: [],
      recentQuotations: []
    });
  }
});

module.exports = router;
