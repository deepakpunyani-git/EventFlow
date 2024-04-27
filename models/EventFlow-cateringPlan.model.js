const mongoose = require('mongoose');

const cateringPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

const EventFlowCateringPlan = mongoose.model('EventFlowCateringPlan', cateringPlanSchema);

module.exports = EventFlowCateringPlan;
