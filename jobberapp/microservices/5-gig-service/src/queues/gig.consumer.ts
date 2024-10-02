import { config } from '@gig/config';
import { winstonLogger } from '@danieltalx/jobber-shared';
import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';
import { seedData, updateGigReview } from '@gig/services/gig.service';
import { MsExchangeNames, MsQueueNames, MsRoutingKeys } from '@gig/enums';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigServiceConsumer', 'debug');

const consumeGigDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    const exchangeName = MsExchangeNames.JobberUpdateGig;
    const routingKey = MsRoutingKeys.UpdateGig;
    const queueName = MsQueueNames.GigUpdateQueue;
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { gigReview } = JSON.parse(msg!.content.toString());
      await updateGigReview(JSON.parse(gigReview));
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', `${config.MS_NAME} GigConsumer consumeGigDirectMessage() method error:`, error);
  }
};

const consumeSeedDirectMessages = async (channel: Channel): Promise<void> => {
  try {
    const exchangeName = MsExchangeNames.JobberSeedGig;
    const routingKey = MsRoutingKeys.ReceiveSellers;
    const queueName = MsQueueNames.SeedGigQueue;
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const { sellers, count } = JSON.parse(msg!.content.toString());
      await seedData(sellers, count);
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', `${config.MS_NAME} GigConsumer consumeSeedDirectMessages() method error:`, error);
  }
};

export { consumeGigDirectMessage, consumeSeedDirectMessages };