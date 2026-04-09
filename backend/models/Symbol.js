const mongoose = require('mongoose');

const SymbolSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  price: { type: String, required: true },
  spread: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  lotMin: { type: Number, default: 0.01 },
  lotStep: { type: Number, default: 0.01 },
  lotMax: { type: Number, default: 100 },
  commissionType: { type: String, default: 'spread-only' },
  precision: { type: Number, default: 5 },
  category: { type: String },
  iconClassName: { type: String },
  quoteCurrency: { type: String, default: 'USD' },
  swapRate: { type: Number, default: 0.01 }
}, { timestamps: true });

module.exports = mongoose.model('Symbol', SymbolSchema);
