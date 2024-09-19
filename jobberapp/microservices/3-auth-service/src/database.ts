import { winstonLogger } from '@danieltalx/jobber-shared';
import { Logger } from 'winston';
import { config } from '@auth/config';
import { Sequelize } from 'sequelize';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authDatabaseServer', 'debug');

export const sequelize: Sequelize = new Sequelize(config.MYSQL_DB,  {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    multipleStatements: true
  }
});

export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    log.info(`${config.MS_NAME} Mysql database connection has been established successfully.`);
  } catch (error) {
    log.error(`${config.MS_NAME} - Unable to connect to database.`);
    log.log('error', '${config.MS_NAME} databaseConnection() method error:', error);
  }
}