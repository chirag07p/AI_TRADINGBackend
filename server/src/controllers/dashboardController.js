const asyncHandler = require('express-async-handler');
const Portfolio = require('../models/Portfolio');
const Trade = require('../models/Trade');
const User = require('../models/User');
const { checkReallocations } = require('../services/allocationService');
const { getPredictiveAnalysis } = require('../services/predictiveService');

// @desc    Get dashboard summary (portfolio + recent trades + stats)
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = asyncHandler(async (req, res) => {
  let portfolio = await Portfolio.findOne({ user: req.user._id });

  if (!portfolio) {
    portfolio = await Portfolio.create({
      user: req.user._id,
      assets: [],
      totalBalance: 100000,
    });
  }

  const trades = await Trade.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10);

  const totalTrades = await Trade.countDocuments({ user: req.user._id });
  const buyTrades = await Trade.countDocuments({ user: req.user._id, type: 'BUY' });
  const sellTrades = await Trade.countDocuments({ user: req.user._id, type: 'SELL' });

  // Calculate total invested value across portfolio assets
  const portfolioValue = portfolio.assets.reduce((sum, asset) => {
    return sum + (asset.quantity * asset.averagePrice);
  }, 0);

  let alerts = [];
  let prediction = null;

  if (req.user.role === 'Admin') {
    alerts = await checkReallocations();
    const allCustomers = await User.find({ role: 'Customer' });
    const allEmployees = await User.find({ role: 'Employee' });
    prediction = await getPredictiveAnalysis(allCustomers, allEmployees);
  }

  res.json({
    portfolio: {
      totalBalance: portfolio.totalBalance,
      assets: portfolio.assets,
      portfolioValue,
      netWorth: portfolio.totalBalance + portfolioValue,
    },
    recentTrades: trades,
    stats: {
      totalTrades,
      buyTrades,
      sellTrades,
      assetsHeld: portfolio.assets.length,
    },
    // Feature 3 & 6: Admin Alerts
    alerts,
    prediction
  });
});

module.exports = { getDashboardSummary };
