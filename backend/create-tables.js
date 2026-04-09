const mongoose = require('mongoose');
const Client = require('./models/Client');
const Symbol = require('./models/Symbol');
const Trade = require('./models/Trade');
const Transaction = require('./models/Transaction');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createTables() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected successfully!');

    console.log("⏳ Creating database tables (collections) if they don't exist...");
    
    // Explicitly create collections even if empty (Mongoose feature)
    await Client.createCollection();
    console.log('✔️ Client table created.');
    
    await Symbol.createCollection();
    console.log('✔️ Symbol table created.');
    
    await Trade.createCollection();
    console.log('✔️ Trade table created.');
    
    await Transaction.createCollection();
    console.log('✔️ Transaction table created.');

    await Admin.createCollection();
    console.log('✔️ Admin table created.');

    const aCount = await Admin.countDocuments();
    if (aCount === 0) {
      console.log('⏳ Seeding default Admin user...');
      const hashedPassword = await bcrypt.hash('admin', 10);
      await Admin.create({ email: 'admin@mirrox.com', password: hashedPassword, name: 'Super Admin', role: 'admin' });
      console.log('✔️ Admin user seeded successfully.');
    }

    console.log('🚀 All tables created successfully in MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    process.exit(1);
  }
}

createTables();
