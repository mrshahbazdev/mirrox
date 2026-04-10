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
const { Server } = require('socket.io');
const setupSockets = require('./socket/index');
const { clients, activeTrades, symbolsList, deposits, withdrawals, admins, configs, saveData, initializeDB } = require('./store');

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

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or Expired Token' });
    req.user = decoded;
    next();
  });
};

const verifyAdminToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access Denied: No Admin Token' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or Expired Token' });
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Requires Admin Privileges' });
    req.user = decoded;
    next();
  });
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
    
    const token = jwt.sign({ id: newClient.id, role: 'user' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ success: true, token, client: newClient });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const adminUser = admins.find(a => a.email === email);
  if (adminUser) {
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid admin credentials' });
    const token = jwt.sign({ id: adminUser._id, role: adminUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    return res.json({ role: adminUser.role, token });
  }

  const clientUser = clients.find(c => c.email === email);
  if (!clientUser) return res.status(401).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, clientUser.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: clientUser.id, role: 'user' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  res.json({ success: true, token, client: clientUser });
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
  res.json(client);
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
  saveData();
  io.emit('finance_update');
  res.json(dep);
});

app.post('/api/withdrawals', verifyClientToken, async (req, res) => {
  const { amount, clientId } = req.body;
  const client = clients.find(c => c.id === clientId);
  if (!client || client.tradingMetrics.balance < amount) return res.status(400).json({ error: 'Insufficient balance' });

  const newWit = { id: 'W' + Date.now().slice(-6), status: 'pending', ...req.body, date: new Date() };
  client.tradingMetrics.balance -= parseFloat(amount);
  withdrawals.push(newWit);
  saveData();
  io.emit('finance_update');
  res.status(201).json(newWit);
});

app.put('/api/withdrawals/:id/status', verifyAdminToken, (req, res) => {
  const wit = withdrawals.find(w => w.id === req.params.id);
  if (req.body.status === 'rejected' && wit.status !== 'rejected') {
     const client = clients.find(c => c.id === wit.clientId);
     if (client) client.tradingMetrics.balance += parseFloat(wit.amount);
  }
  wit.status = req.body.status;
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


// Setup WebSockets
setupSockets(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => console.log(`Backend Server running on port ${PORT}`));
