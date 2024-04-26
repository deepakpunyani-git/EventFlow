const { validationResult } = require('express-validator');
const EventType = require('../models/EventFlow-eventType');

// List all event types active
const listEventTypes = async (req, res) => {
  try {

    const isAdmin = req.user && req.user.usertype === 'admin';

    let query = { status: 'active' };

    if (isAdmin) {
      if(req.query.status !== undefined){
        query = {status: req.query.status};
      }else{
        query = {};

      }
    }

    const eventTypes = await EventType.find(query).sort({ name: 1 });
    return res.json(eventTypes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



// Create a new event type
const createEventType = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingEventType = await EventType.findOne({ name: req.body.name });
    if (existingEventType) {
      return res.status(400).json({ error: 'Event type with this name already exists' });
    }

    const eventType = await EventType.create(req.body);

    return res.status(201).json(eventType);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Update an existing event type by _id
const updateEventType = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const existingEventType = await EventType.findOne({ name, _id: { $ne: id } });

    if (existingEventType) {
      return res.status(400).json({ error: 'Event type with this name already exists' });
    }

    const eventType = await EventType.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }

    return res.json(eventType);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete an existing event type by _id
const deleteEventType = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEventType = await EventType.findByIdAndDelete(id);

    if (!deletedEventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  listEventTypes,
  createEventType,
  updateEventType,
  deleteEventType
};
