import { winstonLogger } from '@danieltalx/jobber-shared';
import dotenv from 'dotenv';
import { Logger } from 'winston';


dotenv.config({});

class Config {
  public MS_NAME = process.env.MS_NAME || 'ReviewMS';
  public NODE_ENV = process.env.NODE_ENV || '';
  public SERVER_PORT = process.env.SERVER_PORT || ''; 
  public JWT_TOKEN = process.env.JWT_TOKEN || '';
  public GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
  public RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
  public MONGO_DATABASE_URL = process.env.MONGO_DATABASE_URL || '';
  public API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
  public ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
  public PG_DATABASE_HOST = process.env.PG_DATABASE_HOST || '';
  public PG_DATABASE_USER = process.env.PG_DATABASE_USER || '';
  public PG_DATABASE_PASSWORD = process.env.PG_DATABASE_PASSWORD || '';
  public PG_DATABASE_NAME = process.env.PG_DATABASE_NAME || '';
  public CLUSTER_TYPE = process.env.CLUSTER_TYPE || '';
  constructor() {}
}

export const config: Config = new Config();
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'ReviewConfig', 'debug');
log.info(`${config.MS_NAME} config = ${JSON.stringify(config)}`);