const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  clientId: { type: String, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
  amount: { type: Number, required: true },
  method: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  date: { type: String }, // Storing ISO string or Date depending on legacy format
  reason: { type: String } // Rejection reason if any
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
