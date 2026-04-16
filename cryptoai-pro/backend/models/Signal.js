const mongoose = require('mongoose');

const SignalSchema = new mongoose.Schema({
  pair: { type: String, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  tier: { type: String, enum: ['FREE', 'PRO', 'VIP', 'AI'], default: 'FREE' },
  timeframe: { type: String, required: true },
  entry: Number,
  target: Number,
  stopLoss: Number,
  confidence: { type: Number, min: 0, max: 100 },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'] },
  rrRatio: Number,
  status: { type: String, enum: ['active', 'expired', 'hit', 'failed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  analysis: {
    rsi: Number,
    macd: String,
    volume: String,
    trend: String,
    prediction: String
  },
  executedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Signal', SignalSchema);