require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Client = require('./models/Client');
const Admin = require('./models/Admin');
const { Server } = require('socket.io');
const setupSockets = require('./socket/index');
const { clients, activeTrades, symbolsList, deposits, withdrawals, admins, saveData, initializeDB } = require('./store');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

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

// Disable buffering so that queries fail fast if DB is offline, 
// allowing our 'Hybrid Persistence' logic in store.js to take over instantly.
mongoose.set('bufferCommands', false);

// --- AUTH APIS ---
app.post('/api/auth/register', async (req, res) => {
  const { name, email, contact, password } = req.body;
  console.log(`[AUTH] Register request for: ${email}. DB State: ${mongoose.connection.readyState}`);
  
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    let existing = null;
    if (mongoose.connection.readyState === 1) {
      console.log('[AUTH] DB is Online. Checking for existing user in MongoDB...');
      existing = await Client.findOne({ email });
    } else {
      console.log('[AUTH] DB is Offline/Connecting. Checking in-memory cache...');
      existing = clients.find(c => c.email === email);
    }
    
    if (existing) {
      console.log('[AUTH] User already exists.');
      return res.status(400).json({ error: 'Email already exists' });
    }

    console.log('[AUTH] Creating new user profile...');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = new Client({
      id: 'C' + Date.now().toString().slice(-4),
      uid: 'MRX-' + Math.floor(10000 + Math.random() * 90000),
      name,
      email,
      password: hashedPassword,
      contact: contact || '',
      status: 'active',
      accountSummary: {
        deposit: 10000,
        creditDeposit: 0,
        leverage: '1:100'
      },
      tradingMetrics: {
        balance: 10000,
        creditDeposit: 0,
        freeMargin: 10000,
        equity: 10000
      }
    });

    console.log('[AUTH] User profile created. Syncing to persistence engine...');
    if (mongoose.connection.readyState === 1) {
      try {
        await newClient.save();
      } catch (saveErr) {
        console.warn('⚠️ Register save to DB failed, keeping in memory only.', saveErr.message);
      }
    }
    
    clients.push(newClient.toObject ? newClient.toObject() : newClient);
    saveData(); // Trigger sync attempt
    
    const token = jwt.sign({ id: newClient.id, role: 'user' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.status(201).json({ success: true, message: 'Registration successful', token, client: newClient });
  } catch (err) {
    console.error('CRITICAL Registration Error:', err);
    res.status(500).json({ error: 'Server error during registration', details: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  
  try {
    let adminUser = null;
    let clientUser = null;

    if (mongoose.connection.readyState === 1) {
      adminUser = await Admin.findOne({ email });
      if (!adminUser) {
        clientUser = await Client.findOne({ email });
      }
    } else {
      adminUser = admins.find(a => a.email === email);
      if (!adminUser) {
        clientUser = clients.find(c => c.email === email);
      }
    }

    if (adminUser) {
      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid admin credentials' });
      const token = jwt.sign({ id: adminUser._id, role: adminUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      return res.json({ role: adminUser.role, token });
    }

    if (!clientUser) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, clientUser.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: clientUser.id || clientUser._id, role: 'user' }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ success: true, token, client: clientUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// --- SYMBOLS APIS ---
app.get('/api/symbols', (req, res) => {
  res.json(symbolsList);
});

app.put('/api/symbols/:id', (req, res) => {
  const index = symbolsList.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).send('Not Found');
  
  symbolsList[index] = { ...symbolsList[index], ...req.body };
  saveData();
  res.json(symbolsList[index]);
});

// --- CLIENT APIS ---
app.get('/api/clients', (req, res) => {
  res.json(clients);
});

app.get('/api/clients/:id', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).send('Not Found');
  res.json(client);
});

app.post('/api/clients/:id/kyc/submit', upload.single('document'), async (req, res) => {
  try {
    const { id } = req.params;
    const { docType } = req.body;
    const client = clients.find(c => c.id === id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'mirrox_kyc',
        resource_type: 'auto',
        width: 1024,
        fetch_format: 'auto',
        quality: 'auto',
        moderation: 'ai_vision_moderation',
        moderation_questions: [
            "Is this image completely unrelated to an official ID card, passport, or government identity document?",
            "Does the document appear to be fake, highly edited, a cartoon, or a picture taken of a digital screen?"
        ],
        notification_url: (process.env.BACKEND_URL || "https://mirrox-backend-production.up.railway.app") + "/api/webhooks/cloudinary"
      },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return res.status(500).json({ error: 'File upload failed' });
        }
        
        client.kyc = {
          ...client.kyc,
          status: 'pending',
          documentType: docType || 'id_card',
          documentName: req.file.originalname,
          documentUrl: result.secure_url,
          cloudinaryPublicId: result.public_id,
          rejectionReason: null,
          submittedAt: new Date()
        };
        
        saveData();
        io.emit('finance_update'); 
        return res.json({ message: 'KYC submitted successfully', kyc: client.kyc });
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error("KYC Submit error:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/clients', (req, res) => {
  const newClient = {
    id: 'C' + (clients.length + 1).toString().padStart(3, '0'),
    uid: 'MRX-' + Math.floor(10000 + Math.random() * 90000),
    ...req.body,
    status: req.body.status || 'pending'
  };
  clients.push(newClient);
  saveData();
  res.status(201).json(newClient);
});

app.put('/api/clients/:id/balance', (req, res) => {
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).send('Not Found');
  
  const newBalance = parseFloat(req.body.balance);
  if (isNaN(newBalance)) return res.status(400).send('Invalid Balance');

  clients[index].tradingMetrics.balance = newBalance;
  clients[index].accountSummary.deposit = newBalance; 
  clients[index].tradingMetrics.equity = newBalance + (clients[index].accountSummary.profitLoss || 0);
  
  saveData();
  res.json(clients[index]);
});

app.put('/api/clients/:id', (req, res) => {
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).send('Not Found');
  
  clients[index] = { ...clients[index], ...req.body };
  saveData();
  res.json(clients[index]);
});

app.delete('/api/clients/:id', (req, res) => {
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).send('Not Found');
  
  const removed = clients.splice(index, 1);
  saveData();
  res.json(removed[0]);
});

app.put('/api/clients/:id/kyc', async (req, res) => {
  try {
    const client = clients.find(c => c.id === req.params.id);
    if (!client) return res.status(404).send('Not Found');
    
    // Check if rejection requires Cloudinary deletion
    if (req.body.status === 'rejected' && client.kyc?.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(client.kyc.cloudinaryPublicId);
      client.kyc.documentUrl = null;
      client.kyc.cloudinaryPublicId = null;
    }
    
    client.kyc = { ...client.kyc, ...req.body };
    saveData();
    io.emit('finance_update');
    res.json(client);
  } catch(err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/clients/:id/kyc/review', async (req, res) => {
  try {
    const { action, rejectionReason } = req.body;
    const client = clients.find(c => c.id === req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    
    if (action === 'reject') {
      if (client.kyc?.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(client.kyc.cloudinaryPublicId);
        client.kyc.documentUrl = null;
        client.kyc.cloudinaryPublicId = null;
      }
      client.kyc.status = 'rejected';
      client.kyc.rejectionReason = rejectionReason;
    } else if (action === 'approve') {
      client.kyc.status = 'approved';
      client.kyc.rejectionReason = null;
      client.accountType = 'live'; // Convert to real account automatically
    }
    
    client.kyc.reviewedAt = new Date();
    saveData();
    io.emit('finance_update');
    res.json({ message: 'Success', kyc: client.kyc });
  } catch (err) {
    res.status(500).json({ error: 'Server error parsing review' });
  }
});

// Balance route moved up to prevent clash

app.post('/api/deposits', (req, res) => {
  const newDeposit = {
    id: 'D' + Date.now().toString().slice(-6),
    date: new Date().toISOString().split('T')[0],
    type: 'deposit',
    ...req.body
  };
  deposits.push(newDeposit);
  
  // Real-time Balance sync if approved immediately (rare, but possible)
  if (newDeposit.status === 'approved') {
    const client = clients.find(c => c.id === req.body.clientId);
    if (client) {
      client.accountSummary.deposit += parseFloat(newDeposit.amount);
      client.tradingMetrics.balance += parseFloat(newDeposit.amount);
    }
  }
  
  saveData();
  io.emit('finance_update'); // Notification for Admin & User UI refresh
  res.status(201).json(newDeposit);
});

// Update Deposit Status (Approval/Rejection)
app.put('/api/deposits/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const deposit = deposits.find(d => d.id === id);
  if (!deposit) return res.status(404).json({ error: 'Deposit not found' });

  // Only sync balance if transitions to 'approved' for the first time
  if (status === 'approved' && deposit.status !== 'approved') {
     const client = clients.find(c => c.id === deposit.clientId);
     if (client) {
       client.accountSummary.deposit += parseFloat(deposit.amount || 0);
       client.tradingMetrics.balance += parseFloat(deposit.amount || 0);
     }
  }
  
  deposit.status = status;
  saveData();
  io.emit('finance_update'); // Admin approved/rejected it, UI should reflect
  res.json(deposit);
});

// Update Withdrawal Status (Approval/Rejection)
app.put('/api/withdrawals/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const withdrawal = withdrawals.find(w => w.id === id);
  if (!withdrawal) return res.status(404).json({ error: 'Withdrawal not found' });

  // If Admin REJECTS a previously pending/approved withdrawal, refund the held amount
  if (status === 'rejected' && withdrawal.status !== 'rejected') {
     const client = clients.find(c => c.id === withdrawal.clientId);
     if (client) {
       client.tradingMetrics.balance += parseFloat(withdrawal.amount || 0);
     }
  }
  
  // If Admin APPROVES after it was previously REJECTED (rare, but just in case), deduct again
  if (status === 'approved' && withdrawal.status === 'rejected') {
     const client = clients.find(c => c.id === withdrawal.clientId);
     if (client) {
       client.tradingMetrics.balance -= parseFloat(withdrawal.amount || 0);
     }
  }
  
  withdrawal.status = status;
  saveData();
  io.emit('finance_update');
  res.json(withdrawal);
});

// Update client KYC (Administrative)
app.put('/api/clients/:id/kyc', (req, res) => {
  const { id } = req.params;
  const kycData = req.body; 
  const client = clients.find(c => c.id === id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  client.kyc = { ...client.kyc, ...kycData };
  saveData();
  res.json(client);
});

// Submit client KYC (Client-side)
app.post('/api/clients/:id/kyc/submit', (req, res) => {
  const { id } = req.params;
  const { docType, docName } = req.body;
  const client = clients.find(c => c.id === id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  client.kyc = {
    status: 'pending',
    docType,
    docName,
    submittedAt: new Date().toISOString()
  };
  saveData();
  res.json(client);
});

// Admin ONLY: Get All Deposits & Withdrawals
app.get('/api/deposits', (req, res) => {
  const enhanced = deposits.map(d => {
    const client = clients.find(c => c.id === d.clientId);
    return { ...d, clientName: client ? client.name : 'Unknown' };
  });
  res.json(enhanced);
});

app.get('/api/withdrawals', (req, res) => {
  const enhanced = withdrawals.map(w => {
    const client = clients.find(c => c.id === w.clientId);
    return { ...w, clientName: client ? client.name : 'Unknown' };
  });
  res.json(enhanced);
});

app.get('/api/deposits/:clientId', (req, res) => {
  const userDeposits = deposits.filter(d => d.clientId === req.params.clientId);
  res.json(userDeposits);
});

app.get('/api/withdrawals/:clientId', (req, res) => {
  const userWithdrawals = withdrawals.filter(w => w.clientId === req.params.clientId);
  res.json(userWithdrawals);
});

app.post('/api/withdrawals', (req, res) => {
  const newWithdrawal = {
    id: 'W' + Date.now().toString().slice(-6),
    date: new Date().toISOString().split('T')[0],
    type: 'withdrawal',
    ...req.body
  };
  withdrawals.push(newWithdrawal);

  // Immediately hold/deduct the funds from user balance
  const client = clients.find(c => c.id === req.body.clientId);
  if (client) {
    client.tradingMetrics.balance -= parseFloat(req.body.amount || 0);
  }

  saveData();
  io.emit('finance_update');
  res.status(201).json(newWithdrawal);
});

app.put('/api/withdrawals/:id', (req, res) => {
  const index = withdrawals.findIndex(w => w.id === req.params.id);
  if (index === -1) return res.status(404).send('Not Found');
  
  withdrawals[index] = { ...withdrawals[index], ...req.body };
  saveData();
  res.json(withdrawals[index]);
});

// --- KYC APIS ---
// User submits KYC documents (simulated — stores metadata, no real file upload)
app.post('/api/clients/:id/kyc/submit', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  const { docType, docName } = req.body;
  if (!docType || !docName) return res.status(400).json({ error: 'docType and docName are required' });

  if (!client.kyc) client.kyc = {};
  client.kyc.status = 'pending';
  client.kyc.docType = docType;
  client.kyc.docName = docName;
  client.kyc.submittedAt = new Date().toISOString();
  client.kyc.rejectionReason = null;

  saveData();
  res.json({ message: 'KYC submitted for review', kyc: client.kyc });
});

// Admin reviews KYC — approve or reject
app.put('/api/clients/:id/kyc/review', (req, res) => {
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  const { action, rejectionReason } = req.body; // action: 'approve' | 'reject'
  if (!['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'Invalid action' });

  if (!client.kyc) client.kyc = {};
  client.kyc.status = action === 'approve' ? 'approved' : 'rejected';
  client.kyc.reviewedAt = new Date().toISOString();
  client.kyc.rejectionReason = action === 'reject' ? (rejectionReason || 'Document not accepted') : null;

  // Upgrade to live account on approval
  if (action === 'approve') {
    client.accountType = 'live';
  }

  saveData();
  res.json({ message: `KYC ${action}d`, kyc: client.kyc, accountType: client.accountType });
});

// --- MARKET APIS ---
app.get('/api/symbols', (req, res) => {
  res.json(symbolsList);
});

// Admin creates a new symbol
app.post('/api/symbols', (req, res) => {
  const { symbol, name, category, spread, commission, lotMin, lotStep, lotMax, swapRate, precision, commissionType } = req.body;
  if (!symbol || !category) return res.status(400).json({ error: 'Symbol and category are required' });

  const newSym = {
    id: Date.now(),
    symbol,
    name: name || symbol,
    category,
    price: (category === 'Crypto' ? 60000 : category === 'Metals' ? 2300 : 1.12345).toString(),
    spread: +spread || 10,
    commission: +commission || 5,
    lotMin: +lotMin || 0.01,
    lotStep: +lotStep || 0.01,
    lotMax: +lotMax || 100,
    swapRate: +swapRate || 0,
    precision: +precision || (category === 'Crypto' ? 2 : category === 'Metals' ? 2 : 5),
    commissionType: commissionType || 'standard'
  };

  symbolsList.push(newSym);
  saveData();
  res.status(201).json(newSym);
});

// Admin deletes a symbol (delists)
app.delete('/api/symbols/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = symbolsList.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Symbol not found' });

  symbolsList.splice(index, 1);
  saveData();
  res.json({ message: 'Symbol delisted successfuly' });
});

// Cloudinary Webhook Listener
app.post('/api/webhooks/cloudinary', async (req, res) => {
  console.log("Webhook received from Cloudinary: ", req.body);
  
  if (req.body.notification_type === 'moderation' && req.body.moderation_kind === 'ai_vision') {
     const { public_id, moderation_status } = req.body;
     
     // Find the client with this file
     const client = clients.find(c => c.kyc && c.kyc.cloudinaryPublicId === public_id);
     
     if (client && client.kyc.status === 'pending') {
        if (moderation_status === 'rejected') {
            client.kyc.status = 'rejected';
            client.kyc.rejectionReason = "Auto-Rejected by AI Vision: Image failed security prompts (e.g. invalid document, fake, selfie, etc.)";
            // delete from cloudinary to save quota!
            try {
               await cloudinary.uploader.destroy(public_id);
               client.kyc.documentUrl = null;
               client.kyc.cloudinaryPublicId = null;
            } catch(delErr) {
               console.error("Webhook: Failed to delete rejected image", delErr);
            }
        } else if (moderation_status === 'approved') {
            // we can auto-approve or leave pending for admin
            // it's safer to leave for Admin final sanity check, but if we wanted full automation:
            // client.kyc.status = 'approved';
            // client.accountType = 'live'; 
        }
        
        saveData();
        io.emit('finance_update'); // trigger realtime dashboard update
     }
  }
  
  // Acknowledge receipt to Cloudinary so they don't resend
  res.status(200).send("OK");
});

app.get('/api/trades/:clientId', (req, res) => {
  const trades = activeTrades[req.params.clientId] || [];
  res.json(trades);
});

// Admin Monitoring: Active Traders
app.get('/api/active-traders', (req, res) => {
  const activeClients = [];
  
  // Iterate through all tracked trades per client ID
  Object.keys(activeTrades).forEach(clientId => {
    const trades = activeTrades[clientId] || [];
    const openTrades = trades.filter(t => t.status === 'Open');
    
    if (openTrades.length > 0) {
      // Find the client details
      const client = clients.find(c => c.id === clientId);
      if (client) {
        
        // Calculate aggregations
        let floatingPL = 0;
        let totalLots = 0;
        openTrades.forEach(t => {
           floatingPL += parseFloat(t.profit || 0);
           totalLots += parseFloat(t.lots || 0);
        });

        activeClients.push({
          id: client.id,
          name: client.name,
          uid: client.uid,
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

// Calculate Analytics for a Client
app.get('/api/clients/:id/analytics', (req, res) => {
  const { id } = req.params;
  const clientTrades = activeTrades[id] || [];
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
  const avgWin = winTrades.length > 0 ? totalProfit / winTrades.length : 0;
  const avgLoss = lossTrades.length > 0 ? totalLoss / lossTrades.length : 0;

  const buyTrades = clientTrades.filter(t => t.type === 'BUY').length;
  const sellTrades = clientTrades.filter(t => t.type === 'SELL').length;
  const totalBuySell = buyTrades + sellTrades;

  // ROI based on Net P/L vs Initial / Total Deposit
  const netPL = (client.accountSummary?.profitLoss || 0);
  const totalDep = (client.accountSummary?.deposit || 10000); // fallback to demo default
  const roi = (netPL / totalDep) * 100;

  res.json({
    totalTrades: clientTrades.length,
    closedTrades: totalClosed,
    winRate: winRate,
    profitFactor: profitFactor.toFixed(2),
    avgWin: avgWin.toFixed(2),
    avgLoss: avgLoss.toFixed(2),
    buyPercent: totalBuySell > 0 ? (buyTrades / totalBuySell) * 100 : 50,
    sellPercent: totalBuySell > 0 ? (sellTrades / totalBuySell) * 100 : 50,
    buyCount: buyTrades,
    sellCount: sellTrades,
    roi: roi.toFixed(2)
  });
});

// Setup WebSockets
setupSockets(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend Server running on port ${PORT}`);
});

