const express = require('express');
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getWatchlist)
  .post(protect, addToWatchlist);

router.delete('/:id', protect, removeFromWatchlist);

module.exports = router;
