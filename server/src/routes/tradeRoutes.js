const express = require('express');
const { body } = require('express-validator');
const { executeTrade, getTrades } = require('../controllers/tradeController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validate');

const router = express.Router();

router.route('/')
  .post(
    protect, 
    [
      body('symbol').notEmpty().withMessage('Symbol is required'),
      body('type').isIn(['BUY', 'SELL']).withMessage('Method must be BUY or SELL'),
      body('quantity').isNumeric().withMessage('Quantity must be a number').custom(val => val > 0).withMessage('Quantity must be greater than 0'),
      body('price').isNumeric().withMessage('Price must be a number').custom(val => val > 0).withMessage('Price must be greater than 0'),
      validateRequest
    ],
    executeTrade
  )
  .get(protect, getTrades);

module.exports = router;
