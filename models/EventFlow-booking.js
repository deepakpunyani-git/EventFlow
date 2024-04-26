const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  googleEventId: { type: String },
  clientName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  totalAmount: { type: Number, required: true },
  receivedAmount: { type: Number },
  details: { type: String },
  bookingDate: { type: Date },
  eventType: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-eventType' },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-venue' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-users' },
  dateCreated: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-users' },
  dateUpdated: { type: Date },
  status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' },
  bookingType: { type: String, enum: ['morning', 'evening', 'full day'], default: 'morning' },
});

module.exports = mongoose.model('EventFlow-booking', bookingSchema);
