
const { validationResult } = require('express-validator');
const Venue = require('../models/EventFlow-venue');

// List all venues
const listVenues = async (req, res) => {
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


    const venues = await Venue.find(query).sort({ name: 1 });
    return res.json(venues);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Create a new venue
const createVenue = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingVenue = await Venue.findOne({ name: req.body.name });
    if (existingVenue) {
      return res.status(400).json({ error: 'Venue with this name already exists' });
    }

    const venue = await Venue.create(req.body);

    return res.status(201).json(venue);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Update an existing venue by _id
const updateVenue = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const existingVenue = await Venue.findOne({ name, _id: { $ne: id } });

    if (existingVenue) {
      return res.status(409).json({ error: 'Venue with this name already exists' });
    }

    const venue = await Venue.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    return res.json(venue);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Delete an existing venue by _id
const deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVenue = await Venue.findByIdAndDelete(id);

    if (!deletedVenue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  listVenues,
  createVenue,
  updateVenue,
  deleteVenue
};
