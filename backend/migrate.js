const mongoose = require('mongoose');
const Symbol = require('./models/Symbol');
const Client = require('./models/Client');
require('dotenv').config();

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for Migration');

    // 1. Update Symbols with missing defaults
    const symbols = await Symbol.find();
    console.log(`Checking ${symbols.length} symbols...`);
    for (const s of symbols) {
      let updated = false;
      if (s.precision === undefined || s.precision === null) {
        s.precision = (s.category === 'Crypto' ? 2 : s.category === 'Metals' ? 2 : 5);
        updated = true;
      }
      if (s.swapRate === undefined || s.swapRate === null) {
        s.swapRate = 0.01;
        updated = true;
      }
      if (updated) {
        await s.save();
        console.log(`   - Updated ${s.symbol}`);
      }
    }

    // 2. Update Clients if needed (e.g. ensure tradingMetrics has defaults)
    const clients = await Client.find();
    console.log(`Checking ${clients.length} clients...`);
    for (const c of clients) {
       if (!c.tradingMetrics) {
         c.tradingMetrics = { balance: 10000, equity: 10000, freeMargin: 10000 };
         await c.save();
         console.log(`   - Reset metrics for ${c.name}`);
       }
    }

    console.log('🚀 Migration Completed Successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration Failed:', err);
    process.exit(1);
  }
}

migrate();
