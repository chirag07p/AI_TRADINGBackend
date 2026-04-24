const express = require('express');
const { 
  allocateAll, 
  getAllocations, 
  getTraderAllocations,
  getTriggers,
  reassignClient,
  allocateOne,
  finalizeProposal,
  rejectProposal,
  unassignClient
} = require('../controllers/allocationController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, admin, allocateAll);
router.post('/finalize', protect, finalizeProposal);
router.post('/reject', protect, rejectProposal);
router.post('/unassign', protect, unassignClient);
router.post('/:clientId', protect, allocateOne);
router.get('/', protect, getAllocations);
router.get('/triggers', protect, admin, getTriggers);
router.put('/reassign/:clientId', protect, admin, reassignClient);
router.get('/trader/:traderId', protect, getTraderAllocations);

module.exports = router;
