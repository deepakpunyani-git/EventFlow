const { body , query ,validationResult } = require('express-validator');

const createVenueValidator = [
  body('name').isString().notEmpty(),
  body('amount').notEmpty().withMessage('Amount is required').isNumeric().withMessage('Amount must be a number'),
  body('status').isString().notEmpty().isIn(['active', 'inactive']).withMessage('Invalid status value')
];


const listVenuesValidator = [
  query('status')
  .optional()
  .isIn(['active', 'inactive'])
  .withMessage('Status must be either "active" or "inactive"'),
(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
},
];


module.exports = {
  createVenueValidator,listVenuesValidator
};
