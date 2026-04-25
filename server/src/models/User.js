const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['Customer', 'Employee', 'Admin'], default: 'Customer' },
  
  // Trader specific fields
  experience: { type: Number, default: 0 }, // Years of experience
  level: { type: String, enum: ['Junior', 'Mid', 'Senior', 'Expert'], default: 'Junior' },
  specialization: [{ type: String }], // e.g. ["Forex", "Equity"]
  capacity: { type: Number, default: 10 },
  currentLoad: { type: Number, default: 0 },
  performanceScore: { type: Number, default: 70 },
  isAvailable: { type: Boolean, default: true },
  
  // Customer specific fields
  portfolioValue: { type: Number, default: 0 },
  riskAppetite: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  complexity: { type: Number, default: 1 }, // 1-10
  preferredSpecialization: { type: String, default: 'Equity' },
  assignedTraderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trader', default: null }
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
