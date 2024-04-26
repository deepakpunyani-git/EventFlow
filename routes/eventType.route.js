const express = require('express');
const app = express();

const router = express.Router();
const eventTypeController = require('../controllers/eventTypeController');
const { createEventTypeValidator , listEventTypesValidator } = require('../validators/eventType.validator');
const {verifyToken,checkUserType} = require('../middleware/authMiddleware');

// List all event types
router.get('/event-types' , verifyToken ,listEventTypesValidator,eventTypeController.listEventTypes);

// Create a new event type
router.post('/event-type', verifyToken , checkUserType('admin') , createEventTypeValidator, eventTypeController.createEventType);

// Update an existing event type by _id
router.put('/event-type/:id', verifyToken , checkUserType('admin') ,  createEventTypeValidator, eventTypeController.updateEventType);

// Delete an existing event type by _id
router.delete('/event-type/:id', verifyToken , eventTypeController.deleteEventType);

module.exports = router;
