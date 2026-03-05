const mongoose = require('mongoose');
const logger = require('../utils/logger');

async function connectDB(mongoUri) {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected');
  } catch (error) {
    logger.error('MongoDB connection failed', error);
    throw error;
  }
}

module.exports = connectDB;
