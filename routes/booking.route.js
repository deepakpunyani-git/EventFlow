const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken, checkUserType } = require('../middleware/authMiddleware');
const {
  createBookingValidator,
  changeStatusValidator,
  listBookingsValidator,
  updateBookingValidator,
} = require('../validators/booking.validator');

// Create a new booking
router.post('/booking', verifyToken, createBookingValidator, bookingController.createBooking);

// Update a booking by ID
router.put('/booking/:id', verifyToken,   updateBookingValidator, bookingController.updateBooking);

// Delete a booking by ID (admin only)
router.delete('/booking/:id', verifyToken, bookingController.deleteBooking);

// Change status of a booking by ID
router.patch('/booking/:id',verifyToken,changeStatusValidator,bookingController.changeBookingStatus);

router.get('/bookings', verifyToken, listBookingsValidator, bookingController.listBookings);
router.get('/booking/:id',verifyToken, bookingController.viewBooking);

router.get('/booking/pdf/:id/',  verifyToken,bookingController.generateBookingPDF);

module.exports = router;