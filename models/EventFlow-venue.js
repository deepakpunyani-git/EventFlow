const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

module.exports = mongoose.model('EventFlow-venue', venueSchema);
