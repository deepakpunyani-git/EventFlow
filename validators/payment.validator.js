const { body, param } = require('express-validator');

const addAmountValidator = [
  body('amount')
  .notEmpty().withMessage('Amount is required')
  .isNumeric().withMessage('Amount must be a number').custom(value => value > 0).withMessage('Amount must be greater than zero'),  body('details').notEmpty().withMessage('Details are required'),
  body('bookingId').notEmpty().withMessage('Booking ID is required').isMongoId().withMessage('Invalid Booking ID'),
  body('paymentMode').notEmpty().withMessage('Payment mode is required').isIn(['cash', 'online', 'cc', 'check']).withMessage('Invalid payment mode')
];

const deductAmountValidator = [
  body('amount')
  .notEmpty().withMessage('Amount is required')
  .isNumeric().withMessage('Amount must be a number').custom(value => value > 0).withMessage('Amount must be greater than zero'),  body('details').notEmpty().withMessage('Details are required'),
  body('bookingId').notEmpty().withMessage('Booking ID is required').isMongoId().withMessage('Invalid Booking ID'),
  body('paymentMode').notEmpty().withMessage('Payment mode is required').isIn(['cash', 'online', 'cc', 'check']).withMessage('Invalid payment mode')
];

const deletePaymentValidator = [
  param('paymentId').notEmpty().withMessage('Payment ID is required').isMongoId().withMessage('Invalid Payment ID')
];

const updatePaymentValidator = [
  param('paymentId').notEmpty().withMessage('Payment ID is required').isMongoId().withMessage('Invalid Payment ID'),
  body('details').optional(),
  body('amount')
  .notEmpty().withMessage('Amount is required')
  .isNumeric().withMessage('Amount must be a number').custom(value => value > 0).withMessage('Amount must be greater than zero'),
    body('paymentMode').notEmpty().withMessage('Payment mode is required').isIn(['cash', 'online', 'cc', 'check']).withMessage('Invalid payment mode'),  
];

module.exports = {
  addAmountValidator,
  deductAmountValidator,
  deletePaymentValidator,
  updatePaymentValidator
};
