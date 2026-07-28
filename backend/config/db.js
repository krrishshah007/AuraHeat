const mongoose = require('mongoose');

let isConnectedToMongo = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000 // Fast failover to mock store if MongoDB isn't running locally
    });
    isConnectedToMongo = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Warning (${error.message}).`);
    console.log(`⚡ AurHeat Backend running in Resilient In-Memory Mode. Data operations will function seamlessly.`);
    isConnectedToMongo = false;
  }
};

const getIsConnected = () => isConnectedToMongo;

module.exports = { connectDB, getIsConnected };
