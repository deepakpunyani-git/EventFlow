const express = require('express');
const router = express.Router();
const decorController = require('../controllers/decor.controller');
const { validateDecor , listDecorValidator } = require('../validators/decor.validator');
const { verifyToken } = require('../middleware/authMiddleware');

// Routes for Decor
router.post('/decor', verifyToken, validateDecor, decorController.createDecor);
router.put('/decor/:id', verifyToken, validateDecor, decorController.updateDecor);
router.delete('/decor/:id', verifyToken, decorController.deleteDecor);
router.get('/decors', verifyToken, listDecorValidator, decorController.getDecors);

module.exports = router;
