const Booking = require('../models/EventFlow-booking');
const EventFlowCateringPlan = require('../models/EventFlow-cateringPlan.model');
const EventFlowDecor = require('../models/EventFlow-decor.model');
const EventFlowVenue = require('../models/EventFlow-venue');
const moment = require('moment');

const { validationResult } = require('express-validator');
const Log = require('../models/EventFlow-logs');
const PDFDocument = require('pdfkit');
require('dotenv').config();

// Convert booking date to MongoDB date format (yyyy-mm-dd)
const convertBookingDate = (value) => {
  const [day, month, year] = value.split('-');
  
  const mongoDBDate = new Date(`${year}-${month}-${day}`);
  const dateMoment = moment(mongoDBDate, 'DD-MM-YYYY', true);
  if (!dateMoment.isValid()) {
    throw new Error('Invalid date format. Use dd-mm-yyyy.');
  }
  return dateMoment.toDate();
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

    
    let { clientId, details, bookingDate, bookingType, eventType, venue, dacor, cateringPlan } = req.body;
    const createdBy = req.user ? req.user._id : null;
    if (!req.body.dacor) {
      dacor = null;
    }

    if (!req.body.cateringPlan) {
      cateringPlan = null;
    }
   
   
    bookingDate = convertBookingDate(bookingDate);


    const existingBooking = await Booking.find({
      bookingDate: bookingDate,
      venue: req.body.venue,
    });



    if (existingBooking.length > 0) {
      const isFullDayBooking = req.body.bookingType === 'full day';
      const hasFullDayBooking = existingBooking.some(booking => booking.bookingType === 'full day');
      const hasSameBookingType = existingBooking.some(booking => booking.bookingType === req.body.bookingType);
      const matchingBookings = existingBooking.filter(booking => booking.bookingType === req.body.bookingType);
      console.log( matchingBookings[0]);
      if (matchingBookings.length > 0 && matchingBookings[0].status === 'booked') {
        return res.status(400).json({ error: 'Booking not available for the specified conditions and date.'});
      } 
      if (isFullDayBooking || hasFullDayBooking ) {
          return res.status(400).json({ error: 'Booking not available for the specified conditions.'});
      }
  }

    let venueAmount = req.body.venueAmount || 0;
    let dacorAmount = req.body.dacorAmount || 0;
    let cateringPlanAmount = req.body.cateringPlanAmount || 0;

    if (req.body.venue && (venueAmount == 0 || venueAmount === '')) {
      const venueDetails = await EventFlowVenue.findById(req.body.venue);
      venueAmount = venueDetails ? venueDetails.amount : 0;
    }

    if (req.body.dacor && (dacorAmount == 0 || dacorAmount === '')) {
      const decorDetails = await EventFlowDecor.findById(req.body.dacor);
      dacorAmount = decorDetails ? decorDetails.price : 0;
    }

    if (req.body.cateringPlan && (cateringPlanAmount == 0 || cateringPlanAmount === '')) {
      
      const cateringPlanDetails = await EventFlowCateringPlan.findById(req.body.cateringPlan)
      cateringPlanAmount = cateringPlanDetails ? cateringPlanDetails.price : 0;
    }


    let totalAmount = venueAmount + dacorAmount + cateringPlanAmount;
    
    const newBooking = await Booking.create({
      clientId,
      details,
      bookingDate,
      bookingType,
      eventType,
      venue,
      dacor,
      cateringPlan,
      venueAmount,
      dacorAmount,
      cateringPlanAmount,
      createdBy,
      totalAmount,
    });

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
    let { clientId, details, eventType, dacor, cateringPlan } = req.body;
    if (!req.body.dacor) {
      dacor = null;
    }

    if (!req.body.cateringPlan) {
      cateringPlan = null;
    }
   
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    let venueAmount = req.body.venueAmount || 0;
    let dacorAmount = req.body.dacorAmount || 0;
    let cateringPlanAmount = req.body.cateringPlanAmount || 0;

    if (venueAmount === 0 || venueAmount === '') {
      venueAmount = booking.venueAmount;
    }


    if (req.body.dacor && (dacorAmount === 0 || dacorAmount === '')) {
      const decorDetails = await EventFlowDecor.findById(req.body.dacor);

      dacorAmount = decorDetails ? decorDetails.price : 0;
    }

    if (req.body.cateringPlan && (cateringPlanAmount === 0 || cateringPlanAmount === '')) {
      const cateringPlanDetails = await EventFlowCateringPlan.findById(req.body.cateringPlan);
      cateringPlanAmount = cateringPlanDetails ? cateringPlanDetails.price : 0;
    }
    let totalAmount = venueAmount + dacorAmount + cateringPlanAmount;

    await Booking.updateOne(
      { _id: id },
      { 
        $set: { 
          clientId,
          details,
          eventType,
          dacor,
          cateringPlan,
          venueAmount,
          dacorAmount,
          cateringPlanAmount,
          updatedAt: new Date(),    
          updatedBy: req.user ? req.user._id : null,
          totalAmount: totalAmount,
        } 
      }
    );

    // await Log.create({
    //   description: `Updated booking with ID ${booking._id}`,
    //   status: 'booking',
    //   createdBy: req.user ? req.user._id : null,
    //   bookingId: booking._id,
    // });

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
    const { status , status_details } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { $set: { status , status_details}, updatedBy: req.user ? req.user._id : null, dateUpdated: Date.now() },
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
  generateBookingPDF,
};


