import express, { Express } from 'express';
import { start } from '@gig/server';
import { databaseConnection } from '@gig/database';
import { config } from '@gig/config';

const initialize = (): void => {
  config.cloudinaryConfig();
  const app: Express = express();
  databaseConnection();
  start(app);
};

initialize();