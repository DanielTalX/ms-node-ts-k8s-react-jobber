import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { winstonLogger } from '@danieltalx/jobber-shared';
import { config } from '@chat/config';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'chatServiceProducer', 'debug');

export async function publishDirectMessage(
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> {
  try {
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', `${config.MS_NAME} Provider publishDirectMessage() method error:`, error);
  }
}