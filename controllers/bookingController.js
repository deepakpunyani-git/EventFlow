const Booking = require('../models/EventFlow-booking');
const { validationResult } = require('express-validator');
const Log = require('../models/EventFlow-logs');
const PDFDocument = require('pdfkit');
require('dotenv').config();

// Convert booking date to MongoDB date format (yyyy-mm-dd)
const convertBookingDate = (value) => {
  const [day, month, year] = value.split('-');
  
  const mongoDBDate = new Date(`${year}-${month}-${day}`);
  
  return mongoDBDate;
};

const listBookings = async (req, res) => {
  try {
    const { status, clientId, bookingType, venue, fromDate, toDate, page, limit, sortBy, sortOrder } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (clientId) filter.clientId = clientId;
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
      .select('clientId details bookingDate eventType bookingType receivedAmount totalAmount venue status')
      .populate('createdBy', 'firstname lastname')
      .populate('venue', 'name')
      .populate('clientId', 'Clientname phoneNumber')
      .populate('eventType', 'name')
      .populate('cateringPlan', 'name')
      .populate('dacor', 'name');

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

      const venueDetails = await Venue.findById(req.body.venue);
      const cateringPlanDetails = await CateringPlan.findById(req.body.cateringPlan);
      const decorDetails = await Decor.findById(req.body.decor);
      const finalAmount = req.body.finalAmount;

      // Calculate the total amount
      let totalAmount = venueDetails.amount + cateringPlanDetails.price + decorDetails.price;
      let discount = totalAmount - finalAmount;

      const newBooking = await Booking.create({ ...req.body, createdBy, totalAmount: totalAmount,discount: discount });
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
    const venueDetails = await Venue.findById(booking.venue);
    const cateringPlanDetails = await CateringPlan.findById(req.body.cateringPlan);
    const decorDetails = await Decor.findById(req.body.decor);
    const finalAmount = req.body.finalAmount;
    
    // Calculate the total amount
    let totalAmount = venueDetails.amount + cateringPlanDetails.price + decorDetails.price;
    let discount = totalAmount - finalAmount;
    
    await Booking.updateOne(
      { _id: id },
      { 
        $set: { 
          ...req.body, 
          updatedBy: req.user ? req.user._id : null,
          totalAmount: totalAmount,
          discount: discount
        } 
      }
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

      // Find the booking to get the googleEventId
      const booking = await Booking.findById(id);

      if (!booking) {
          return res.status(404).json({ error: 'Booking not found' });
      }

      // Delete the booking from the database
      const deletedBooking = await Booking.findByIdAndDelete(id);

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



module.exports = {
  createBooking,
  updateBooking,
  changeBookingStatus,
  deleteBooking,
  listBookings,
  viewBooking,
  generateBookingPDF
};


