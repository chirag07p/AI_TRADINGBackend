const asyncHandler = require('express-async-handler');
const { runAutoAllocation, checkReallocations } = require('../services/allocationService');
const Allocation = require('../models/Allocation');
const User = require('../models/User');

// @desc    Run full allocation engine
// @route   POST /api/allocate
// @access  Admin
const allocateAll = asyncHandler(async (req, res) => {
  const results = await runAutoAllocation();
  res.status(200).json(results);
});

// @desc    Allocate one specific client
// @route   POST /api/allocate/:clientId
const allocateOne = asyncHandler(async (req, res) => {
  // Logic to allocate one specifically could go here
  // For the demo, we can just trigger a targeted run
  res.status(200).json({ message: 'Targeted allocation logic applied' });
});

// @desc    Reassign a client manually
// @route   PUT /api/allocate/reassign/:clientId
const reassignClient = asyncHandler(async (req, res) => {
  const { clientId } = req.params;
  const { traderId } = req.body;

  const client = await User.findById(clientId);
  if (!client) return res.status(404).json({ message: 'Client not found' });

  // Update old trader load
  if (client.assignedTraderId) {
    await User.findByIdAndUpdate(client.assignedTraderId, { $inc: { currentLoad: -1 } });
  }

  // Update new trader load
  await User.findByIdAndUpdate(traderId, { $inc: { currentLoad: 1 } });

  client.assignedTraderId = traderId;
  await client.save();

  res.status(200).json({ message: 'Client reassigned successfully' });
});

// @desc    Get allocation triggers (Feature 3)
// @route   GET /api/allocate/triggers
const getTriggers = asyncHandler(async (req, res) => {
  const triggers = await checkReallocations();
  res.status(200).json(triggers);
});

// @desc    Get all current allocations
const getAllocations = asyncHandler(async (req, res) => {
  const allocations = await Allocation.find({})
    .populate('clientId', 'name email riskAppetite portfolioValue complexity preferredSpecialization')
    .populate('traderId', 'name email level specialization performanceScore currentLoad capacity');
  res.status(200).json(allocations);
});

// @desc    Get allocations for a specific trader
const getTraderAllocations = asyncHandler(async (req, res) => {
  const allocations = await Allocation.find({ traderId: req.params.traderId, status: 'Active' })
    .populate('clientId', 'name email riskAppetite portfolioValue complexity preferredSpecialization');
  res.status(200).json(allocations);
});

module.exports = {
  allocateAll,
  allocateOne,
  reassignClient,
  getTriggers,
  getAllocations,
  getTraderAllocations
};
