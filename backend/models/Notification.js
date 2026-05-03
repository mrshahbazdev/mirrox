const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  clientId: { type: String },
  clientName: { type: String },
  type: { type: String, enum: ['trade_open', 'trade_close', 'deposit_approved', 'deposit_rejected', 'withdrawal_approved', 'withdrawal_rejected', 'kyc_verified', 'kyc_rejected', 'kyc_submitted', 'info'], default: 'info' },
  message: { type: String, required: true },
  target: { type: String, enum: ['user', 'admin', 'both'], default: 'both' },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
