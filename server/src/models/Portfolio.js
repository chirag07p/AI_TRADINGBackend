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
  transactions: [{
    type: { type: String, enum: ['deposit', 'withdraw', 'buy', 'sell'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Completed' },
    paymentMode: { type: String, default: 'Bank Transfer' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
