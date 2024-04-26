const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  amountType: { type: String, enum: ['added', 'deducted']},
  details: { type: String },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-booking' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-users' },
  dateCreated: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'EventFlow-users' },
  dateUpdated: { type: Date ,  default: Date.now },
  paymentMode: { type: String, enum: ['cash', 'online','cc','check'], default: 'cash' }
});

module.exports = mongoose.model('EventFlow-payments', paymentSchema);
