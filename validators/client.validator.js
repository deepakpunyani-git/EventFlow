const { body, validationResult } = require('express-validator');

exports.validateClient = [
    body('clientName').notEmpty().withMessage('Client name is required'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('email').optional().isEmail().withMessage('Invalid email address'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];



