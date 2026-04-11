const mongoose = require('mongoose');
const Symbol = require('../models/Symbol');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const symbolsToSeed = [
  // Forex Majors
  { symbol: 'EURUSD', name: 'EUR/USD (Euro / US Dollar)', category: 'Forex', precision: 5, price: '1.09013', spread: 15 },
  { symbol: 'GBPUSD', name: 'GBP/USD (British Pound / US Dollar)', category: 'Forex', precision: 5, price: '1.27338', spread: 14 },
  { symbol: 'USDJPY', name: 'USD/JPY (US Dollar / Japanese Yen)', category: 'Forex', precision: 3, price: '151.240', spread: 9 },
  { symbol: 'USDCHF', name: 'USD/CHF (US Dollar / Swiss Franc)', category: 'Forex', precision: 5, price: '0.90450', spread: 18 },
  { symbol: 'AUDUSD', name: 'AUD/USD (Australian Dollar / US Dollar)', category: 'Forex', precision: 5, price: '0.65450', spread: 16 },
  { symbol: 'USDCAD', name: 'USD/CAD (US Dollar / Canadian Dollar)', category: 'Forex', precision: 5, price: '1.35400', spread: 17 },
  { symbol: 'NZDUSD', name: 'NZD/USD (New Zealand Dollar / US Dollar)', category: 'Forex', precision: 5, price: '0.60100', spread: 19 },

  // Forex Crosses
  { symbol: 'EURGBP', name: 'EUR/GBP', category: 'Forex', precision: 5, price: '0.85400', spread: 14 },
  { symbol: 'EURJPY', name: 'EUR/JPY', category: 'Forex', precision: 3, price: '163.450', spread: 12 },
  { symbol: 'GBPJPY', name: 'GBP/JPY', category: 'Forex', precision: 3, price: '191.200', spread: 18 },
  { symbol: 'EURAUD', name: 'EUR/AUD', category: 'Forex', precision: 5, price: '1.64500', spread: 25 },
  { symbol: 'CHFJPY', name: 'CHF/JPY', category: 'Forex', precision: 3, price: '168.200', spread: 15 },
  { symbol: 'NZDJPY', name: 'NZD/JPY', category: 'Forex', precision: 3, price: '91.050', spread: 18 },

  // Indices
  { symbol: 'US500', name: 'S&P 500 (US500 / SPX)', category: 'Indices', precision: 2, price: '5245.50', spread: 150 },
  { symbol: 'NAS100', name: 'NASDAQ 100 (NAS100 / NDX)', category: 'Indices', precision: 2, price: '18250.25', spread: 200 },
  { symbol: 'US30', name: 'Dow Jones Industrial Average (US30 / DJIA)', category: 'Indices', precision: 2, price: '39124.50', spread: 200 },
  { symbol: 'US2000', name: 'Russell 2000 (US2000)', category: 'Indices', precision: 2, price: '2085.30', spread: 120 },
  { symbol: 'GER40', name: 'DAX (GER40)', category: 'Indices', precision: 2, price: '18450.10', spread: 180 },
  { symbol: 'UK100', name: 'FTSE 100 (UK100)', category: 'Indices', precision: 2, price: '7950.40', spread: 140 },
  { symbol: 'FRA40', name: 'CAC 40 (FRA40)', category: 'Indices', precision: 2, price: '8210.50', spread: 150 },
  { symbol: 'EU50', name: 'Euro Stoxx 50 (EU50)', category: 'Indices', precision: 2, price: '5045.20', spread: 110 },
  { symbol: 'ESP35', name: 'IBEX 35 (ESP35)', category: 'Indices', precision: 2, price: '11050.80', spread: 250 }
];

async function seed() {
  try {
    console.log('🔗 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected.');

    let addedCount = 0;
    let updatedCount = 0;

    for (const data of symbolsToSeed) {
      const existing = await Symbol.findOne({ symbol: data.symbol });
      
      if (existing) {
        // Update existing to match requested format and refresh params
        existing.name = data.name;
        existing.category = data.category;
        existing.precision = data.precision;
        existing.spread = data.spread;
        await existing.save();
        updatedCount++;
        console.log(`✨ Updated: ${data.symbol}`);
      } else {
        // Create new
        const newSymbol = new Symbol({
          id: 'S' + Math.floor(100 + Math.random() * 899) + Date.now().toString().slice(-3),
          ...data,
          lotMin: (data.category === 'Indices' ? 0.1 : 0.01),
          lotStep: (data.category === 'Indices' ? 0.1 : 0.01),
          lotMax: 500,
          swapRate: 0.01
        });
        await newSymbol.save();
        addedCount++;
        console.log(`➕ Added: ${data.symbol}`);
      }
    }

    console.log('\n--- Seeding Summary ---');
    console.log(`Total Processed: ${symbolsToSeed.length}`);
    console.log(`New Symbols Added: ${addedCount}`);
    console.log(`Existing Updated: ${updatedCount}`);
    console.log('------------------------');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
