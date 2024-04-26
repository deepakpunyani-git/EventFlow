const Log = require('../models/EventFlow-logs');

// List all logs
const listLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy, sortOrder, dateCreated, status } = req.query;

    const filter = {};
    if (dateCreated) filter.dateCreated = new RegExp(dateCreated, 'i');
    if (status) filter.status = status;

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
      .limit(limitNumber);

    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  listLogs,
};
