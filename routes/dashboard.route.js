const express = require('express');
const router = express.Router();
const dashboard = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, dashboard.getDashboardData);


module.exports = router;
