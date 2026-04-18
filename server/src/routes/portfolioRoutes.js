const express = require('express');
const { getPortfolio } = require('../controllers/portfolioController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getPortfolio);

module.exports = router;
