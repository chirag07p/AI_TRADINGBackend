const asyncHandler = require('express-async-handler');
const Portfolio = require('../models/Portfolio');

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = asyncHandler(async (req, res) => {
  let portfolio = await Portfolio.findOne({ user: req.user._id });
  
  if (!portfolio) {
    // Create empty portfolio if it doesn't exist
    portfolio = await Portfolio.create({
      user: req.user._id,
      assets: [],
      totalBalance: 100000 // Default balance
    });
  }

  res.json(portfolio);
});

module.exports = { getPortfolio };
