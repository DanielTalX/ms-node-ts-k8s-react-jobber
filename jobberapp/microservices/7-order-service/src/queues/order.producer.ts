import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { winstonLogger } from '@danieltalx/jobber-shared';
import { config } from '@order/config';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'orderServiceProducer', 'debug');

export const publishDirectMessage = async (
  channel: Channel,
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', `${config.MS_NAME} OrderServiceProducer publishDirectMessage() method:`, error);
  }
};