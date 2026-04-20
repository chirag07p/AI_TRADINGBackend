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

// @desc    Deposit funds
// @route   POST /api/portfolio/deposit
// @access  Private
const depositFunds = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  
  if (!amount || isNaN(amount) || amount <= 0) {
    res.status(400);
    throw new Error('Please provide a valid deposit amount');
  }

  let portfolio = await Portfolio.findOne({ user: req.user._id });
  
  if (!portfolio) {
    portfolio = await Portfolio.create({
      user: req.user._id,
      assets: [],
      totalBalance: 100000 + Number(amount)
    });
  } else {
    portfolio.totalBalance += Number(amount);
    await portfolio.save();
  }

  res.json({ 
    message: 'Deposit successful', 
    totalBalance: portfolio.totalBalance 
  });
});

// @desc    Withdraw funds
// @route   POST /api/portfolio/withdraw
// @access  Private
const withdrawFunds = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  
  if (!amount || isNaN(amount) || amount <= 0) {
    res.status(400);
    throw new Error('Please provide a valid withdrawal amount');
  }

  let portfolio = await Portfolio.findOne({ user: req.user._id });
  
  if (!portfolio) {
    res.status(400);
    throw new Error('Portfolio not found');
  }

  if (portfolio.totalBalance < Number(amount)) {
    res.status(400);
    throw new Error('Insufficient funds');
  }

  portfolio.totalBalance -= Number(amount);
  await portfolio.save();

  res.json({ 
    message: 'Withdrawal successful', 
    totalBalance: portfolio.totalBalance 
  });
});

module.exports = { getPortfolio, depositFunds, withdrawFunds };
