const asyncHandler = require('express-async-handler');

// @desc    Get mock real-time market data
// @route   GET /api/market/quote/:symbol
// @access  Private
const getMarketQuote = asyncHandler(async (req, res) => {
  const { symbol } = req.params;

  // In a real application, you would connect to Binance, Alpha Vantage, Polygon.io, etc.
  // Example for simulated data generation:
  const mockPrice = (Math.random() * 500 + 50).toFixed(2);
  const mockChange = (Math.random() * 10 - 5).toFixed(2);
  
  res.json({
    symbol: symbol.toUpperCase(),
    price: Number(mockPrice),
    change: Number(mockChange),
    timestamp: new Date().toISOString()
  });
});

// @desc    Get historical market data for charts
// @route   GET /api/market/history/:symbol
// @access  Private
const getHistoricalData = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  const { timeframe = '1D' } = req.query; // 1D, 1W, 1M

  // Generate mock history chart data
  const data = [];
  let currentPrice = 150.0;

  for(let i=0; i<30; i++) {
    currentPrice += (Math.random() * 4 - 2);
    data.push({
      date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: Number(currentPrice.toFixed(2))
    });
  }

  res.json({
    symbol: symbol.toUpperCase(),
    timeframe,
    data
  });
});

module.exports = { getMarketQuote, getHistoricalData };
