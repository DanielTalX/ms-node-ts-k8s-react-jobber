import express, { Express } from 'express';
import { start } from '@order/server';
import { databaseConnection } from '@order/database';
import { config } from '@order/config';

const initialize = (): void => {
  config.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
};

initialize();