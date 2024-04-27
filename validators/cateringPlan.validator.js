const { body, validationResult } = require('express-validator');

exports.validateCateringPlan = [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').notEmpty().withMessage('Price is required').isNumeric().withMessage('Price must be a number'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
