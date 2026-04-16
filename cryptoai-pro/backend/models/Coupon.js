const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, min: 0, max: 100 },
  maxUses: Number,
  usedCount: { type: Number, default: 0 },
  validFrom: Date,
  validUntil: Date,
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Coupon', CouponSchema);