import { verifyGatewayRequest } from '@danieltalx/jobber-shared';
import { Application } from 'express';

const BASE_PATH = '/api/v1/message';

const appRoutes = (app: Application): void => {
  app.use('', () => console.log('healthRoutes'));
  app.use(BASE_PATH, verifyGatewayRequest,  () => console.log('chatRoutes'));
};

export { appRoutes };