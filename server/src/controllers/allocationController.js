const asyncHandler = require('express-async-handler');
const { runAutoAllocation, checkReallocations, runSingleAllocation, finalizeAllocation, rejectAllocation, unassignTrader } = require('../services/allocationService');
const Allocation = require('../models/Allocation');
const User = require('../models/User');

// @desc    Run full allocation engine
// @route   POST /api/allocate
// @access  Admin
const allocateAll = asyncHandler(async (req, res) => {
  const results = await runAutoAllocation();
  res.status(200).json(results);
});

const allocateOne = asyncHandler(async (req, res) => {
  try {
    const { clientId } = req.params;
    console.log(`[AI Match] Triggering allocation for client: ${clientId}`);
    const result = await runSingleAllocation(clientId);
    res.status(200).json(result);
  } catch (err) {
    console.error(`[AI Match Error]: ${err.message}`);
    res.status(500);
    throw err;
  }
});

// @desc    Reassign a client manually
const reassignClient = asyncHandler(async (req, res) => {
  const { clientId } = req.params;
  const { traderId } = req.body;

  const client = await User.findById(clientId);
  if (!client) return res.status(404).json({ message: 'Client not found' });

  if (client.assignedTraderId) {
    await User.findByIdAndUpdate(client.assignedTraderId, { $inc: { currentLoad: -1 } });
  }

  await User.findByIdAndUpdate(traderId, { $inc: { currentLoad: 1 } });

  client.assignedTraderId = traderId;
  await client.save();

  res.status(200).json({ message: 'Client reassigned successfully' });
});

const getTriggers = asyncHandler(async (req, res) => {
  const triggers = await checkReallocations();
  res.status(200).json(triggers);
});

const getAllocations = asyncHandler(async (req, res) => {
  const allocations = await Allocation.find({})
    .populate('clientId', 'name email riskAppetite portfolioValue complexity preferredSpecialization')
    .populate('traderId', 'name email level specialization performanceScore currentLoad capacity');
  res.status(200).json(allocations);
});

const getTraderAllocations = asyncHandler(async (req, res) => {
  const allocations = await Allocation.find({ traderId: req.params.traderId, status: 'Active' })
    .populate('clientId', 'name email riskAppetite portfolioValue complexity preferredSpecialization');
  res.status(200).json(allocations);
});

const finalizeProposal = asyncHandler(async (req, res) => {
  const { allocationId } = req.body;
  const result = await finalizeAllocation(allocationId);
  res.status(200).json(result);
});

const rejectProposal = asyncHandler(async (req, res) => {
  const { allocationId } = req.body;
  const result = await rejectAllocation(allocationId);
  res.status(200).json(result);
});

const unassignClient = asyncHandler(async (req, res) => {
  const result = await unassignTrader(req.user._id);
  res.status(200).json(result);
});

module.exports = {
  allocateAll,
  allocateOne,
  reassignClient,
  getTriggers,
  getAllocations,
  getTraderAllocations,
  finalizeProposal,
  rejectProposal,
  unassignClient
};
