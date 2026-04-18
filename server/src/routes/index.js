const express = require('express');

const authRoutes = require('./authRoutes');
const portfolioRoutes = require('./portfolioRoutes');
const tradeRoutes = require('./tradeRoutes');
const aiRoutes = require('./aiRoutes');
const marketRoutes = require('./marketRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/trades', tradeRoutes);
router.use('/ai', aiRoutes);
router.use('/market', marketRoutes);

// Health check
router.get('/status', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

module.exports = router;
