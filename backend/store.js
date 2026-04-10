const mongoose = require('mongoose');
const Client = require('./models/Client');
const SymbolModel = require('./models/Symbol');
const Trade = require('./models/Trade');
const Transaction = require('./models/Transaction');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

// Initial Data Structure (Sync with src/data/adminMockData.js)
const defaultClients = [
  {
    id: 'C001',
    uid: 'MRX-10021',
    name: 'Ahmad Raza',
    email: 'ahmad.raza@email.com',
    contact: '+92-300-1234567',
    status: 'active',
    accountSummary: { deposit: 15000, creditDeposit: 1500, leverage: '1:200' },
    tradingMetrics: { balance: 15000, creditDeposit: 1500, freeMargin: 13980.20, marginLevel: 482.5, equity: 16240.50 }
  },
  {
    id: 'C002',
    uid: 'MRX-10022',
    name: 'Sara Khan',
    email: 'sara.khan@email.com',
    contact: '+92-321-9876543',
    status: 'active',
    accountSummary: { deposit: 25000, creditDeposit: 2500, leverage: '1:100' },
    tradingMetrics: { balance: 25000, creditDeposit: 2500, freeMargin: 20100.00, marginLevel: 312.8, equity: 22800.00 }
  },
  {
    id: 'C003',
    uid: 'MRX-10023',
    name: 'Usman Ali',
    email: 'usman.ali@email.com',
    contact: '+92-345-5551234',
    status: 'pending',
    accountSummary: { deposit: 5000, creditDeposit: 0, leverage: '1:500' },
    tradingMetrics: { balance: 5000, creditDeposit: 0, freeMargin: 4980.00, marginLevel: 890.2, equity: 5340.00 }
  },
  {
    id: 'C004',
    uid: 'MRX-10024',
    name: 'Fatima Sheikh',
    email: 'fatima.sheikh@email.com',
    contact: '+92-333-4445566',
    status: 'active',
    accountSummary: { deposit: 50000, creditDeposit: 5000, leverage: '1:200' },
    tradingMetrics: { balance: 50000, creditDeposit: 5000, freeMargin: 47800.00, marginLevel: 621.3, equity: 53200.00 }
  },
  {
    id: 'C005',
    uid: 'MRX-10025',
    name: 'Bilal Mahmood',
    email: 'bilal.mahmood@email.com',
    contact: '+92-311-7778899',
    status: 'suspended',
    accountSummary: { deposit: 8000, creditDeposit: 800, leverage: '1:100' },
    tradingMetrics: { balance: 8000, creditDeposit: 800, freeMargin: 5600.00, marginLevel: 145.6, equity: 7100.00 }
  },
  {
    id: 'C006',
    uid: 'MRX-10026',
    name: 'Zara Iqbal',
    email: 'zara.iqbal@email.com',
    contact: '+92-323-1122334',
    status: 'active',
    accountSummary: { deposit: 12000, creditDeposit: 1200, leverage: '1:300' },
    tradingMetrics: { balance: 12000, creditDeposit: 1200, freeMargin: 11600.00, marginLevel: 540.8, equity: 13450.00 }
  },
  {
    id: 'C007',
    uid: 'MRX-10027',
    name: 'Hassan Nawaz',
    email: 'hassan.nawaz@email.com',
    contact: '+92-302-9998877',
    status: 'pending',
    accountSummary: { deposit: 3000, creditDeposit: 0, leverage: '1:100' },
    tradingMetrics: { balance: 3000, creditDeposit: 0, freeMargin: 2970.00, marginLevel: 1200.4, equity: 2980.00 }
  },
  {
    id: 'C008',
    uid: 'MRX-10028',
    name: 'Nadia Hussain',
    email: 'nadia.hussain@email.com',
    contact: '+92-315-6655443',
    status: 'active',
    accountSummary: { deposit: 30000, creditDeposit: 3000, leverage: '1:200' },
    tradingMetrics: { balance: 30000, creditDeposit: 3000, freeMargin: 28200.00, marginLevel: 398.7, equity: 31800.00 }
  }
];

let clients = [];
let activeTrades = {}; 
let deposits = [];
let withdrawals = [];
let admins = [];

const defaultSymbols = [
  { id: 'S001', name: 'Gold vs US Dollar', symbol: 'XAUUSD', price: '2315.42', spread: 50, commission: 0.00, lotMin: 0.01, lotStep: 0.01, lotMax: 100, commissionType: 'spread-only', precision: 2, category: 'Metals', iconClassName: 'fa-cubes-stacked', quoteCurrency: 'USD', swapRate: 0.02 },
  { id: 'S002', name: 'Euro vs US Dollar', symbol: 'EURUSD', price: '1.09469', spread: 12, commission: 3.50, lotMin: 0.01, lotStep: 0.01, lotMax: 500, commissionType: 'standard', precision: 5, category: 'Forex', iconClassName: 'fa-euro-sign', quoteCurrency: 'USD', swapRate: 0.01 },
  { id: 'S003', name: 'Bitcoin vs US Dollar', symbol: 'BTCUSD', price: '69888.53', spread: 2500, commission: 0.00, lotMin: 0.01, lotStep: 0.01, lotMax: 50, commissionType: 'spread-only', precision: 2, category: 'Crypto', iconClassName: 'fa-bitcoin', quoteCurrency: 'USD', swapRate: 0.05 },
  { id: 'S004', name: 'British Pound vs US Dollar', symbol: 'GBPUSD', price: '1.27374', spread: 14, commission: 3.50, lotMin: 0.01, lotStep: 0.01, lotMax: 500, commissionType: 'standard', precision: 5, category: 'Forex', iconClassName: 'fa-sterling-sign', quoteCurrency: 'USD', swapRate: 0.01 },
  { id: 'S005', name: 'Dow Jones Index', symbol: 'US30', price: '39124.50', spread: 200, commission: 0.00, lotMin: 0.10, lotStep: 0.10, lotMax: 200, commissionType: 'spread-only', precision: 2, category: 'Indices', iconClassName: 'fa-chart-line', quoteCurrency: 'USD', swapRate: 0.02 }
];

