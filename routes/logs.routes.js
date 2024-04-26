const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logs.controller');
const { verifyToken, checkUserType } = require('../middleware/authMiddleware');

// List all logs
router.get('/logs', verifyToken, checkUserType('admin'),logsController.listLogs);

module.exports = router;