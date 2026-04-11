const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderId:   { type: String, required: true },
  senderRole: { type: String, enum: ['user', 'admin'], required: true },
  senderName: { type: String },
  text:       { type: String, required: false },
  attachment: { type: String },
  timestamp:  { type: Date, default: Date.now },
  read:       { type: Boolean, default: false }
});

const SupportTicketSchema = new mongoose.Schema({
  id:             { type: String, required: true, unique: true },
  clientId:       { type: String, required: true },
  clientName:     { type: String },
  clientUid:      { type: String },
  status:         { type: String, enum: ['open', 'closed', 'blocked'], default: 'open' },
  category:       { type: String },
  assignedTo:     { type: String, default: null }, // Admin Name or Email
  adminNote:      { type: String },
  rating:         { type: Number },
  messages:       [MessageSchema],
  lastMessageAt:  { type: Date, default: Date.now },
  unreadByAdmin:  { type: Number, default: 0 },
  unreadByClient: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
