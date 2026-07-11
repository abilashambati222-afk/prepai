const mongoose = require('mongoose');

/**
 * MongoDB Configuration Object for PrepAI
 */
const dbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/prepai',
  options: {
    autoIndex: true, // Build indexes in development
    serverSelectionTimeoutMS: 5000, // Timeout after 5s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    family: 4 // Force IPv4
  }
};

/**
 * MongoDB Mongoose Connection Handler
 */
const connectDatabase = async () => {
  try {
    await mongoose.connect(dbConfig.uri, dbConfig.options);
    console.log('[MDB] Connection established successfully to host:', dbConfig.uri);
  } catch (err) {
    console.error('[MDB] Connection failed! Error details:', err.message);
    // Don't kill the process in development to allow other parts of development checking,
    // but log it prominently.
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = {
  dbConfig,
  connectDatabase
};
