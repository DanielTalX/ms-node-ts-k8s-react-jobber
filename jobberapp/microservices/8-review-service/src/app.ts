import express, { Express } from 'express';
import { start } from '@review/server';
import { databaseConnection } from '@review/database';

const initialize = (): void => {
  databaseConnection();
  const app: Express = express();
  start(app);
};

initialize();