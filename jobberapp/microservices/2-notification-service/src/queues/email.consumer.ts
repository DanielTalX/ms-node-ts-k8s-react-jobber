import { config } from '@notifications/config';
import { IEmailLocals, winstonLogger } from '@danieltalx/jobber-shared';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { sendEmail } from './mail.transport';
import { EmailTypes, ExchangeNames, QueueNames, RoutingKeys } from '../enums';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');

// channel.assertExchange(exchangeName, 'direct');
// channel.publish(exchangeName, routingKey, "the messsage");

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  try {
    const exchangeName = ExchangeNames.JobberEmailNotification;
    const routingKey = RoutingKeys.AuthEmail;
    const queueName = QueueNames.AuthEmailQueue;

    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      log.info(`${config.MS_NAME} consumeAuthEmailMessages - consume message: ${msg!.content.toString()}`);
      const data = JSON.parse(msg!.content.toString());
      const { receiverEmail, username, verifyLink, resetLink, template } = data;
      const locals: IEmailLocals = {
        appLink: config.CLIENT_URL,
        appIcon: config.APP_ICON_URL,
        username,
        verifyLink,
        resetLink,
      };
      await sendEmail(template, receiverEmail, locals);
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', `${config.MS_NAME} EmailConsumer consumeAuthEmailMessages() method error:`, error);
  }
}

async function consumeOrderEmailMessages(channel: Channel): Promise<void> {
  try {
    const exchangeName = ExchangeNames.JobberOrderNotification;
    const routingKey = RoutingKeys.OrderEmail;
    const queueName = QueueNames.OrderEmailQueue;
    await channel.assertExchange(exchangeName, 'direct');
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      log.info(`${config.MS_NAME} consumeOrderEmailMessages - consume message: ${msg!.content.toString()}`);
      const data = JSON.parse(msg!.content.toString());
      const {
        receiverEmail,
        username,
        template,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      } = data
      const locals: IEmailLocals = {
        appLink: config.CLIENT_URL,
        appIcon: config.APP_ICON_URL,
        username,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      };
      if (template === EmailTypes.orderPlaced) {
        await sendEmail(EmailTypes.orderPlaced, receiverEmail, locals);
        await sendEmail(EmailTypes.orderReceipt, receiverEmail, locals);
      } else {
        await sendEmail(template, receiverEmail, locals);
      }
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', `${config.MS_NAME} EmailConsumer consumeOrderEmailMessages() method error:`, error);
  }
}

export { consumeAuthEmailMessages, consumeOrderEmailMessages };