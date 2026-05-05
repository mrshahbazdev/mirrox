const mongoose = require('mongoose');
const Symbol = require('../models/Symbol');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const symbolsToSeed = [
  // Indices
  { symbol: 'US500', name: 'S&P 500', category: 'Indices', precision: 2, price: '5245.50', spread: 150 },
  { symbol: 'US30', name: 'Dow Jones 30', category: 'Indices', precision: 2, price: '39124.50', spread: 200 },
  { symbol: 'US100', name: 'Nasdaq 100', category: 'Indices', precision: 2, price: '18250.25', spread: 200 },
  { symbol: 'GER40', name: 'DAX (GER40)', category: 'Indices', precision: 2, price: '18450.10', spread: 180 },
  { symbol: 'UK100', name: 'FTSE 100 (UK100)', category: 'Indices', precision: 2, price: '7950.40', spread: 140 },
  { symbol: 'FRA40', name: 'CAC 40 (FRA40)', category: 'Indices', precision: 2, price: '8210.50', spread: 150 },

  // Commodities
  { symbol: 'XAUUSD', name: 'Gold vs US Dollar', category: 'Commodities', precision: 2, price: '2315.42', spread: 50 },
  { symbol: 'XAGUSD', name: 'Silver vs US Dollar', category: 'Commodities', precision: 3, price: '29.15', spread: 30 },
  { symbol: 'XTIUSD', name: 'Crude Oil WTI', category: 'Commodities', precision: 2, price: '78.45', spread: 40 },
  { symbol: 'XBRUSD', name: 'Brent Crude Oil', category: 'Commodities', precision: 2, price: '82.30', spread: 40 },
  { symbol: 'XNGUSD', name: 'Natural Gas', category: 'Commodities', precision: 3, price: '2.185', spread: 30 },

  // Forex Majors
  { symbol: 'EURUSD', name: 'Euro vs US Dollar', category: 'Forex', precision: 5, price: '1.09013', spread: 15 },
  { symbol: 'USDJPY', name: 'US Dollar vs Japanese Yen', category: 'Forex', precision: 3, price: '151.240', spread: 9 },
  { symbol: 'GBPUSD', name: 'British Pound vs US Dollar', category: 'Forex', precision: 5, price: '1.27338', spread: 14 },
  { symbol: 'USDCHF', name: 'US Dollar vs Swiss Franc', category: 'Forex', precision: 5, price: '0.90450', spread: 18 },
  { symbol: 'USDCAD', name: 'US Dollar vs Canadian Dollar', category: 'Forex', precision: 5, price: '1.35400', spread: 17 },
  { symbol: 'AUDUSD', name: 'Australian Dollar vs US Dollar', category: 'Forex', precision: 5, price: '0.65450', spread: 16 },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar vs US Dollar', category: 'Forex', precision: 5, price: '0.60100', spread: 19 },

  // Forex Crosses
  { symbol: 'EURGBP', name: 'Euro vs British Pound', category: 'Forex', precision: 5, price: '0.85400', spread: 14 },
  { symbol: 'EURJPY', name: 'Euro vs Japanese Yen', category: 'Forex', precision: 3, price: '163.450', spread: 12 },
  { symbol: 'GBPJPY', name: 'British Pound vs Japanese Yen', category: 'Forex', precision: 3, price: '191.200', spread: 18 },
  { symbol: 'EURAUD', name: 'Euro vs Australian Dollar', category: 'Forex', precision: 5, price: '1.64500', spread: 25 },
  { symbol: 'GBPCAD', name: 'British Pound vs Canadian Dollar', category: 'Forex', precision: 5, price: '1.72300', spread: 22 },
  { symbol: 'CHFJPY', name: 'Swiss Franc vs Japanese Yen', category: 'Forex', precision: 3, price: '168.200', spread: 15 },
  { symbol: 'NZDJPY', name: 'New Zealand Dollar vs Japanese Yen', category: 'Forex', precision: 3, price: '91.050', spread: 18 },

  // Crypto
  { symbol: 'BTCUSDT', name: 'Bitcoin vs Tether', category: 'Crypto', precision: 2, price: '69888.53', spread: 2500 },
  { symbol: 'ETHUSDT', name: 'Ethereum vs Tether', category: 'Crypto', precision: 2, price: '3450.20', spread: 800 },
  { symbol: 'BNBUSDT', name: 'BNB vs Tether', category: 'Crypto', precision: 2, price: '585.40', spread: 200 },
  { symbol: 'SOLUSDT', name: 'Solana vs Tether', category: 'Crypto', precision: 2, price: '142.80', spread: 150 },
  { symbol: 'XRPUSDT', name: 'XRP vs Tether', category: 'Crypto', precision: 4, price: '0.5240', spread: 30 },
  { symbol: 'ETHBTC', name: 'Ethereum vs Bitcoin', category: 'Crypto', precision: 5, price: '0.04935', spread: 50 },
  { symbol: 'BNBBTC', name: 'BNB vs Bitcoin', category: 'Crypto', precision: 5, price: '0.00838', spread: 20 },
  { symbol: 'SOLBTC', name: 'Solana vs Bitcoin', category: 'Crypto', precision: 5, price: '0.00204', spread: 15 },
  { symbol: 'ADAUSDT', name: 'Cardano vs Tether', category: 'Crypto', precision: 4, price: '0.4520', spread: 25 },
  { symbol: 'DOGEUSDT', name: 'Dogecoin vs Tether', category: 'Crypto', precision: 5, price: '0.1580', spread: 20 },
  { symbol: 'AVAXUSDT', name: 'Avalanche vs Tether', category: 'Crypto', precision: 2, price: '35.80', spread: 100 },
  { symbol: 'DOTUSDT', name: 'Polkadot vs Tether', category: 'Crypto', precision: 3, price: '7.250', spread: 50 },
  { symbol: 'MATICUSDT', name: 'Polygon vs Tether', category: 'Crypto', precision: 4, price: '0.7850', spread: 30 },

  // Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'Stocks', precision: 2, price: '178.50', spread: 20 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'Stocks', precision: 2, price: '415.80', spread: 25 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'Stocks', precision: 2, price: '182.30', spread: 20 },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'Stocks', precision: 2, price: '175.40', spread: 30 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', category: 'Stocks', precision: 2, price: '880.50', spread: 50 },
  { symbol: 'NFLX', name: 'Netflix Inc.', category: 'Stocks', precision: 2, price: '628.20', spread: 40 },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', category: 'Stocks', precision: 2, price: '162.40', spread: 25 },
  { symbol: 'PLTR', name: 'Palantir Technologies Inc.', category: 'Stocks', precision: 2, price: '22.80', spread: 15 },
  { symbol: 'COIN', name: 'Coinbase Global Inc.', category: 'Stocks', precision: 2, price: '245.60', spread: 35 }
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
