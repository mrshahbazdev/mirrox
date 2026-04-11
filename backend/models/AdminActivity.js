const mongoose = require('mongoose');

const AdminActivitySchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  adminName: { type: String, required: true },
  action: { type: String, required: true }, // e.g. "UPDATE_BALANCE", "CHANGE_SETTINGS"
  resourceType: { type: String }, // e.g. "Client", "Trade", "Config"
  resourceId: { type: String }, 
  details: {
    oldValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },
    description: { type: String }
  },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminActivity', AdminActivitySchema);
