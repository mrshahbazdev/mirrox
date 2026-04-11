require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Client = require('./models/Client');
const Admin = require('./models/Admin');
const Trade = require('./models/Trade');
const SupportTicket = require('./models/SupportTicket');
const { Server } = require('socket.io');
const setupSockets = require('./socket/index');
const { clients, activeTrades, symbolsList, deposits, withdrawals, admins, configs, saveData, initializeDB } = require('./store');
const AdminActivity = require('./models/AdminActivity');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const axios = require('axios');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));
app.use(express.json());

// Root route for health check
app.get('/', (req, res) => res.send('Mirrox Backend is alive and running!'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    initializeDB();
  })
  .catch(err => console.warn('⚠️ MongoDB Connection Error:', err.message));

mongoose.set('bufferCommands', false);

// --- SECURITY MIDDLEWARES ---
const verifyClientToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access Denied: No Token Provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_mirrox_key_2026', (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or Expired Token' });
    req.user = decoded;
    next();
  });
};

// Middleware: Verify Admin Token (Hardened Session & IP Check)
const verifyAdminToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No admin token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_mirrox_key_2026');
    
    // Hardening: Verify session still exists in DB
    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.status === 'suspended') return res.status(403).json({ error: 'Access revoked' });

    // 1. Session Check (The "Kick" logic)
    // If the token has a sessionId, we MUST verify it exists in DB
    if (decoded.sessionId) {
      const sessionExists = admin.activeSessions.some(s => s.sessionId === decoded.sessionId);
      if (!sessionExists) return res.status(401).json({ error: 'Session revoked by Super Admin' });
    } else {
      // Legacy token support: If no sessionId in token, we allow it for now
      // but only if the admin is active. (Optional: log this as a legacy access)
    }

    // 2. IP Whitelist Check (IP Sovereignty)
    if (admin.allowedIPs?.length > 0) {
      let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      if (clientIp.includes(',')) clientIp = clientIp.split(',')[0].trim();
      
      const allowed = admin.allowedIPs.includes(clientIp);
      if (!allowed) {
        return res.status(403).json({ error: 'Security: Access restricted from this IP address' });
      }
    }

    req.user = decoded; // { id, role, sessionId }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired admin token' });
  }
};

const verifyAdminPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const admin = await Admin.findById(req.user.id);
      if (!admin) return res.status(403).json({ error: 'Admin not found' });
      // Bypass for master roles
      if (admin.role === 'super' || admin.role === 'admin') return next(); 
      if (admin.permissions && admin.permissions[permission]) {
        return next();
      }
      res.status(403).json({ error: `Permission Denied: Requires ${permission}` });
    } catch(err) { res.status(500).json({ error: 'Authorization check failed' }); }
  };
};

// Advanced Differential Logging Helper
const logAdminActivity = async (req, action, resourceType, resourceId, details) => {
  try {
    const adminId = req.user.id;
    const admin = await Admin.findById(adminId);
    if (!admin) return;
    
    await new AdminActivity({
      adminId,
      adminName: admin.name,
      action,
      resourceType,
      resourceId,
      details: {
        oldValue: details.oldValue || null,
        newValue: details.newValue || null,
        description: details.description || ''
      },
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress
    }).save();
  } catch (err) { console.error('Logging error:', err.message); }
};


