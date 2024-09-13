import 'express-async-errors';
import http from 'http';

import { winstonLogger } from '@danieltalx/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createQueueConnection } from './queues/connection';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from './queues/email.consumer';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export async function start(app: Application): Promise<void> {
  // http://localhost:4001/notificaiton-roues - only for healthRoutes
  // http://localhost:4001/api/v1/gateway/notificaiton-roues - all the others from gateway
  startServer(app);
  app.use('', healthRoutes());
  startElasticSearch();
  await startQueues();
}

async function startQueues(): Promise<void> {
  const emailChannel = await createQueueConnection();
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    httpServer.listen(config.SERVER_PORT, () => {
      log.info(`Notification server running on port ${config.SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}
