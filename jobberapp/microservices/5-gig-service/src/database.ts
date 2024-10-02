import { winstonLogger } from '@danieltalx/jobber-shared';
import { Logger } from 'winston';
import { config } from '@gig/config';
import mongoose from 'mongoose';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigDatabaseServer', 'debug');

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${config.MONGO_DATABASE_URL}`);
    log.info(`${config.MS_NAME} successfully connected to mongo database.`);
  } catch (error) {
    log.log('error', `${config.MS_NAME} databaseConnection() method error:`, error);
  }
};

export { databaseConnection };