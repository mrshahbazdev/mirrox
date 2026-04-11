const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Staff Member' },
  role: { type: String, default: 'admin' }, // admin, support, super
  team: { type: String, default: 'General' },
  
  // Advanced Permissions
  permissions: {
    manageClients: { type: Boolean, default: true },
    manageFinance: { type: Boolean, default: true },
    manageTrading: { type: Boolean, default: true },
    manageSupport: { type: Boolean, default: true },
    manageSettings: { type: Boolean, default: false },
    manageStaff: { type: Boolean, default: false }
  },

  // Security
  twoFactorSecret: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  lockoutUntil: { type: Date },
  allowedIPs: [{ type: String }],
  lastActive: { type: Date, default: Date.now },
  status: { type: String, default: 'active' } // active, suspended
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
