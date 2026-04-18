const express = require('express');
const { getMarketQuote, getHistoricalData } = require('../controllers/marketController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/quote/:symbol', protect, getMarketQuote);
router.get('/history/:symbol', protect, getHistoricalData);

module.exports = router;
