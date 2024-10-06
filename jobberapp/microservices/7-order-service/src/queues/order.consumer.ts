import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';
import { winstonLogger } from '@danieltalx/jobber-shared';
import { config } from '@order/config';
import { updateOrderReview } from '@order/services/order.service';
import { MsExchangeNames, MsQueueNames } from '@order/enums';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'orderServiceConsumer', 'debug');

export const consumerReviewFanoutMessages = async (channel: Channel): Promise<void> => {
  try {
    const exchangeName = MsExchangeNames.JobberReview;
    const queueName = MsQueueNames.OrderReviewQueue;
    await channel.assertExchange(exchangeName, 'fanout');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, '');
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      await updateOrderReview(JSON.parse(msg!.content.toString()));
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', `${config.MS_NAME} comsumer consumerReviewFanoutMessages() method:`, error);
  }
};