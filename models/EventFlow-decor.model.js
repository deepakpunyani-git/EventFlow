const mongoose = require('mongoose');

const decorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

const EventFlowDecor = mongoose.model('EventFlow-Decor', decorSchema);

module.exports = EventFlowDecor;
