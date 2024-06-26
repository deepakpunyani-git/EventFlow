const { body , query ,validationResult } = require('express-validator');

const createEventTypeValidator = [
  body('name').isString().notEmpty(),
  body('status').isString().notEmpty().isIn(['active', 'inactive']).withMessage('Invalid status value')
];
const listEventTypesValidator = [
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
  createEventTypeValidator,
  listEventTypesValidator
};