// --- AUTH APIS ---
app.post('/api/auth/register', async (req, res) => {
  const { name, email, contact, password, ref } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const existing = clients.find(c => c.email === email);
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const generatedRefCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const newClient = new Client({
      id: 'C' + Date.now().toString().slice(-4),
      uid: 'MRX-' + Math.floor(10000 + Math.random() * 90000),
      name, email, password: hashedPassword, contact: contact || '',
      status: 'active',
      refCode: generatedRefCode,
      referredBy: ref || null,
      accountSummary: { deposit: 10000, creditDeposit: 0, leverage: '1:100' },
      tradingMetrics: { balance: 10000, creditDeposit: 0, freeMargin: 10000, equity: 10000 }
    });

    if (ref) {
       const referrer = clients.find(c => c.refCode === ref);
       if (referrer) {
          const bonus = configs['referral_bonus'] || 25;
          if (!referrer.affiliateStats) referrer.affiliateStats = { totalInvites: 0, totalEarnings: 0 };
          referrer.affiliateStats.totalInvites += 1;
          referrer.affiliateStats.totalEarnings += parseFloat(bonus);
          
          if (!referrer.notifications) referrer.notifications = [];
          referrer.notifications.push({
             id: 'N' + Date.now().toString().slice(-6),
             message: `Congratulations! A new user joined via your link. You earned $${bonus}.`,
             date: new Date(), read: false, type: 'success'
          });
       }
    }

    if (mongoose.connection.readyState === 1) await newClient.save();
    clients.push(newClient.toObject ? newClient.toObject() : newClient);
    saveData();
    
    // Sanitize for response
    const { password: p, withdrawalPin: wp, ...sanitizedClient } = newClient.toObject ? newClient.toObject() : newClient;
    sanitizedClient.hasPin = !!wp;

    const token = jwt.sign({ id: newClient.id, role: 'user' }, process.env.JWT_SECRET || 'super_secret_mirrox_key_2026', { expiresIn: '7d' });
    res.status(201).json({ success: true, token, client: sanitizedClient });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // 1. Try Admin Login first
  try {
    const adminUser = await Admin.findOne({ email });
    if (adminUser) {
      if (adminUser.status === 'suspended') return res.status(403).json({ error: 'Account suspended' });
      
      // Check Lockout
      if (adminUser.lockoutUntil && adminUser.lockoutUntil > Date.now()) {
        const remaining = Math.ceil((adminUser.lockoutUntil - Date.now()) / 60000);
        return res.status(403).json({ error: `Account locked. Try again in ${remaining} minutes.` });
      }

      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (!isMatch) {
         adminUser.loginAttempts += 1;
         if (adminUser.loginAttempts >= 5) {
            adminUser.lockoutUntil = Date.now() + 30 * 60 * 1000; // 30 min lock
            adminUser.loginAttempts = 0;
         }
         await adminUser.save();
         return res.status(401).json({ error: 'Invalid admin credentials' });
      }

      // Success - Reset attempts
      adminUser.loginAttempts = 0;
      adminUser.lockoutUntil = null;
      adminUser.lastActive = new Date();
      
      // Record Session
      const sessionId = 'S' + Date.now().toString().slice(-6);
      adminUser.activeSessions.push({
          sessionId,
          ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          device: req.headers['user-agent'] || 'Unknown',
          lastActive: new Date()
      });
      await adminUser.save();

      // Check 2FA
      if (adminUser.twoFactorEnabled) {
          return res.json({ require2FA: true, id: adminUser._id, sessionId });
      }

      const token = jwt.sign({ id: adminUser._id, role: adminUser.role, sessionId }, process.env.JWT_SECRET || 'super_secret_mirrox_key_2026', { expiresIn: '7d' });
      return res.json({ role: adminUser.role, token, sessionId });
    }
  } catch (err) { console.error('Admin login err:', err); }

  // 2. Client Login
  const clientUser = clients.find(c => c.email === email);
  if (!clientUser) return res.status(401).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, clientUser.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  // Sanitize for response
  const { password: p, withdrawalPin: wp, ...sanitizedClient } = clientUser;
  sanitizedClient.hasPin = !!wp;

  const token = jwt.sign({ id: clientUser.id, role: 'user' }, process.env.JWT_SECRET || 'super_secret_mirrox_key_2026', { expiresIn: '7d' });
  res.json({ success: true, token, client: sanitizedClient });
});

// 2FA Verification Route
app.post('/api/auth/verify-2fa', async (req, res) => {
  const { id, code } = req.body;
  try {
      const admin = await Admin.findById(id);
      if (!admin || !admin.twoFactorSecret) return res.status(400).json({ error: '2FA not setup' });
      
      const isValid = speakeasy.totp.verify({
          secret: admin.twoFactorSecret,
          encoding: 'base32',
          token: code
      });
      if (!isValid) return res.status(401).json({ error: 'Invalid 2FA code' });

      // Find the session we created in the first step (it was saved to DB but not signed into token yet)
      const lastSession = admin.activeSessions[admin.activeSessions.length - 1];
      const sessionId = lastSession ? lastSession.sessionId : 'S' + Date.now().toString().slice(-6);

      const token = jwt.sign({ id: admin._id, role: admin.role, sessionId }, process.env.JWT_SECRET || 'super_secret_mirrox_key_2026', { expiresIn: '7d' });
      res.json({ role: admin.role, token, sessionId });
  } catch(err) { res.status(500).json({ error: 'Server error' }); }
});

