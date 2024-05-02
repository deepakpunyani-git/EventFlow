const Log = require('../models/EventFlow-logs');

// List all logs
const listLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy, sortOrder, dateCreated, status, bookingId, paymentId } = req.query;

    const filter = {};
    if (dateCreated) {
      const targetDate = new Date(dateCreated);
      filter.dateCreated = {
        $gte: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()),
        $lt: new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1)
      };
    }
    if (status) filter.status = status;
    if (bookingId) filter.bookingId = bookingId;
    if (paymentId) filter.paymentId = paymentId;

    const sort = {};
    if (sortBy && ['dateCreated', 'status'].includes(sortBy)) {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const skip = (pageNumber - 1) * limitNumber;

    const logs = await Log.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber)
      .populate({
        path: 'paymentId',
        select: 'amountType dateCreated amount paymentMode'
      })
      .populate({
        path: 'createdBy',
        select: 'username'
      })
      .populate({
        path: 'bookingId',
        select: 'bookingDate bookingType',
        populate: {
          path: 'clientId',
          select: 'clientName phoneNumber'
        }
      });

    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  listLogs,
};
