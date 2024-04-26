const { body,check } = require('express-validator');

const loginValidation = [
  body('usernameOrEmail').exists().trim(),
  body('password').exists().trim(),
];


const adminForgotPasswordValidator = [
  check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
];
const resetPasswordValidator = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('otp').notEmpty().withMessage('OTP is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters')
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

module.exports = {
  loginValidation,
  adminForgotPasswordValidator,
  resetPasswordValidator
};
