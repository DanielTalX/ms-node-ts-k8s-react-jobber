import { Application } from 'express';
import { verifyGatewayRequest } from '@danieltalx/jobber-shared';

const BASE_PATH = '/api/v1/review';

const appRoutes = (app: Application): void => {
  app.use('', () => console.log('healthRoutes'));
  app.use(BASE_PATH, verifyGatewayRequest, () => console.log('reviewRoutes'));
};

export { appRoutes };