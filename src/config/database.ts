import mongoose from 'mongoose';
import logger from '@/utils/logger';
import { config } from './config';

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(config.mongoURI);
        logger.info('MongoDB Connected...');
    } catch (err) {
        logger.error('MongoDB connection error:', err);
        process.exit(1);
    }
};
