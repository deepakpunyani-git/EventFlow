const express = require('express');
const authController = require('../controllers/authController');
const {loginValidation,adminForgotPasswordValidator,resetPasswordValidator} = require('../validators/auth.validator');

const router = express.Router();

router.post('/login',loginValidation,authController.login);
router.post('/admin-forgot-password', adminForgotPasswordValidator, authController.adminForgotPassword);
router.post('/admin-reset-password', resetPasswordValidator, authController.resetPassword);

module.exports = router;