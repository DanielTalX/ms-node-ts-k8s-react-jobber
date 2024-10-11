import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { config } from '@review/config';
import { winstonLogger } from '@danieltalx/jobber-shared';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'reviewServiceProducer', 'debug');

export const publishFanoutMessage = async (
  channel: Channel,
  exchangeName: string,
  message: string,
  logMessage: string
): Promise<void> => {
  try {
    await channel.assertExchange(exchangeName, 'fanout');
    channel.publish(exchangeName, '', Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', `${config.MS_NAME} publishFanoutMessage() method:`, error);
  }
};