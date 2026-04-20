const express = require('express');
const router = express.Router();
const { allocateAll, getAllocations, getTraderAllocations } = require('../controllers/allocationController');

router.post('/', allocateAll);
router.get('/', getAllocations);
router.get('/trader/:traderId', getTraderAllocations);

module.exports = router;
