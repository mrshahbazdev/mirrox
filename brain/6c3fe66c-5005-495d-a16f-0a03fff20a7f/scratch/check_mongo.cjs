const mongoose = require('mongoose');
require('dotenv').config();

async function checkMongo() {
  try {
    console.log('Connecting to:', process.env.MONGO_URI.split('@').pop()); // Hide credentials
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('\nCollections found:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} documents`);
    }

    if (collections.length === 0) {
      console.log('\n❌ No collections found in the "mirrox" database.');
    } else {
      console.log('\nSample data from "clients":');
      const clients = await db.collection('clients').find().limit(2).toArray();
      console.log(JSON.stringify(clients, null, 2));
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error checking MongoDB:', err.message);
  }
}

checkMongo();
