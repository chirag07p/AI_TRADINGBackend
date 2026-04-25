const mongoose = require('mongoose');

const traderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  experience: { type: Number, default: 0 },
  level: { type: String, enum: ['Junior', 'Mid', 'Senior', 'Expert'], default: 'Junior' },
  specialization: [{ type: String }],
  capacity: { type: Number, default: 10 },
  currentLoad: { type: Number, default: 0 },
  performanceScore: { type: Number, default: 70 },
  isAvailable: { type: Boolean, default: true },
  bio: { type: String },
  avatar: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Trader', traderSchema);
