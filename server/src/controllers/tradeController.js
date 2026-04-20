const asyncHandler = require('express-async-handler');
const Trade = require('../models/Trade');
const Portfolio = require('../models/Portfolio');

// @desc    Execute a trade
// @route   POST /api/trades
// @access  Private
const executeTrade = asyncHandler(async (req, res) => {
  const { symbol, type, quantity, price, decisionReasoning } = req.body;

  // Find portfolio
  let portfolio = await Portfolio.findOne({ user: req.user._id });
  if (!portfolio) {
    res.status(404);
    throw new Error('Portfolio not found');
  }

  const tradeCost = quantity * price;
  if (!portfolio.transactions) portfolio.transactions = [];

  if (type === 'BUY') {
    if (portfolio.totalBalance < tradeCost) {
      res.status(400);
      throw new Error('Insufficient funds');
    }
    portfolio.totalBalance -= tradeCost;
    
    portfolio.transactions.push({
      type: 'buy',
      amount: tradeCost
    });
    
    const assetIndex = portfolio.assets.findIndex(a => a.symbol === symbol);
    if (assetIndex >= 0) {
      // Average price update
      const existingAsset = portfolio.assets[assetIndex];
      const totalValue = (existingAsset.quantity * existingAsset.averagePrice) + tradeCost;
      existingAsset.quantity += quantity;
      existingAsset.averagePrice = totalValue / existingAsset.quantity;
    } else {
      portfolio.assets.push({ symbol, quantity, averagePrice: price });
    }
  } else if (type === 'SELL') {
    const assetIndex = portfolio.assets.findIndex(a => a.symbol === symbol);
    if (assetIndex === -1 || portfolio.assets[assetIndex].quantity < quantity) {
      res.status(400);
      throw new Error('Insufficient asset quantity to sell');
    }
    
    portfolio.assets[assetIndex].quantity -= quantity;
    portfolio.totalBalance += tradeCost;
    
    portfolio.transactions.push({
      type: 'sell',
      amount: tradeCost
    });
    
    // Remove asset if quantity is 0
    if (portfolio.assets[assetIndex].quantity === 0) {
      portfolio.assets.splice(assetIndex, 1);
    }
  } else {
    res.status(400);
    throw new Error('Invalid trade type');
  }

  await portfolio.save();

  // Record trade
  const trade = await Trade.create({
    user: req.user._id,
    symbol,
    type,
    quantity,
    price,
    decisionReasoning
  });

  res.status(201).json(trade);
});

// @desc    Get user trades
// @route   GET /api/trades
// @access  Private
const getTrades = asyncHandler(async (req, res) => {
  const trades = await Trade.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(trades);
});

module.exports = { executeTrade, getTrades };
