const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController.js');
const { addAmountValidator, deductAmountValidator, deletePaymentValidator, updatePaymentValidator } = require('../validators/payment.validator');
const {verifyToken} = require('../middleware/authMiddleware');

router.post('/payments/add', verifyToken,addAmountValidator, paymentController.addPayment);
router.post('/payments/deduct', verifyToken,deductAmountValidator, paymentController.deductAmount);

// Delete a payment record
router.delete('/payments/:paymentId', verifyToken,deletePaymentValidator, paymentController.deletePayment);

// Update a payment record
router.put('/payments/:paymentId', verifyToken,updatePaymentValidator, paymentController.updatePayment);

// List all payments
router.get('/payments', verifyToken,paymentController.listPayments);

// View a single payment by ID
router.get('/payments/:paymentId', verifyToken,paymentController.viewPayment);

module.exports = router;
