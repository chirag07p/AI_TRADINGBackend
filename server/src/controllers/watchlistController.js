const asyncHandler = require('express-async-handler');
const Watchlist = require('../models/Watchlist');

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = asyncHandler(async (req, res) => {
  const items = await Watchlist.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
});

// @desc    Add symbol to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = asyncHandler(async (req, res) => {
  const { symbol, notes } = req.body;

  if (!symbol) {
    res.status(400);
    throw new Error('Symbol is required');
  }

  const exists = await Watchlist.findOne({ user: req.user._id, symbol: symbol.toUpperCase() });
  if (exists) {
    res.status(400);
    throw new Error('Symbol already in watchlist');
  }

  const item = await Watchlist.create({
    user: req.user._id,
    symbol: symbol.toUpperCase(),
    notes: notes || '',
  });

  res.status(201).json(item);
});

// @desc    Remove symbol from watchlist
// @route   DELETE /api/watchlist/:id
// @access  Private
const removeFromWatchlist = asyncHandler(async (req, res) => {
  const item = await Watchlist.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Watchlist item not found');
  }

  if (item.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  await item.deleteOne();
  res.json({ message: 'Removed from watchlist' });
});

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
