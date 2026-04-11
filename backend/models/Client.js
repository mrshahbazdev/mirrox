const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  uid: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String },
  status: { type: String, enum: ['active', 'pending', 'suspended'], default: 'pending' },
  password: { type: String },
  withdrawalPin: { type: String },
  accountType: { type: String, enum: ['demo', 'live'], default: 'demo' },
  refCode: { type: String, unique: true },
  referredBy: { type: String }, // Stores RefCode of the inviter
  affiliateStats: {
    totalInvites: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 }
  },
  kyc: {
    status: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
    
    // Legacy mapping or primary Identity
    documentType: String,
    documentUrl: String,
    cloudinaryPublicId: String,
    
    poi: { // Proof of Identity
      status: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
      url: String,
      publicId: String,
      rejectionReason: String
    },
    por: { // Proof of Residence
      status: { type: String, enum: ['none', 'pending', 'approved', 'rejected'], default: 'none' },
      url: String,
      publicId: String,
      rejectionReason: String
    },

    submittedAt: Date,
    reviewedAt: Date,
    overallRejectionReason: String
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
  },
  notifications: [{
    id: String,
    message: String,
    date: Date,
    read: { type: Boolean, default: false },
    type: { type: String, default: 'info' }
  }],
  adminNote: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema);
