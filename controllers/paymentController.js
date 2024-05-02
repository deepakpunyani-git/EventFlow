const Payment = require('../models/EventFlow-payments');
const Booking = require('../models/EventFlow-booking');
const { validationResult } = require('express-validator');
const Log = require('../models/EventFlow-logs');
             
const addPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, details, bookingId, paymentMode } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const newPayment = await Payment.create({
      amount,
      details,
      bookingId,
      createdBy: req.user ? req.user._id : null,
      paymentMode,
      amountType: 'added'
    });

    await updateBookingReceivedAmount(bookingId);

    // Log the creation of a new payment
    await Log.create({
      description: `Created payment with ID ${newPayment._id}`,
      status: 'payment',
      createdBy: req.user ? req.user._id : null,
      paymentId: newPayment._id,
    });

    return res.status(201).json({ data: newPayment, message: 'Payment created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deductAmount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, details, bookingId, paymentMode } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.totalAmount < amount) {
      return res.status(400).json({ error: 'Insufficient amount in the booking' });
    }

    const newPayment = await Payment.create({
      amount,
      amountType: 'deducted',
      details,
      bookingId,
      createdBy: req.user ? req.user._id : null,
      paymentMode
    });

    await updateBookingReceivedAmount(bookingId);

    // Log the deduction of amount
    await Log.create({
      description: `Deducted amount from booking with ID ${bookingId}`,
      status: 'payment',
      createdBy: req.user ? req.user._id : null,
      bookingId: bookingId,
    });

    return res.status(201).json({ data: newPayment, message: 'Amount deducted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const deletedPayment = await Payment.findByIdAndDelete(paymentId);

    if (!deletedPayment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }
    await updateBookingReceivedAmount(deletedPayment.bookingId);

    await Log.create({
      description: `Deleted payment with ID ${deletedPayment._id}`,
      status: 'payment',
      createdBy: req.user ? req.user._id : null,
      paymentId: deletedPayment._id,
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { details, paymentMode, amount } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    payment.details = details || payment.details;
    payment.paymentMode = paymentMode || payment.paymentMode;
    payment.amount = amount || payment.amount;
    payment.updatedBy = req.user._id;

    const updatedPayment = await payment.save();
    await updateBookingReceivedAmount(payment.bookingId);

    await Log.create({
      description: `Updated payment with ID ${updatedPayment._id}`,
      createdBy: req.user ? req.user._id : null,
      paymentId: updatedPayment._id,
      status: 'payment',

    });

    return res.status(200).json(updatedPayment);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const listPayments = async (req, res) => {
  try {
    // Pagination
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skipIndex = (page - 1) * limit;

    // Search
    const searchQuery = {};
    if (req.query.bookingId) {
      searchQuery.bookingId = req.query.bookingId;
    }
    if (req.query.paymentMode) {
      searchQuery.paymentMode = req.query.paymentMode;
    }

    // Sorting
    const sortQuery = {};
    if (req.query.sortBy) {
      sortQuery[req.query.sortBy] = req.query.sortDirection === 'desc' ? -1 : 1;
    }

    const payments = await Payment.find(searchQuery)
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username')
      .sort(sortQuery)
      .skip(skipIndex)
      .limit(limit);

    res.status(200).json(payments);
  } catch (error) {
    await Log.create({ description: `Error listing payments: ${error.message}`, status: 'booking' });
    res.status(500).json({ error: 'Internal server error' });
  }
};

const viewPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    payment = await Payment.findById(paymentId)
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateBookingReceivedAmount = async (bookingId) => {
  try {
    const payments = await Payment.find({ bookingId: bookingId });

    const totalAmount = payments.reduce((total, payment) => {
      if (payment.amountType === 'added') {
        return total + payment.amount;
      } else if (payment.amountType === 'deducted') {
        return total - payment.amount;
      }
    }, 0);

    const booking = await Booking.findById(bookingId);
    if (booking) {
      booking.receivedAmount = totalAmount;
      await booking.save();
      return true;
    } else {
      return false; 
    }
  } catch (error) {
    console.error('Error updating booking received amount:', error);
    return false;
  }
};

module.exports = {
  addPayment,
  deductAmount,
  deletePayment,
  updatePayment,
  listPayments,
  viewPayment
};
