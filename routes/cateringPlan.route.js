const express = require('express');
const router = express.Router();
const cateringPlanController = require('../controllers/cateringPlan.controller');
const { validateCateringPlan } = require('../validators/cateringPlan.validator');
const { verifyToken } = require('../middleware/authMiddleware');

// Routes for Catering Plans
router.post('/catering-plans', verifyToken, validateCateringPlan, cateringPlanController.createCateringPlan);
router.put('/catering-plans/:id', verifyToken, validateCateringPlan, cateringPlanController.updateCateringPlan);
router.delete('/catering-plans/:id', verifyToken, cateringPlanController.deleteCateringPlan);

module.exports = router;
