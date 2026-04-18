const express = require('express');
const { body } = require('express-validator');
const { registerUser, authUser } = require('../controllers/authController');
const validateRequest = require('../middlewares/validate');

const router = express.Router();

router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validateRequest
], registerUser);

router.post('/login', [
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').exists().withMessage('Password is required'),
  validateRequest
], authUser);

module.exports = router;
