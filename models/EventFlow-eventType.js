const mongoose = require('mongoose');

const eventTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

module.exports = mongoose.model('EventFlow-eventType', eventTypeSchema);
