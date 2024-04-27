const { body, validationResult } = require('express-validator');

exports.validateClient = [
    body('clientName').notEmpty().withMessage('Client name is required'),
    body('phoneNumber')
        .notEmpty().withMessage('Phone Number is required')
        .matches(/^\d{3}-\d{3}-\d{4}$/).withMessage('Invalid phone number format. Use xxx-xxx-xxxx'),
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

