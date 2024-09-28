import express, { Express } from 'express';
import { start } from '@users/server';
import { databaseConnection } from '@users/database';
import { config } from '@users/config';

const initialize = (): void => {
  config.cloudinaryConfig();
  const app: Express = express();
  databaseConnection();
  start(app);
};

initialize();