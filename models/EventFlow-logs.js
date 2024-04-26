const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  description: { type: String, required: true },
  status: { type: String, enum: ['booking', 'payment'], default: 'active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-users' },
  dateCreated: { type: Date, default: Date.now },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-booking' },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-payments' },
});

module.exports = mongoose.model('EventFlow-logs', logSchema);
