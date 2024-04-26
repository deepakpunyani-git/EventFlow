const { check , body } = require('express-validator');

const createStaffValidator = [
  body('firstname').notEmpty().withMessage('First name is required'),
  body('lastname').notEmpty().withMessage('Last name is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('jobRole').optional(),
  body('password')
  .notEmpty().withMessage('Password is required')
  .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters')
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const createAdminValidator = [
  body('firstname').notEmpty().withMessage('First name is required'),
  body('lastname').notEmpty().withMessage('Last name is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('jobRole').optional(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
];

const newPasswordValidator = [
  check('newPassword')
  .notEmpty().withMessage('Password is required')
  .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters')
  .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

const updateUserValidator = [
  check('firstname').notEmpty().withMessage('Firstname is required'),
  check('lastname').notEmpty().withMessage('Lastname is required'),
  check('jobRole').notEmpty().withMessage('Job role is required'),
];

const updatePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];


module.exports = {
  createStaffValidator,createAdminValidator,newPasswordValidator,updateUserValidator,updatePasswordValidator

};
