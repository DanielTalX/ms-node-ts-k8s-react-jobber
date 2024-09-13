import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public NODE_ENV = process.env.NODE_ENV || '';
  public SERVER_PORT = process.env.SERVER_PORT || ''; 
  public CLIENT_URL = process.env.CLIENT_URL || ''; 
  public SENDER_EMAIL = process.env.SENDER_EMAIL || ''; 
  public SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || ''; 
  public RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || ''; 
  public ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || ''; 
  public APP_ICON_URL = process.env.APP_ICON_URL || 'https://i.ibb.co/Kyp2m0t/cover.png';
  constructor() {}
}

export const config: Config = new Config();