let symbolsList = [];

// Persistence Helpers
let saveTimeout = null;
const saveData = () => {
  // Check if DB is connected (1 = connected)
  if (mongoose.connection.readyState !== 1) {
    console.warn('⚠️ MongoDB Offline: Skipping persistence write. Data safe in memory.');
    return;
  }

  // Debounce saving to DB to avoid overloading it every 1 second
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      // 1. Save Clients
      const clientBulk = clients.map(c => ({
        updateOne: { filter: { id: c.id }, update: { $set: c }, upsert: true }
      }));
      if(clientBulk.length > 0) await Client.bulkWrite(clientBulk);

      // 2. Save Symbols
      const symbolBulk = symbolsList.map(s => ({
        updateOne: { filter: { id: s.id }, update: { $set: s }, upsert: true }
      }));
      if(symbolBulk.length > 0) await SymbolModel.bulkWrite(symbolBulk);

      // 3. Save Trades
      let flatTrades = [];
      Object.values(activeTrades).forEach(tradesArray => {
        flatTrades.push(...tradesArray);
      });
      if (flatTrades.length > 0) {
        const tradeBulk = flatTrades.map(t => ({
          updateOne: { filter: { id: t.id }, update: { $set: t }, upsert: true }
        }));
        await Trade.bulkWrite(tradeBulk);

        // Memory Purge: Remove Closed trades from RAM after successful sync
        Object.keys(activeTrades).forEach(clientId => {
          activeTrades[clientId] = activeTrades[clientId].filter(t => t.status !== 'Closed');
        });
      }

      // 4. Save Transactions
      const allTx = [...deposits, ...withdrawals];
      if (allTx.length > 0) {
        const txBulk = allTx.map(tx => ({
          updateOne: { filter: { id: tx.id }, update: { $set: tx }, upsert: true }
        }));
        await Transaction.bulkWrite(txBulk);
      }
      console.log('✅ Background Sync: In-memory data persisted to MongoDB.');
    } catch (e) {
      console.error('Mongo SaveData Error:', e);
    }
  }, 3000); // Wait 3 seconds of inactivity before writing, or writes every 3s
};

const initializeDB = async () => {
  try {
    // 1. Seed Check
    const cCount = await Client.countDocuments();
    if (cCount === 0) {
      console.log('Seeding MongoDB with default Clients...');
      await Client.insertMany(defaultClients);
    }

    const aCount = await Admin.countDocuments();
    if (aCount === 0) {
      console.log('Seeding MongoDB with default Admin...');
      const hashedPassword = await bcrypt.hash('admin', 10);
      await Admin.create({ email: 'admin@mirrox.com', password: hashedPassword, name: 'Super Admin', role: 'admin' });
    }

    const sCount = await SymbolModel.countDocuments();
    if (sCount === 0) {
      console.log('Seeding MongoDB with default Symbols...');
      await SymbolModel.insertMany(defaultSymbols);
    }

    // 2. Load into memory to preserve socket engine speed
    const dbClients = await Client.find().lean();
    clients.length = 0; 
    clients.push(...dbClients);

    const dbAdmins = await Admin.find().lean();
    admins.length = 0;
    admins.push(...dbAdmins);

    const dbSymbols = await SymbolModel.find().lean();
    symbolsList.length = 0;
    symbolsList.push(...dbSymbols);

    // Load only Open/Pending trades into hot memory. Closed trades stay in MongoDB.
    const dbTrades = await Trade.find({ status: { $ne: 'Closed' } }).lean();
    Object.keys(activeTrades).forEach(k => delete activeTrades[k]);
    dbTrades.forEach(t => {
      if (!activeTrades[t.clientId]) activeTrades[t.clientId] = [];
      activeTrades[t.clientId].push(t);
    });

    const dbTransactions = await Transaction.find().lean();
    deposits.length = 0;
    withdrawals.length = 0;
    dbTransactions.forEach(tx => {
      if (tx.type === 'deposit') deposits.push(tx);
      else withdrawals.push(tx);
    });

    console.log('✅ Memory Cache successfully loaded from MongoDB.');
  } catch (err) {
    console.error('Database Initialization failed. Initializing with hardcoded defaults...', err.message);
    
    // Fallback to defaults to prevent server crash
    if (clients.length === 0) clients.push(...defaultClients);
    if (symbolsList.length === 0) symbolsList.push(...defaultSymbols);
    if (admins.length === 0) admins.push({ email: 'admin@mirrox.com', password: await bcrypt.hash('admin', 10), role: 'admin' });
  }
};

// Initial load (Called manually or bound to mongoose connection)

module.exports = {
  clients,
  activeTrades,
  symbolsList,
  deposits,
  withdrawals,
  admins,
  saveData,
  initializeDB
};

