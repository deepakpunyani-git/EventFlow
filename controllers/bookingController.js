const Booking = require('../models/EventFlow-booking');
const { validationResult } = require('express-validator');
const Log = require('../models/EventFlow-logs');
const PDFDocument = require('pdfkit');
require('dotenv').config();

const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

// Set up Google OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// Set access token if available
oAuth2Client.setCredentials({
  access_token:  process.env.ACCESS_TOKEN,
  refresh_token:  process.env.REFRESH_TOKEN,
});

// Set up the Calendar API
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });


// Convert booking date to MongoDB date format (yyyy-mm-dd)
const convertBookingDate = (value) => {
  const [day, month, year] = value.split('-');
  
  const mongoDBDate = new Date(`${year}-${month}-${day}`);
  
  return mongoDBDate;
};

const listBookings = async (req, res) => {
  try {
    const { status, clientName, phoneNumber, bookingType, venue, fromDate, toDate, page, limit, sortBy, sortOrder } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (clientName) filter.clientName = clientName;
    if (phoneNumber) filter.phoneNumber = phoneNumber;
    if (bookingType) filter.bookingType = bookingType;
    if (venue) filter.venue = venue;
    if (fromDate || toDate) {
      filter.bookingDate = {};
      if (fromDate) filter.bookingDate.$gte = new Date(fromDate);
      if (toDate) filter.bookingDate.$lte = new Date(toDate);
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const skip = (pageNumber - 1) * limitNumber;

    const bookingsQuery = Booking.find(filter)
      .select('clientName email phoneNumber details bookingDate eventType bookingType receivedAmount totalAmount venue status')
      .populate('createdBy', 'firstname lastname')
      .populate('venue', 'name')
      .populate('eventType', 'name');

    if (sortBy) {
      const sortFields = sortBy.split(',').map(field => field.trim());
      const sortOrderValue = sortOrder && sortOrder.toLowerCase() === 'desc' ? -1 : 1;
      const sortObject = sortFields.reduce((sortObj, field) => {
        sortObj[field] = sortOrderValue;
        return sortObj;
      }, {});
      bookingsQuery.sort(sortObject);
    }

    const totalBookingsCount = await Booking.countDocuments(filter);

    const totalPages = Math.ceil(totalBookingsCount / limitNumber);

    const bookings = await bookingsQuery
      .skip(skip)
      .limit(limitNumber);

    const pagination = {
      currentPage: pageNumber,
      totalPages: totalPages,
      firstPage: 1,
      lastPage: totalPages,
    };

    res.status(200).json({ bookings, pagination });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Create a new booking
const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const createdBy = req.user ? req.user._id : null;
    req.body.bookingDate = convertBookingDate(req.body.bookingDate);

    const existingBooking = await Booking.find({
      bookingDate: req.body.bookingDate,
      venue: req.body.venue,
    });
  
    if (existingBooking.length > 0) {
      const isFullDayBooking = req.body.bookingType === 'full day';
      const hasFullDayBooking = existingBooking.some(booking => booking.bookingType === 'full day');
      const hasSameBookingType = existingBooking.some(booking => booking.bookingType === req.body.bookingType);

      if (isFullDayBooking || hasFullDayBooking || hasSameBookingType) {
        return res.status(400).json({ error: 'Booking not available for the specified conditions.' });
      }
    }

    const newBooking = await Booking.create({ ...req.body, createdBy });

    // Create event on Google Calendar
    const eventId = await createEventOnCalendar(newBooking);

    // Save the event ID in MongoDB
    newBooking.googleEventId = 123;
    await newBooking.save();

    await Log.create({
      description: `Created a new booking with ID ${newBooking._id}`,
      status: 'booking',
      createdBy,
      bookingId: newBooking._id,
    });

    return res.status(201).json({ data: newBooking, message: "Booking Created" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

// Update booking
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await Booking.updateOne(
      { _id: id },
      { $set: { ...req.body, updatedBy: req.user ? req.user._id : null } }
    );

    await Log.create({
      description: `Updated booking with ID ${booking._id}`,
      status: 'booking',
      createdBy: req.user ? req.user._id : null,
      bookingId: booking._id,
    });

    return res.json(booking);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

// Change Status
const changeBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { $set: { status }, updatedBy: req.user ? req.user._id : null, dateUpdated: Date.now() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await Log.create({
      description: `Changed booking status to ${status} for booking with ID ${booking._id}`,
      status: 'booking',
      createdBy: req.user ? req.user._id : null,
    });

    return res.json(booking);
    
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

// delete booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the booking
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await deleteCalendarEvent(deletedBooking.googleEventId);

    await Log.create({
      description: `Deleted booking with ID ${deletedBooking._id}`,
      status: 'booking',
      createdBy: req.user ? req.user._id : null,
      bookingId: deletedBooking._id,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return res.status(400).json({ error: error.message });
  }
};


// Single booking view
const viewBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .select('clientName email phoneNumber details bookingDate eventType bookingType receivedAmount totalAmount venue status')
      .populate('venue', 'name')
      .populate('eventType', 'name')

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.json(booking);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const generateBookingPDF = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${booking.clientName}_booking.pdf`);

    doc.pipe(res);

    doc.fontSize(18).text('Booking Detail', { align: 'center' });
    doc.fontSize(14).text(`Client Name: ${booking.clientName}`);
    doc.fontSize(14).text(`Email: ${booking.email}`);
    doc.fontSize(14).text(`Phone Number: ${booking.phoneNumber}`);
    doc.fontSize(14).text(`Booking Date: ${booking.bookingDate}`);
    doc.fontSize(14).text(`Event Type: ${booking.eventType}`);
    doc.fontSize(14).text(`Booking Type: ${booking.bookingType}`);
    doc.fontSize(14).text(`Venue: ${booking.venue}`);
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const createEventOnCalendar = async (booking) => {
  try {
    const event = {
      summary: `${booking.clientName} - ${booking.phoneNumber}`,
      description: booking.details,
      start: {
        dateTime: booking.bookingDate,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: booking.bookingEndDate, 
        timeZone: 'Asia/Kolkata',
      },
    };

    const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
    });

    console.log(response);

    return response.data.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error('Failed to create event on Google Calendar');
  }
};


module.exports = {
  createBooking,
  updateBooking,
  changeBookingStatus,
  deleteBooking,
  listBookings,
  viewBooking,
  generateBookingPDF
};


