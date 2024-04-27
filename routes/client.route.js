const express = require('express');
const router = express.Router();
const { createClient, updateClient, deleteClient } = require('../controllers/clients.controller');
const { validateClient } = require('../validators/client.validator');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/clients', verifyToken, validateClient, createClient);

router.put('/clients/:id', verifyToken, validateClient, updateClient);

router.delete('/clients/:id', verifyToken, deleteClient);

module.exports = router;