const express = require('express');
const router = express.Router();
const cateringPlanController = require('../controllers/cateringPlan.controller');
const { validateCateringPlan , listCateringPlanValidator } = require('../validators/cateringPlan.validator');
const { verifyToken } = require('../middleware/authMiddleware');

// Routes for Catering Plans
router.post('/cateringPlan', verifyToken, validateCateringPlan, cateringPlanController.createCateringPlan);
router.put('/cateringPlan/:id', verifyToken, validateCateringPlan, cateringPlanController.updateCateringPlan);
router.delete('/cateringPlan/:id', verifyToken, cateringPlanController.deleteCateringPlan);
router.get('/cateringPlans', verifyToken, listCateringPlanValidator, cateringPlanController.getCateringPlans);

module.exports = router;
