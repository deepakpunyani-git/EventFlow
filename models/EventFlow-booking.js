const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-Client' },
  clientName: { type: String, required: true },
  phoneNumber: { type: String },
  totalAmount: { type: Number },
  finalAmount: { type: Number, required: true },
  discount: { type: Number},
  receivedAmount: { type: Number },
  details: { type: String },
  bookingDate: { type: Date },
  eventType: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-eventType' },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-venue' },
  dacor: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-Decor' },
  cateringPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-CateringPlan' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-users' },
  dateCreated: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-users' },
  dateUpdated: { type: Date },
  status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
  status_details: { type: String },
  bookingType: { type: String, enum: ['morning', 'evening', 'full day'], default: 'morning' },
});

module.exports = mongoose.model('EventFlow-booking', bookingSchema);
