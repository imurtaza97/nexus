const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  features: [String],
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Plan', planSchema);
