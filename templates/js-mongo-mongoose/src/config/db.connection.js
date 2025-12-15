import mongoose from 'mongoose';
import { config } from './index.js';
import { logger } from '../utils/logger.js';

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    });
    logger.info('✅ MongoDB connected successfully');
  } catch (error) {
    logger.logError('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
export default connectDB;
