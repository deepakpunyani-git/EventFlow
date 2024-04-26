const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venue.controller');
const { createVenueValidator , listVenuesValidator } = require('../validators/venue.validator');
const {verifyToken,checkUserType} = require('../middleware/authMiddleware');

// List all venues
router.get('/venues', verifyToken, listVenuesValidator, venueController.listVenues);

// Create a new venue
router.post('/venue', verifyToken, checkUserType('admin'), createVenueValidator, venueController.createVenue);

// Update an existing venue by _id
router.put('/venue/:id', verifyToken, checkUserType('admin'), createVenueValidator, venueController.updateVenue);

// Delete an existing venue by _id
router.delete('/venue/:id', verifyToken, checkUserType('admin'),venueController.deleteVenue);

module.exports = router;
