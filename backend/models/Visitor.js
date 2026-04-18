const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, unique: true }, // Persistent UUID from localStorage
  userId: { type: String, default: null }, // Linked clientId if logged in
  ip: { type: String },
  country: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  userAgent: { type: String },
  referrer: { type: String },
  browser: { type: String },
  os: { type: String },
  deviceType: { type: String }, // Mobile, Tablet, Desktop
  screenResolution: { type: String },
  language: { type: String },
  pathHistory: [
    {
      path: { type: String },
      timestamp: { type: Date, default: Date.now },
      duration: { type: Number, default: 0 } // Stay time in seconds
    }
  ],
  firstSeen: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  sessionCount: { type: Number, default: 1 }
});

module.exports = mongoose.model('Visitor', VisitorSchema);
