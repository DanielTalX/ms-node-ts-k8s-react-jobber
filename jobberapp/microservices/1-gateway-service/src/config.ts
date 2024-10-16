import { winstonLogger } from '@danieltalx/jobber-shared';
import dotenv from 'dotenv';
import { Logger } from 'winston';

dotenv.config({});

if (process.env.ENABLE_APM === '1') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('elastic-apm-node').start({
      serviceName: 'jobber-gateway',
      serverUrl: process.env.ELASTIC_APM_SERVER_URL,
      secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
      environment: process.env.NODE_ENV,
      active: true,
      captureBody: 'all',
      errorOnAbortedRequests: true,
      captureErrorLogStackTraces: 'always'
    });
  }

class Config {
    MS_NAME = process.env.MS_NAME || 'GatewayMS';
    SERVER_PORT = process.env.SERVER_PORT || 4000;
    JWT_TOKEN = process.env.JWT_TOKEN || '';
    GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
    NODE_ENV = process.env.NODE_ENV || '';
    SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
    SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
    CLIENT_URL = process.env.CLIENT_URL || '';
    AUTH_BASE_URL = process.env.AUTH_BASE_URL || '';
    USERS_BASE_URL = process.env.USERS_BASE_URL || '';
    GIG_BASE_URL = process.env.GIG_BASE_URL || '';
    MESSAGE_BASE_URL = process.env.MESSAGE_BASE_URL || '';
    ORDER_BASE_URL = process.env.ORDER_BASE_URL || '';
    REVIEW_BASE_URL = process.env.REVIEW_BASE_URL || '';
    REDIS_HOST = process.env.REDIS_HOST || '';
    ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
    constructor() {}
}

export const config: Config = new Config();

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'GatewayMSConfig', 'debug');
log.info(`${config.MS_NAME} config = ${JSON.stringify(config)}`);