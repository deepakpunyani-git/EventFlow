const Booking = require('../models/EventFlow-booking');
const moment = require('moment');

const getDashboardData = async (req, res) => {
  try {
        const startOfMonth = moment().startOf('month');
        const endOfMonth = moment().endOf('month');

        // Count the number of bookings for the current month
        const currentMonthBookingsCount = await Booking.countDocuments({
            bookingDate: { $gte: startOfMonth, $lte: endOfMonth },
            status: 'booked'
        });

        const startOfPreviousMonth = moment().subtract(1, 'month').startOf('month');
        const endOfPreviousMonth = moment().subtract(1, 'month').endOf('month');

        // Count the number of bookings for the previous month
        const previousMonthBookingsCount = await Booking.countDocuments({
            bookingDate: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
            status: 'booked'
        });

        // Get the start and end dates of the next month

        const startOfNextMonth = moment().add(1, 'month').startOf('month');
        const endOfNextMonth = moment().add(1, 'month').endOf('month');

        // Count the number of bookings for the next month
        const nextMonthBookingsCount = await Booking.countDocuments({
            bookingDate: { $gte: startOfNextMonth, $lte: endOfNextMonth },
            status: 'booked'
        });
        
        const todayStart = moment().startOf('day');
        const todayEnd = moment().endOf('day');

        // Fetch today's bookings and populate fields from associated models
        const todaysBookings = await Booking.find({ 
          bookingDate: { $gte: todayStart, $lte: todayEnd },
          status: 'booked' // Filter by status 'booked'
      })
      .populate({
          path: 'clientId',
          select: 'clientName phoneNumber'
      })
      .populate({
          path: 'venue',
          select: 'name'
      })
      .populate({
          path: 'createdBy',
          select: 'username'
      })
      .select('clientId venue bookingType createdBy');

      const tomorrow = moment().add(1, 'days').startOf('day');
        const next7Days = moment().add(7, 'days').endOf('day');

        // Fetch bookings starting from tomorrow up to the next 7 days and sort by bookingDate and createdAt
        const bookings = await Booking.find({ 
            bookingDate: { $gte: tomorrow, $lte: next7Days },
        })
        .populate({
            path: 'clientId',
            select: 'clientName phoneNumber'
        })
        .populate({
            path: 'venue',
            select: 'name'
        })
        .populate({
            path: 'createdBy',
            select: 'username'
        })
        .select('clientId venue bookingType createdBy status , bookingDate')
        .sort({ bookingDate: 1 });

        const currentMonthCanceledCount = await Booking.countDocuments({
          bookingDate: { $gte: startOfMonth, $lte: endOfMonth },
          status: 'cancelled' 
      });
      
      const bookingCountByVenue = await Booking.aggregate([
        {
            $match: {
                bookingDate: {
                    $gte: startOfMonth.toDate(),
                    $lte: endOfMonth.toDate()
                },
                status: 'booked'
            }
        },
        {
            $group: {
                _id: "$venue",
                count: { $sum: 1 }
            }
        }
    ]);
    const venueIds = bookingCountByVenue.map(entry => entry._id);
    const populatedBookingCountByVenue = await Booking.populate(bookingCountByVenue, { path: '_id', model: 'EventFlow-venue' });


    const formattedBookingCountByVenue = populatedBookingCountByVenue.map(entry => {
      return {
          _id: entry._id._id,
          count: entry.count,
          venueData: { name: entry._id.name }
      };
  });

    res.status(200).json({ currentMonthBookingsCount ,currentMonthCanceledCount,previousMonthBookingsCount, nextMonthBookingsCount,todaysBookings,bookings,formattedBookingCountByVenue});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
    getDashboardData
};
