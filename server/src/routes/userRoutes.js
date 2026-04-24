const express = require('express');
const { getUserProfile, updateUserProfile, getEmployees, getCustomers } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/employees', protect, getEmployees);
router.get('/customers', protect, getCustomers);

module.exports = router;
