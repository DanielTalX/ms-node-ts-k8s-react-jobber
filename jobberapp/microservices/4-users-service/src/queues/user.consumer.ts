import { config } from '@users/config';
import { IBuyerDocument, ISellerDocument, winstonLogger } from '@danieltalx/jobber-shared';
import { Channel, ConsumeMessage, Replies } from 'amqplib';
import { Logger } from 'winston';
import { createBuyer, updateBuyerPurchasedGigsProp } from '@users/services/buyer.service';
import {
  getRandomSellers,
  updateSellerCancelledJobsProp,
  updateSellerCompletedJobsProp,
  updateSellerOngoingJobsProp,
  updateSellerReview,
  updateTotalGigsCount
} from '@users/services/seller.service';
import { publishDirectMessage } from '@users/queues/user.producer';
import { MsExchangeNames, MsQueueNames, MsRoutingKeys } from '@users/enums';

const log: Logger = winstonLogger(config.ELASTIC_SEARCH_URL, 'usersServiceConsumer', 'debug');

const consumeBuyerDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    const exchangeName = MsExchangeNames.JobberBuyerUpdate;
    const routingKey = MsRoutingKeys.UserBuyer;
    const queueName = MsQueueNames.UserBuyerQueue;
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      log.info(`${config.MS_NAME} consumeBuyerDirectMessage - received the following msg: ${msg?.content.toString()}`);
      const parsedMsg = JSON.parse(msg!.content.toString());
      if (parsedMsg.type === 'auth') {
        const { username, email, profilePicture, country, createdAt } = parsedMsg;
        const buyer: IBuyerDocument = {
          username,
          email,
          profilePicture,
          country,
          purchasedGigs: [],
          createdAt
        };
        await createBuyer(buyer);
      } else {
        const { buyerId, purchasedGigs } = parsedMsg;
        await updateBuyerPurchasedGigsProp(buyerId, purchasedGigs, parsedMsg.type);
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', `${config.MS_NAME} UserConsumer consumeBuyerDirectMessage() method error:`, error);
  }
};

const consumeSellerDirectMessage = async (channel: Channel): Promise<void> => {
  try {
    const exchangeName = MsExchangeNames.JobberSellerUpdate;
    const routingKey = MsRoutingKeys.UserSeller;
    const queueName = MsQueueNames.UserSellerQueue;
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      log.info(`${config.MS_NAME} consumeSellerDirectMessage - received the following msg: ${msg?.content.toString()}`);
      const parsedMsg = JSON.parse(msg!.content.toString());
      const { type, sellerId, ongoingJobs, completedJobs, totalEarnings, recentDelivery, gigSellerId, count } = parsedMsg;
      if (type === 'create-order') {
        await updateSellerOngoingJobsProp(sellerId, ongoingJobs);
      } 
      else if (type === 'approve-order') {
        await updateSellerCompletedJobsProp({
          sellerId,
          ongoingJobs,
          completedJobs,
          totalEarnings,
          recentDelivery
        });
      } 
      else if (type === 'update-gig-count') {
        await updateTotalGigsCount(`${gigSellerId}`, count);
      } 
      else if (type === 'cancel-order') {
        await updateSellerCancelledJobsProp(sellerId);
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', `${config.MS_NAME} UsersService UserConsumer consumeSellerDirectMessage() method error:`, error);
  }
};

const consumeReviewFanoutMessages = async (channel: Channel): Promise<void> => {
  try {
    const exchangeName = MsExchangeNames.JobberReview;
    const queueName = MsQueueNames.SellerReviewQueue;
    await channel.assertExchange(exchangeName, 'fanout');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, '');
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      log.info(`${config.MS_NAME} consumeReviewFanoutMessages - received the following msg: ${msg?.content.toString()}`);
      const parsedMsg = JSON.parse(msg!.content.toString());
      if (parsedMsg.type === 'buyer-review') {
        await updateSellerReview(JSON.parse(msg!.content.toString()));
        await publishDirectMessage(
          channel,
          MsExchangeNames.JobberUpdateGig,
          MsRoutingKeys.UpdateGig,
          JSON.stringify({ type: 'updateGig', gigReview: msg!.content.toString() }),
          'Message sent to gig service.'
        );
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', `${config.MS_NAME} UserConsumer consumeReviewFanoutMessages() method error:`, error);
  }
};

const consumeSeedGigDirectMessages = async (channel: Channel): Promise<void> => {
  try {
    const exchangeName = MsExchangeNames.JobberGig;
    const routingKey = MsRoutingKeys.GetSellers;
    const queueName = MsQueueNames.UserGigQueue;
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue: Replies.AssertQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      log.info(`${config.MS_NAME} consumeSeedGigDirectMessages - received the following msg: ${msg?.content.toString()}`);
      const parsedMsg = JSON.parse(msg!.content.toString());
      if (parsedMsg.type === 'getSellers') {
        const { count } = JSON.parse(msg!.content.toString());
        const sellers: ISellerDocument[] = await getRandomSellers(parseInt(count, 10));
        await publishDirectMessage(
          channel,
          MsExchangeNames.JobberSeedGig,
          MsRoutingKeys.ReceiveSellers,
          JSON.stringify({ type: 'receiveSellers', sellers, count }),
          'Message sent to gig service.'
        );
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', `${config.MS_NAME} UserConsumer consumeSeedGigDirectMessages() method error:`, error);
  }
};

export { consumeBuyerDirectMessage, consumeSellerDirectMessage, consumeReviewFanoutMessages, consumeSeedGigDirectMessages };