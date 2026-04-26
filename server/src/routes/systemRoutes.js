const express = require('express');
const router = express.Router();
const { getSystemLogs, getAuditTrail, getMarketData, getTraderStats } = require('../controllers/systemController');
const { getIntelligenceStream } = require('../controllers/intelligenceController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/intelligence', getIntelligenceStream); // Public
router.get('/market', protect, getMarketData);
router.get('/performance', protect, getTraderStats);
router.get('/logs', protect, admin, getSystemLogs);
router.get('/audit', protect, admin, getAuditTrail);

module.exports = router;
