import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';
import { ServerError, winstonLogger } from '@danieltalx/jobber-shared';
import { config } from '@chat/config';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'chatQueueConnection', 'debug');

async function createQueueConnection(): Promise<Channel> {
  let retryNum = 0;
  while (retryNum < 5) {
      const channel = await createQueueConnectionInner();
      if(channel) return channel;
      retryNum++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 seconds delay between retries
  }
  throw new ServerError(`${config.MS_NAME} createQueueConnection() method error: failed create connection`, config.MS_NAME);
}

// https://www.npmjs.com/package/amqplib
async function createQueueConnectionInner(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info(`${config.MS_NAME} connected to queue successfully...`);
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', `${config.MS_NAME} error createQueueConnectionInner() method:`, error);
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