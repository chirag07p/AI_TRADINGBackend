const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbol: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
}, { timestamps: true });

// One user can't watch the same symbol twice
watchlistSchema.index({ user: 1, symbol: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
