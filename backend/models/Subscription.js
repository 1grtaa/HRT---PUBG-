const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['basic', 'pro', 'vip'], default: 'basic' },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  autoRenew: { type: Boolean, default: false },
  paymentMethod: String,
  amount: Number,
  couponUsed: String,
  status: { type: String, enum: ['active', 'expired', 'canceled'], default: 'active' }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);