const { body, query } = require('express-validator');
const moment = require('moment');


const createBookingValidator = [
  body('clientName').notEmpty().withMessage('Client name is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('phoneNumber')
  .notEmpty().withMessage('Phone Number is required')
  .matches(/^\d{3}-\d{3}-\d{4}$/).withMessage('Invalid phone number format. Use xxx-xxx-xxxx'),
  body('totalAmount').notEmpty().withMessage('Total amount is required').isNumeric().withMessage('Total amount must be a number'),
  body('details').optional(),
  body('bookingDate').notEmpty().withMessage('Date is required').custom((value) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;

    if (!regex.test(value)) {
      throw new Error('Invalid date format. Use dd-mm-yyyy.');
    }

    const bookingDate = moment(value, 'DD-MM-YYYY', true);
    const today = moment().startOf('day');

    if (!bookingDate.isValid()) {
      throw new Error('Invalid date format. Use dd-mm-yyyy.');
    }

    if (bookingDate.isBefore(today)) {
      throw new Error('Booking date must be greater than today.');
    }

    return true;
  }),
  
  body('bookingType')
  .notEmpty().withMessage('Booking type is required')
  .isIn(['morning', 'evening', 'full day']).withMessage('Invalid booking type'),  
  body('eventType').notEmpty().withMessage('Event type is required').isMongoId().withMessage('Invalid event type ID'),
  body('venue').notEmpty().withMessage('Venue is required').isMongoId().withMessage('Invalid venue ID'),
];

const updateBookingValidator = [
  body('clientName').notEmpty().withMessage('Client name is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
  body('phoneNumber')
  .notEmpty().withMessage('Phone Number is required')
  .matches(/^\d{3}-\d{3}-\d{4}$/).withMessage('Invalid phone number format. Use xxx-xxx-xxxx'),  body('totalAmount').notEmpty().withMessage('Total amount is required').isNumeric().withMessage('Total amount must be a number'),
  body('details').optional(),
  body('eventType').notEmpty().withMessage('Event type is required').isMongoId().withMessage('Invalid event type ID'),
];

const changeStatusValidator = [
  body('status').notEmpty().withMessage('Status is required'),
];

const deleteBookingValidator = [
  query('id').notEmpty().withMessage('Booking ID is required').isMongoId().withMessage('Invalid booking ID'),
];

const listBookingsValidator = [
  query('status').optional().isIn(['pending', 'confirmed', 'completed']).withMessage('Invalid status'),
  query('clientName').optional(),
  query('phoneNumber').optional(),
  query('bookingType').optional(),
  query('venue').optional(),
  query('fromDate').optional().isISO8601().toDate(),
  query('toDate').optional().isISO8601().toDate(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1 }).toInt(),
  query('sortBy').optional().isIn(['bookingDate', 'venue', 'bookingType', 'status', 'clientName']).withMessage('Invalid sortBy'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Invalid sortOrder'),
];

module.exports = {
  createBookingValidator,
  updateBookingValidator,
  changeStatusValidator,
  deleteBookingValidator,
  listBookingsValidator
};
