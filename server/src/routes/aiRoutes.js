const express = require('express');
const { getTradingAdvice } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/advice', protect, getTradingAdvice);

module.exports = router;
