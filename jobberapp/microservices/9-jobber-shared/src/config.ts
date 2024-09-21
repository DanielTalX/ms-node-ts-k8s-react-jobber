import dotenv from 'dotenv';
import { Logger } from 'winston';
import { winstonLogger } from './utils/logger';


dotenv.config({});

class Config {
  public MS_NAME = 'JobberShared';
  public NODE_ENV = process.env.NODE_ENV || '';
  public JWT_TOKEN = process.env.JWT_TOKEN || '';
  public GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
  public ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
  constructor() {}
}

export const config: Config = new Config();

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'JobberSharedConfig', 'debug');
log.info(`${config.MS_NAME} config = ${JSON.stringify(config)}`);