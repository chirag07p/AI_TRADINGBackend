const express = require('express');
const { getPortfolio, depositFunds, withdrawFunds } = require('../controllers/portfolioController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getPortfolio);
router.route('/deposit').post(protect, depositFunds);
router.route('/withdraw').post(protect, withdrawFunds);

module.exports = router;
