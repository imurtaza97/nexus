const mongoose = require('mongoose');

const planPaymentSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  selectedPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  paymentStatus: { type: String, enum: ['success', 'Under Process', 'failed'], required: true },
  subscriptionStatus: { type: String, enum: ['active', 'inactive'], required: true },
  paymentId: { type: String, required: false },
  orderId: { type: String, required: false }
});

module.exports = mongoose.model('PlanPayment', planPaymentSchema);
