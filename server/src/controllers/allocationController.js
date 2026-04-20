const asyncHandler = require('express-async-handler');
const { runAutoAllocation } = require('../services/allocationService');
const Allocation = require('../models/Allocation');
const User = require('../models/User');

// @desc    Run full allocation engine
// @route   POST /api/allocate
// @access  Admin
const allocateAll = asyncHandler(async (req, res) => {
  const results = await runAutoAllocation();
  res.status(200).json(results);
});

// @desc    Get all current allocations
// @route   GET /api/allocations
// @access  Admin/Employee
const getAllocations = asyncHandler(async (req, res) => {
  const allocations = await Allocation.find({})
    .populate('clientId', 'name email riskAppetite portfolioValue')
    .populate('traderId', 'name email level specialization');
  res.status(200).json(allocations);
});

// @desc    Get allocations for a specific trader
// @route   GET /api/allocations/trader/:traderId
// @access  Employee
const getTraderAllocations = asyncHandler(async (req, res) => {
  const allocations = await Allocation.find({ traderId: req.params.traderId, status: 'Active' })
    .populate('clientId', 'name email riskAppetite portfolioValue complexity preferredSpecialization');
  res.status(200).json(allocations);
});

module.exports = {
  allocateAll,
  getAllocations,
  getTraderAllocations
};
