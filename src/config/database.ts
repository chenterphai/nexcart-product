import mongoose from 'mongoose';

import type { ConnectOptions } from 'mongoose';
import config from '.';
import { logger } from '@/libs/winston';

// Create CLient
const clientOptions: ConnectOptions = {
  dbName: 'espresso',
  appName: 'Espresso',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

// Establishes a connection to the MongoDB database using Mongoose.
export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGODB_URL) {
    throw new Error(`MongoDB URI is not defined in the configuration.`);
  }
  try {
    await mongoose.connect(config.MONGODB_URL, clientOptions);
    logger.info('Connected to Database.')
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from Database.')
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};