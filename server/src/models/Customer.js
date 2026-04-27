const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return !this.googleId; } },
  googleId: { type: String },
  phone: { type: String },
  portfolioValue: { type: Number, default: 0 },
  riskAppetite: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  complexity: { type: Number, default: 5 },
  preferredSpecialization: { type: String, default: 'Equity' },
  assignedTraderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trader', default: null },
  role: { type: String, default: 'Customer' }
}, { timestamps: true });

customerSchema.pre('save', async function() {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

customerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Customer', customerSchema);
