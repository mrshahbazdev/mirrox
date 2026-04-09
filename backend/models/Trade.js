const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  clientId: { type: String, required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  lots: { type: Number, required: true },
  openPrice: { type: Number, required: true },
  closePrice: { type: Number },
  stopLoss: { type: Number },
  takeProfit: { type: Number },
  profit: { type: Number, default: 0 },
  marginUsed: { type: Number, default: 0 },
  swap: { type: Number, default: 0 },
  swapLocked: { type: Boolean, default: false },
  status: { type: String, enum: ['Open', 'Closed', 'Pending'], default: 'Open' },
  openTime: { type: Date },
  pendingAt: { type: Date },
  closeTime: { type: Date },
  bias: { type: String, enum: ['none', 'profit', 'loss', 'lock'], default: 'none' },
  multiplier: { type: Number, default: 1 },
  closedBy: { type: String }, // 'System', 'Admin', 'Self'
  comment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Trade', TradeSchema);
