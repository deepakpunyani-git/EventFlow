const express = require('express');
const router = express.Router();
const auth = require('./auth.route');
const venue = require('./venue.route');
const user = require('./user.route');
const eventType = require('./eventType.route');
const booking = require('./booking.route');
const payments = require('./payment.routes');

router.use(auth);
router.use(venue);
router.use(user);
router.use(eventType);
router.use(booking);
router.use(payments);

module.exports = router;
