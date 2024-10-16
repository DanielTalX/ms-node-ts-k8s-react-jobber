import { winstonLogger } from '@danieltalx/jobber-shared';
import dotenv from 'dotenv';
import { Logger } from 'winston';
import cloudinary from 'cloudinary';


dotenv.config({});

if (process.env.ENABLE_APM === '1') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('elastic-apm-node').start({
    serviceName: 'jobber-order',
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
  public MS_NAME = process.env.MS_NAME || 'OrderMS';
  public NODE_ENV = process.env.NODE_ENV || '';
  public SERVER_PORT = process.env.SERVER_PORT || ''; 
  public JWT_TOKEN = process.env.JWT_TOKEN || '';
  public GATEWAY_JWT_TOKEN = process.env.GATEWAY_JWT_TOKEN || '';
  public RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || '';
  public MONGO_DATABASE_URL = process.env.MONGO_DATABASE_URL || '';
  public CLOUD_NAME = process.env.CLOUD_NAME || '';
  public CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
  public CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
  public USE_CLOUDINARY = process.env.USE_CLOUDINARY !== 'false';
  public STRIPE_API_KEY = process.env.STRIPE_API_KEY || '';
  public CLIENT_URL = process.env.CLIENT_URL || '';
  public API_GATEWAY_URL = process.env.API_GATEWAY_URL || '';
  public ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || '';
  constructor() {}

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET
    });
  }
}

export const config: Config = new Config();
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'OrderConfig', 'debug');
log.info(`${config.MS_NAME} config = ${JSON.stringify(config)}`);