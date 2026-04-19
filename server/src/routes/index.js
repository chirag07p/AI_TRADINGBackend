const express = require('express');

const authRoutes = require('./authRoutes');
const portfolioRoutes = require('./portfolioRoutes');
const tradeRoutes = require('./tradeRoutes');
const aiRoutes = require('./aiRoutes');
const marketRoutes = require('./marketRoutes');
const userRoutes = require('./userRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const watchlistRoutes = require('./watchlistRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/trades', tradeRoutes);
router.use('/ai', aiRoutes);
router.use('/market', marketRoutes);
router.use('/user', userRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/watchlist', watchlistRoutes);

// Health check
router.get('/status', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

module.exports = router;
