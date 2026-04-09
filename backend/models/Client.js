const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  uid: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String },
  status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'pending' },
  password: { type: String },
  accountType: { type: String, enum: ['demo', 'live'], default: 'demo' },
  kyc: {
    status: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
    documentType: String,
    documentName: String,
    submittedAt: Date,
    reviewedAt: Date,
    rejectionReason: String
  },
  accountSummary: {
    deposit: { type: Number, default: 0 },
    creditDeposit: { type: Number, default: 0 },
    leverage: { type: String, default: '1:100' }
  },
  tradingMetrics: {
    balance: { type: Number, default: 0 },
    creditDeposit: { type: Number, default: 0 },
    freeMargin: { type: Number, default: 0 },
    marginLevel: { type: Number, default: 0 },
    equity: { type: Number, default: 0 },
    marginUsed: { type: Number, default: 0 },
    swap: { type: Number, default: 0 },
    trades: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema);
