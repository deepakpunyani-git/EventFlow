const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, checkUserType } = require('../middleware/authMiddleware');
const { createStaffValidator,createAdminValidator,newPasswordValidator,updateUserValidator,updatePasswordValidator } = require('../validators/user.validator');


// Create a new admin
router.post('/users/add-admin', verifyToken, checkUserType('admin'), createAdminValidator, userController.createAdmin);

// Create a new staff member
router.post('/users/add-staff', verifyToken, checkUserType('admin'), createStaffValidator, userController.createStaff);

// Update staff member's password by admin
router.put('/users/staff-password-change/:id',verifyToken,checkUserType('admin'),newPasswordValidator,userController.updateStaffPassword);
  
  // Update staff member's information by admin
  router.put(
    '/users/staff/:id',
    verifyToken,
    checkUserType('admin'),
    updateUserValidator,
    userController.updateStaff
  );
  

  router.put(
    '/users/update-profile',
    verifyToken,
    checkUserType('admin'),
    updateUserValidator,
    userController.updateProfile
  );

  router.put(
    '/users/update-password',
    verifyToken,
    checkUserType('admin'),
    updatePasswordValidator,
    userController.updateLoggedInUserPassword
  );

  router.get('/users', verifyToken, checkUserType('admin'), userController.listUsers);
  router.get('/users/:id', verifyToken, checkUserType('admin'), userController.getUser);

module.exports = router;