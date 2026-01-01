import mongoose from 'mongoose';
import { config } from './index.ts';
import { logger } from '../utils/logger.ts';

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
    } as mongoose.ConnectOptions);
    logger.info('✅ MongoDB connected successfully');
  } catch (error: any) {
    logger.logError('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
}
export default connectDB;
