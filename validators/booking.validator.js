const { body, query } = require('express-validator');
const moment = require('moment');


const createBookingValidator = [
  body('clientId').notEmpty().withMessage('client is required').isMongoId().withMessage('Invalid client ID'),
  body('finalAmount').notEmpty().withMessage('Final amount is required').isNumeric().withMessage('Final amount must be a number'),
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
  body('dacor').notEmpty().withMessage('dacor is required').isMongoId().withMessage('Invalid dacor ID'),
  body('cateringPlan').notEmpty().withMessage('cateringPlan is required').isMongoId().withMessage('Invalid cateringPlan ID'),

];

const updateBookingValidator = [
  body('clientId').notEmpty().withMessage('client is required').isMongoId().withMessage('Invalid client ID'), 
  body('finalAmount').notEmpty().withMessage('Final amount is required').isNumeric().withMessage('Final amount must be a number'),
  body('details').optional(),
  body('eventType').notEmpty().withMessage('Event type is required').isMongoId().withMessage('Invalid event type ID'),
  body('dacor').notEmpty().withMessage('dacor is required').isMongoId().withMessage('Invalid dacor ID'),
  body('cateringPlan').notEmpty().withMessage('cateringPlan is required').isMongoId().withMessage('Invalid cateringPlan ID'),

];

const changeStatusValidator = [
  body('status').notEmpty().withMessage('Status is required'),
  body('status_details').notEmpty().withMessage('Status is required'),

];

const deleteBookingValidator = [
  query('id').notEmpty().withMessage('Booking ID is required').isMongoId().withMessage('Invalid booking ID'),
];

const listBookingsValidator = [
  query('status').optional().isIn(['booked', 'cancelled']).withMessage('Invalid status'),
  query('clientId').optional(),
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