// Session & IP Management
app.delete('/api/admins/:id/sessions/:sessionId', verifyAdminToken, verifyAdminPermission('manageStaff'), async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        admin.activeSessions = admin.activeSessions.filter(s => s.sessionId !== req.params.sessionId);
        await admin.save();
        res.json({ success: true });
    } catch(err) { res.status(500).json({ error: 'Failed to revoke session' }); }
});

app.put('/api/admins/:id/allowed-ips', verifyAdminToken, verifyAdminPermission('manageStaff'), async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        admin.allowedIPs = req.body.ips;
        await admin.save();
        await logAdminActivity(req, 'UPDATE_IP_WHITELIST', 'Admin', admin._id, { newValue: req.body.ips });
        res.json({ success: true });
    } catch(err) { res.status(500).json({ error: 'Failed to update IPs' }); }
});

// Maintenance Mode
app.post('/api/admins/maintenance', verifyAdminToken, verifyAdminPermission('manageSettings'), async (req, res) => {
    const { status } = req.body; // true/false
    try {
        // We'll store this in systemConfig
        const Config = require('./models/Config');
        await Config.findOneAndUpdate({ key: 'maintenance_mode' }, { value: status }, { upsert: true });
        await logAdminActivity(req, 'TOGGLE_MAINTENANCE', 'System', 'ALL', { newValue: status });
        res.json({ success: true });
    } catch(err) { res.status(500).json({ error: 'Failed to toggle maintenance' }); }
});

// Public Configuration (Maintenance Status, etc.)
app.get('/api/config/public', async (req, res) => {
    try {
        const Config = require('./models/Config');
        const mMode = await Config.findOne({ key: 'maintenance_mode' });
        res.json({ 
            maintenance_mode: mMode ? (mMode.value === 'true' || mMode.value === true) : false 
        });
    } catch(err) { res.status(500).json({ error: 'Config fetch failed' }); }
});

// Admin Management Endpoints
app.get('/api/admins', verifyAdminToken, verifyAdminPermission('manageStaff'), async (req, res) => {
  try {
      const allAdmins = await Admin.find().select('-password -twoFactorSecret');
      res.json(allAdmins);
  } catch(err) { res.status(500).json({ error: 'Failed to fetch admins' }); }
});

app.post('/api/admins', verifyAdminToken, verifyAdminPermission('manageStaff'), async (req, res) => {
  const { name, email, password, role, team, permissions } = req.body;
  try {
      const aCount = await Admin.countDocuments();
    if (aCount === 0) {
      console.log('Seeding MongoDB with default Admin...');
      const hashedPassword = await bcrypt.hash('admin', 10);
      await Admin.create({ 
        email: 'admin@mirrox.com', 
        password: hashedPassword, 
        name: 'Super Admin', 
        role: 'super' // Changed from 'admin' to 'super'
      });
    }
      const exists = await Admin.findOne({ email });
      if (exists) return res.status(400).json({ error: 'Email already registered' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({ name, email, password: hashedPassword, role, team, permissions });
      await newAdmin.save();
      
      await logAdminActivity(req, 'CREATE_ADMIN', 'Admin', newAdmin._id, { description: `Created new admin: ${name}` });
      res.status(201).json(newAdmin);
  } catch(err) { res.status(500).json({ error: 'Failed to create admin' }); }
});

app.put('/api/admins/:id/permissions', verifyAdminToken, verifyAdminPermission('manageStaff'), async (req, res) => {
  try {
      const admin = await Admin.findById(req.params.id);
      if (admin.role === 'super') return res.status(403).json({ error: 'Cannot modify super admin' });
      
      const oldPerms = { ...admin.permissions.toObject() };
      admin.permissions = req.body;
      await admin.save();

      await logAdminActivity(req, 'UPDATE_PERMISSIONS', 'Admin', admin._id, { 
          oldValue: oldPerms, 
          newValue: req.body,
          description: `Updated permissions for ${admin.name}` 
      });
      res.json({ success: true });
  } catch(err) { res.status(500).json({ error: 'Update failed' }); }
});

app.delete('/api/admins/:id', verifyAdminToken, verifyAdminPermission('manageStaff'), async (req, res) => {
  try {
      const admin = await Admin.findById(req.params.id);
      if (admin.role === 'super') return res.status(403).json({ error: 'Cannot delete super admin' });
      await Admin.findByIdAndDelete(req.params.id);
      await logAdminActivity(req, 'DELETE_ADMIN', 'Admin', req.params.id, { description: `Deleted admin: ${admin.name}` });
      res.json({ success: true });
  } catch(err) { res.status(500).json({ error: 'Deletion failed' }); }
});

app.get('/api/admins/activities', verifyAdminToken, verifyAdminPermission('manageStaff'), async (req, res) => {
  try {
      const activities = await AdminActivity.find().sort({ timestamp: -1 }).limit(100);
      res.json(activities);
  } catch(err) { res.status(500).json({ error: 'Failed to fetch logs' }); }
});

  app.post('/api/admins/2fa/setup', verifyAdminToken, async (req, res) => {
    try {
        const admin = await Admin.findById(req.user.id);
        if (!admin) return res.status(404).json({ error: 'Admin record not found' });
        
        const adminEmail = admin.email || 'admin@mirrox.com';
        const secret = speakeasy.generateSecret({
            length: 20,
            name: `Mirrox (${adminEmail})`,
            issuer: 'Mirrox'
        });
        
        const qr = await QRCode.toDataURL(secret.otpauth_url);
        res.json({ 
            secret: secret.base32, 
            qr 
        });
    } catch(err) { 
        console.error('2FA Setup Error:', err);
        res.status(500).json({ error: 'Sovereign 2FA Setup failed', details: err.message }); 
    }
});

app.post('/api/admins/2fa/enable', verifyAdminToken, async (req, res) => {
    const { secret, code } = req.body;
    try {
        const isValid = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: code
        });
        if (!isValid) return res.status(400).json({ error: 'Invalid verification code' });
        
        await Admin.findByIdAndUpdate(req.user.id, {
            twoFactorSecret: secret,
            twoFactorEnabled: true
        });
        res.json({ success: true });
    } catch(err) { res.status(500).json({ error: 'Activation failed' }); }
});

