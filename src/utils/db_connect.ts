import mongoose from 'mongoose';
import logger from './logger';
import { mongoose as config } from '../../config/default.config';

export default async () => {
  try {
    const connection = await mongoose.connect(config.url);
    logger.info('DB connected');
    return connection;
  } catch (error) {
    logger.error('Could not connect to db');
    process.exit(1);
  }
};
