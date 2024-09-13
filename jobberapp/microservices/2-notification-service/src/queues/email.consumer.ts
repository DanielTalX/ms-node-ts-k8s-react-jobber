import { config } from '@notifications/config';
import { winstonLogger } from '@danieltalx/jobber-shared';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');

// channel.assertExchange(exchangeName, 'direct');
// channel.publish(exchangeName, routingKey, "the messsage");

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  try {
    const exchangeName = 'jobber-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';

    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      log.info(`consumeAuthEmailMessages - consume message: ${msg}`)
      const data = JSON.parse(msg!.content.toString());
      console.log("data = ", data);
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumeAuthEmailMessages() method error:', error);
  }
}

async function consumeOrderEmailMessages(channel: Channel): Promise<void> {
  try {
    const exchangeName = 'jobber-order-notification';
    const routingKey = 'order-email';
    const queueName = 'order-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      log.info(`consumeAuthEmailMessages - consume message: ${msg}`);
      const data = JSON.parse(msg!.content.toString());
      console.log("data = ", data);
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumeOrderEmailMessages() method error:', error);
  }
}

export { consumeAuthEmailMessages, consumeOrderEmailMessages };