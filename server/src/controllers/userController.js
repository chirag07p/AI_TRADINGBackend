const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Trader = require('../models/Trader');

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
});

// @desc    Update current user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;
  user.riskAppetite = req.body.riskAppetite || user.riskAppetite;
  user.preferredSpecialization = req.body.preferredSpecialization || user.preferredSpecialization;
  user.complexity = req.body.complexity || user.complexity;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  });
});

const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Trader.find({});
  res.json(employees);
});

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: 'Customer' }).select('-password');
  res.json(customers);
});

module.exports = { getUserProfile, updateUserProfile, getEmployees, getCustomers };
