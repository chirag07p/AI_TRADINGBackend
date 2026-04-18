const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true // One user, one portfolio
  },
  assets: [{
    symbol: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    averagePrice: { type: Number, required: true, min: 0 },
  }],
  totalBalance: { type: Number, default: 100000 }, // Default paper trading balance
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
