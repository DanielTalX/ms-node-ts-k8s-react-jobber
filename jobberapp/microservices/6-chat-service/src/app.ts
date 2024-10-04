import express, { Express } from 'express';
import { start } from '@chat/server';
import { databaseConnection } from '@chat/database';
import { config } from '@chat/config';

const initialize = (): void => {
  config.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
};

initialize();