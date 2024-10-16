import { winstonLogger } from '@danieltalx/jobber-shared';
import dotenv from 'dotenv';
import { Logger } from 'winston';

dotenv.config({});

if (process.env.ENABLE_APM === '1') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('elastic-apm-node').start({
    serviceName: 'jobber-notification',
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
  public MS_NAME = process.env.MS_NAME || 'NotificationMS';
  public NODE_ENV = process.env.NODE_ENV || '';
  public SERVER_PORT = process.env.SERVER_PORT || ''; 
  public CLIENT_URL = process.env.CLIENT_URL || ''; 

  public RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || ''; 
  public ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || ''; 
  
  public SMTP_HOST = process.env.SMTP_HOST || '';
  public SMTP_PORT = Number(process.env.SMTP_PORT || 587);
  public SENDER_EMAIL = process.env.SENDER_EMAIL || '';
  public SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || ''; 
  
  public APP_ICON_URL = process.env.APP_ICON_URL || 'https://i.ibb.co/Kyp2m0t/cover.png';
  constructor() {}
}

export const config: Config = new Config();

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationConfig', 'debug');
log.info(`${config.MS_NAME} config = ${JSON.stringify(config)}`);