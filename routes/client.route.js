const express = require('express');
const router = express.Router();
const { createClient, updateClient, deleteClient, getClients , getClient } = require('../controllers/clients.controller'); // Update import here
const { validateClient } = require('../validators/client.validator');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/clients', verifyToken, validateClient,createClient);
router.put('/clients/:id', verifyToken, validateClient, updateClient);
router.delete('/clients/:id', verifyToken, deleteClient);
router.get('/clients', verifyToken, getClients);
router.get('/client/:id', verifyToken , getClient);

module.exports = router;
