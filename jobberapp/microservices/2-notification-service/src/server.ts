import 'express-async-errors';
import http from 'http';

import { IEmailMessageDetails, winstonLogger } from '@danieltalx/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createQueueConnection } from './queues/connection';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from './queues/email.consumer';
import { Channel } from 'amqplib';

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

  if(false) await testSendEmail(emailChannel);
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on ${config.MS_NAME} has started`);
    httpServer.listen(config.SERVER_PORT, () => {
      log.info(`${config.MS_NAME} running on port ${config.SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', `${config.MS_NAME} startServer() method:`, error);
  }
}

async function testSendEmail(emailChannel: Channel) {
  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=123234whqhqhehwhghe`;
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: config.SENDER_EMAIL,
    verifyLink: verificationLink,
    template: 'verifyEmail'
  };
  await emailChannel.assertExchange('jobber-email-notification', 'direct');
  const message = JSON. stringify(messageDetails);
  emailChannel.publish('jobber-email-notification', 'auth-email', Buffer. from(message));
}