app.post('/api/auth/pin', verifyClientToken, async (req, res) => {
  const { pin, oldPin } = req.body;
  if (!pin || pin.length !== 4) return res.status(400).json({ error: 'PIN must be exactly 4 digits' });

  const client = clients.find(c => c.id === req.user.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  try {
    // If a PIN already exists, verify the old one
    if (client.withdrawalPin) {
      if (!oldPin) return res.status(400).json({ error: 'Please enter your old PIN to set a new one' });
      const isMatch = await bcrypt.compare(oldPin, client.withdrawalPin);
      if (!isMatch) return res.status(401).json({ error: 'Incorrect old PIN' });
    }

    const hashedPin = await bcrypt.hash(pin, 10);
    client.withdrawalPin = hashedPin;
    
    if (mongoose.connection.readyState === 1) {
      await Client.updateOne({ id: client.id }, { withdrawalPin: hashedPin });
    }
    
    saveData();
    res.json({ success: true, message: 'Withdrawal PIN secured' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save PIN' });
  }
});

// Admin-only PIN reset/setup
app.put('/api/clients/:id/pin', verifyAdminToken, async (req, res) => {
  const { pin } = req.body;
  const { id } = req.params;
  
  if (!pin || pin.length !== 4) return res.status(400).json({ error: 'PIN must be 4 digits' });

  const client = clients.find(c => c.id === id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  try {
    const hashedPin = await bcrypt.hash(pin, 10);
    client.withdrawalPin = hashedPin;
    
    if (mongoose.connection.readyState === 1) {
      await Client.updateOne({ id: client.id }, { withdrawalPin: hashedPin });
    }
    
    saveData();
    res.json({ success: true, message: 'Client PIN updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset PIN' });
  }
});

// --- SYMBOLS APIS ---
app.get('/api/symbols', (req, res) => res.json(symbolsList));

app.post('/api/symbols', verifyAdminToken, (req, res) => {
  const newSym = { id: Date.now(), ...req.body, price: req.body.price || '1.00' };
  symbolsList.push(newSym);
  saveData();
  res.status(201).json(newSym);
});

app.put('/api/symbols/:id', verifyAdminToken, (req, res) => {
  const index = symbolsList.findIndex(s => s.id == req.params.id);
  if (index === -1) return res.status(404).send('Not Found');
  symbolsList[index] = { ...symbolsList[index], ...req.body };
  saveData();
  res.json(symbolsList[index]);
});

app.delete('/api/symbols/:id', verifyAdminToken, (req, res) => {
  const index = symbolsList.findIndex(s => s.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Symbol not found' });
  symbolsList.splice(index, 1);
  saveData();
  res.json({ message: 'Deleted' });
});

// --- CLIENT APIS ---
app.get('/api/clients', verifyAdminToken, (req, res) => res.json(clients));

app.get('/api/clients/:id', verifyClientToken, (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).send('Not Found');
  
  // Sanitize for response
  const { password: p, withdrawalPin: wp, ...sanitizedClient } = client;
  sanitizedClient.hasPin = !!wp;
  
  res.json(sanitizedClient);
});

app.get('/api/clients/:id/referrals', verifyClientToken, (req, res) => {
  const referrals = clients.filter(c => c.referredBy === clients.find(me => me.id === req.params.id)?.refCode);
  res.json(referrals);
});

app.put('/api/clients/:id/balance', verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const { amount, type, note } = req.body; // type: 'increase' | 'decrease'
  const client = clients.find(c => c.id === id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  const adj = parseFloat(amount);
  if (isNaN(adj)) return res.status(400).json({ error: 'Invalid amount' });

  const multiplier = type === 'decrease' ? -1 : 1;
  const finalAdj = adj * multiplier;

  client.accountSummary.deposit += finalAdj;
  client.tradingMetrics.balance += finalAdj;
  
  // Update Equity too (Balance + Floating P/L)
  if (client.tradingMetrics.equity !== undefined) {
    client.tradingMetrics.equity += finalAdj;
  }

  if (!client.notifications) client.notifications = [];
  client.notifications.push({
    id: 'N' + Date.now().toString().slice(-6),
    message: `Administrative Balance Adjustment: ${type === 'increase' ? '+' : '-'}$${adj}. ${note || ''}`,
    date: new Date(), read: false, type: type === 'increase' ? 'success' : 'alert'
  });

  saveData();
  io.emit('finance_update'); // Sync dashboard for the user
  res.json({ success: true, balance: client.tradingMetrics.balance, deposit: client.accountSummary.deposit });
});

app.put('/api/clients/:id', verifyAdminToken, (req, res) => {
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).send('Not Found');
  clients[index] = { ...clients[index], ...req.body };
  saveData();
  res.json(clients[index]);
});

app.delete('/api/clients/:id', verifyAdminToken, (req, res) => {
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Client not found' });

  // Remove from MongoDB if online
  if (mongoose.connection.readyState === 1) {
    Client.deleteOne({ id: req.params.id }).catch(err => console.warn('DB Delete failed:', err.message));
  }

  const removed = clients.splice(index, 1);
  saveData();
  res.json({ success: true, message: 'Client deleted successfully', client: removed[0] });
});


// --- KYC APIS ---
app.post('/api/clients/:id/kyc/submit', verifyClientToken, upload.single('document'), async (req, res) => {
  const { id } = req.params;
  const { docCategory } = req.body;
  const client = clients.find(c => c.id === id);
  if (!client || !req.file) return res.status(400).json({ error: 'Invalid request' });

  const uploadStream = cloudinary.uploader.upload_stream({ folder: 'mirrox_kyc' }, async (error, result) => {
      if (error) return res.status(500).json({ error: 'Upload failed' });
      const cat = docCategory === 'por' ? 'por' : 'poi';
      if (!client.kyc) client.kyc = { poi: {}, por: {} };
      client.kyc[cat] = { status: 'pending', url: result.secure_url, publicId: result.public_id, submittedAt: new Date() };
      client.kyc.status = 'pending';
      saveData();
      res.json({ message: 'Submitted', kyc: client.kyc });
  });
  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

app.put('/api/clients/:id/kyc/review', verifyAdminToken, async (req, res) => {
  const { action, rejectionReason, category } = req.body;
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Not found' });

  const cat = category === 'por' ? 'por' : 'poi';
  client.kyc[cat].status = action === 'approve' ? 'approved' : 'rejected';
  client.kyc[cat].rejectionReason = action === 'reject' ? rejectionReason : null;
  client.kyc.reviewedAt = new Date();

  if (client.kyc.poi?.status === 'approved' && client.kyc.por?.status === 'approved') {
     client.kyc.status = 'verified';
     client.accountType = 'live';
  } else if (client.kyc.poi?.status === 'rejected' || client.kyc.por?.status === 'rejected') {
     client.kyc.status = 'rejected';
  }
  saveData();
  res.json({ message: 'Reviewed', kyc: client.kyc });
});

app.put('/api/clients/:id/kyc', verifyAdminToken, async (req, res) => {
  const { status, rejectionReason } = req.body;
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  if (!client.kyc) client.kyc = { status: 'unverified' };
  
  client.kyc.status = status;
  if (status === 'rejected') {
    client.kyc.overallRejectionReason = rejectionReason;
  } else if (status === 'approved') {
    client.kyc.overallRejectionReason = null;
    client.accountType = 'live';
  }
  
  client.kyc.reviewedAt = new Date();
  
  saveData();
  res.json(client);
});

// --- DEPOSITS & WITHDRAWALS ---
app.get('/api/deposits', verifyAdminToken, (req, res) => res.json(deposits));
app.get('/api/withdrawals', verifyAdminToken, (req, res) => res.json(withdrawals));

app.get('/api/deposits/:clientId', verifyClientToken, (req, res) => {
  res.json(deposits.filter(d => d.clientId === req.params.clientId));
});

app.get('/api/withdrawals/:clientId', verifyClientToken, (req, res) => {
  res.json(withdrawals.filter(w => w.clientId === req.params.clientId));
});

app.post('/api/deposits', verifyClientToken, (req, res) => {
  const newDep = { id: 'D' + Date.now().slice(-6), status: 'pending', ...req.body, date: new Date() };
  deposits.push(newDep);
  saveData();
  io.emit('finance_update');
  res.status(201).json(newDep);
});

app.put('/api/deposits/:id/status', verifyAdminToken, (req, res) => {
  const dep = deposits.find(d => d.id === req.params.id);
  if (!dep) return res.status(404).json({ error: 'Not found' });
  
  if (req.body.status === 'approved' && dep.status !== 'approved') {
     const client = clients.find(c => c.id === dep.clientId);
     if (client) {
       client.accountSummary.deposit += parseFloat(dep.amount);
       client.tradingMetrics.balance += parseFloat(dep.amount);
     }
  }

  dep.status = req.body.status;
  dep.processedBy = req.user.name || req.user.email;
  dep.reason = req.body.reason || null;
  
  saveData();
  io.emit('finance_update');
  res.json(dep);
});

app.post('/api/withdrawals', verifyClientToken, async (req, res) => {
  const { amount, clientId, pin } = req.body;
  const client = clients.find(c => c.id === clientId);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  // 1. Check if PIN is set up
  if (!client.withdrawalPin) {
    return res.status(400).json({ error: 'Please set up a Withdrawal PIN first.' });
  }

  // 2. Validate PIN
  const isMatch = await bcrypt.compare(pin, client.withdrawalPin);
  if (!isMatch) return res.status(401).json({ error: 'Incorrect Withdrawal PIN' });

  // 3. Check Balance
  if (client.tradingMetrics.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  const newWit = { id: 'W' + Date.now().toString().slice(-6), status: 'pending', ...req.body, date: new Date() };
  client.tradingMetrics.balance -= parseFloat(amount);
  withdrawals.push(newWit);
  saveData();
  io.emit('finance_update');
  res.status(201).json(newWit);
});

app.put('/api/withdrawals/:id/status', verifyAdminToken, (req, res) => {
  const wit = withdrawals.find(w => w.id === req.params.id);
  if (!wit) return res.status(404).json({ error: 'Not found' });

  if (req.body.status === 'rejected' && wit.status !== 'rejected') {
     const client = clients.find(c => c.id === wit.clientId);
     if (client) client.tradingMetrics.balance += parseFloat(wit.amount);
  }

  wit.status = req.body.status;
  wit.processedBy = req.user.name || req.user.email;
  wit.reason = req.body.reason || null;

  saveData();
  io.emit('finance_update');
  res.json(wit);
});

// --- CONFIG APIS ---
app.get('/api/config', (req, res) => res.json(configs));
app.put('/api/config', verifyAdminToken, (req, res) => {
  Object.assign(configs, req.body);
  saveData();
  res.json({ message: 'Updated', configs });
});

// --- TRADES APIS ---
app.get('/api/trades/:clientId', verifyClientToken, (req, res) => res.json(activeTrades[req.params.clientId] || []));
app.get('/api/trades/:clientId/history', verifyClientToken, async (req, res) => {
    const historical = await Trade.find({ clientId: req.params.clientId, status: 'Closed' }).sort({ closeTime: -1 }).limit(100);
    res.json(historical);
});

app.put('/api/trades/:id', verifyClientToken, (req, res) => {
  const { clientId, stopLoss, takeProfit } = req.body;
  const { id } = req.params;

  const trades = activeTrades[clientId];
  if (!trades) return res.status(404).json({ error: 'Client trades not found' });

  const trade = trades.find(t => t.id === id);
  if (!trade) return res.status(404).json({ error: 'Trade not found' });

  // Update parameters
  trade.stopLoss = stopLoss === '' ? null : parseFloat(stopLoss);
  trade.takeProfit = takeProfit === '' ? null : parseFloat(takeProfit);

  saveData();
  console.log(`[REAL-TIME ADJ] Trade ${id} updated: SL=${trade.stopLoss}, TP=${trade.takeProfit}`);
  res.json(trade);
});

// --- MONITORING & ANALYTICS ---
app.get('/api/active-traders', verifyAdminToken, (req, res) => {
  const activeClients = [];
  Object.keys(activeTrades).forEach(clientId => {
    const trades = activeTrades[clientId] || [];
    const openTrades = trades.filter(t => t.status === 'Open');
    if (openTrades.length > 0) {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        let floatingPL = 0; let totalLots = 0;
        openTrades.forEach(t => { floatingPL += parseFloat(t.profit || 0); totalLots += parseFloat(t.lots || 0); });
        activeClients.push({
          id: client.id, name: client.name, uid: client.uid,
          balance: client.tradingMetrics?.balance || 0,
          equity: (client.tradingMetrics?.balance || 0) + floatingPL,
          openTradeCount: openTrades.length,
          totalLots: totalLots.toFixed(2),
          floatingPL: floatingPL.toFixed(2)
        });
      }
    }
  });
  res.json({ count: activeClients.length, clients: activeClients });
});

app.get('/api/clients/:id/analytics', verifyClientToken, (req, res) => {
  const { id } = req.params;
  const clientTrades = (activeTrades[id] || []).concat(); // In memory + could fetch historical if needed
  const client = clients.find(c => c.id === id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  const closedTrades = clientTrades.filter(t => t.status === 'Closed');
  const totalClosed = closedTrades.length;
  const winTrades = closedTrades.filter(t => t.profit > 0);
  const lossTrades = closedTrades.filter(t => t.profit < 0);
  const winRate = totalClosed > 0 ? (winTrades.length / totalClosed) * 100 : 0;
  const totalProfit = winTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
  const totalLoss = Math.abs(lossTrades.reduce((sum, t) => sum + (t.profit || 0), 0));
  const profitFactor = totalLoss > 0 ? (totalProfit / totalLoss) : (totalProfit > 0 ? totalProfit : 0);
  const netPL = (client.accountSummary?.profitLoss || 0);
  const totalDep = (client.accountSummary?.deposit || 10000);
  const roi = (netPL / totalDep) * 100;

  res.json({
    totalTrades: clientTrades.length,
    closedTrades: totalClosed,
    winRate: winRate,
    profitFactor: profitFactor.toFixed(2),
    roi: roi.toFixed(2),
    buyPercent: 50, // Simplified for now
    sellPercent: 50
  });
});


// --- SUPPORT CHAT APIS ---

// GET all tickets (admin)
app.get('/api/support/tickets', verifyAdminToken, async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ lastMessageAt: -1 }).lean();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// GET single ticket (client or admin)
app.get('/api/support/tickets/:ticketId', verifyClientToken, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({ id: req.params.ticketId }).lean();
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticket' });
  }
});

// GET my open ticket (client — returns existing open or null)
app.get('/api/support/my-ticket', verifyClientToken, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({ clientId: req.user.id, status: { $in: ['open', 'blocked'] } }).lean();
    res.json(ticket || null);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your ticket' });
  }
});

// POST create ticket (client — one open ticket per client)
app.post('/api/support/tickets', verifyClientToken, async (req, res) => {
  try {
    const existing = await SupportTicket.findOne({ clientId: req.user.id, status: { $in: ['open', 'blocked'] } });
    if (existing) return res.json(existing);

    const client = clients.find(c => c.id === req.user.id);
    const ticketId = 'TKT-' + Date.now().toString().slice(-6);
    const ticket = new SupportTicket({
      id: ticketId,
      clientId: req.user.id,
      clientName: client?.name || 'Unknown',
      clientUid: client?.uid || '',
      status: 'open',
      messages: [],
      unreadByAdmin: 0,
      unreadByClient: 0
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// GET all available support admins
app.get('/api/support/admins', verifyAdminToken, async (req, res) => {
  try {
     const ads = admins.map(a => ({ name: a.name, email: a.email }));
     res.json(ads);
  } catch (err) {
     res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// PUT transfer ticket to another admin
app.put('/api/support/tickets/:ticketId/transfer', verifyAdminToken, async (req, res) => {
  const { assignedTo } = req.body;
  if (!assignedTo) return res.status(400).json({ error: 'AssignedTo is required' });
  try {
    const ticket = await SupportTicket.findOneAndUpdate(
      { id: req.params.ticketId }, 
      { assignedTo }, 
      { new: true }
    );
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    io.to(`ticket:${req.params.ticketId}`).emit('chat:ticket_update', { ticketId: ticket.id, assignedTo });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to transfer ticket' });
  }
});

// PUT close ticket (admin)
app.put('/api/support/tickets/:ticketId/close', verifyAdminToken, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOneAndUpdate(
      { id: req.params.ticketId },
      { status: 'closed' },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to close ticket' });
  }
});

// PUT reopen ticket (admin)
app.put('/api/support/tickets/:ticketId/reopen', verifyAdminToken, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOneAndUpdate(
      { id: req.params.ticketId },
      { status: 'open' },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to reopen ticket' });
  }
});

// PUT mark messages read by admin
app.put('/api/support/tickets/:ticketId/read-admin', verifyAdminToken, async (req, res) => {
  try {
    await SupportTicket.updateOne(
      { id: req.params.ticketId },
      { unreadByAdmin: 0, 'messages.$[elem].read': true },
      { arrayFilters: [{ 'elem.senderRole': 'user' }] }
    );
    io.to(`ticket:${req.params.ticketId}`).emit('chat:messages_read', { ticketId: req.params.ticketId, readBy: 'admin' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark read' });
  }
});

// PUT mark messages read by client
app.put('/api/support/tickets/:ticketId/read-client', verifyClientToken, async (req, res) => {
  try {
    await SupportTicket.updateOne(
      { id: req.params.ticketId },
      { unreadByClient: 0, 'messages.$[elem].read': true },
      { arrayFilters: [{ 'elem.senderRole': 'admin' }] }
    );
    io.to(`ticket:${req.params.ticketId}`).emit('chat:messages_read', { ticketId: req.params.ticketId, readBy: 'user' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark read' });
  }
});

// PUT update ticket admin note
app.put('/api/support/tickets/:ticketId/admin-note', verifyAdminToken, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOneAndUpdate(
      { id: req.params.ticketId },
      { adminNote: req.body.note },
      { new: true }
    );
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// PUT update ticket category
app.put('/api/support/tickets/:ticketId/category', verifyClientToken, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOneAndUpdate(
      { id: req.params.ticketId },
      { category: req.body.category },
      { new: true }
    );
    io.emit('chat:ticket_update', { ticketId: ticket.id, category: ticket.category });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// PUT rate support ticket
app.put('/api/support/tickets/:ticketId/rate', verifyClientToken, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOneAndUpdate(
      { id: req.params.ticketId, clientId: req.user.id },
      { rating: req.body.rating },
      { new: true }
    );
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

// Notifications: Mark as read
app.put('/api/clients/:clientId/notifications/:notifId/read', async (req, res) => {
  try {
    await Client.updateOne(
      { id: req.params.clientId, "notifications.id": req.params.notifId },
      { $set: { "notifications.$.read": true } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to mark notification read:', err);
    res.status(500).json({ error: 'Failed to mark read' });
  }
});

// POST upload attachment
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'support_attachments' },
    (error, result) => {
      if (error) return res.status(500).json({ error: error.message || 'Cloudinary upload failed' });
      res.json({ url: result.secure_url });
    }
  );
  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

// Setup WebSockets
setupSockets(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => console.log(`Backend Server running on port ${PORT}`));
