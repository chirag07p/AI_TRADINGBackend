const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  traderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trader', required: true },
  matchScore: { type: Number, required: true },
  aiExplanation: { type: String },
  allocatedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['Proposed', 'Active', 'Reassigned', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Allocation', allocationSchema);
