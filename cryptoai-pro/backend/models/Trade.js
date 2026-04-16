const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exchange: { type: String, required: true },
  symbol: { type: String, required: true },
  side: { type: String, enum: ['BUY', 'SELL'], required: true },
  type: { type: String, enum: ['market', 'limit', 'signal', 'bot'], default: 'market' },
  quantity: Number,
  price: Number,
  stopLoss: Number,
  takeProfit: Number,
  pnl: { type: Number, default: 0 },
  pnlPercentage: Number,
  fee: Number,
  status: { type: String, enum: ['open', 'closed', 'canceled'], default: 'open' },
  entryTime: { type: Date, default: Date.now },
  exitTime: Date,
  confidence: Number,
  aiRecommended: { type: Boolean, default: false },
  botName: String,
  notes: String
});

module.exports = mongoose.model('Trade', TradeSchema);