import { config } from '@notifications/config';
import { ServerError, winstonLogger } from '@danieltalx/jobber-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationQueueConnection', 'debug');

async function createQueueConnection(): Promise<Channel> {
  let retryNum = 0;
  while (retryNum < 5) {
      const channel = await createQueueConnectionInner();
      if(channel) return channel;
      retryNum++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 seconds delay between retries
  }
  throw new ServerError("NotificationService createQueueConnection() method error: failed create connection", "NotificationService");
}

// https://www.npmjs.com/package/amqplib
async function createQueueConnectionInner(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Notification server connected to queue successfully...');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'NotificationService error createQueueConnectionInner() method:', error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { createQueueConnection } ;