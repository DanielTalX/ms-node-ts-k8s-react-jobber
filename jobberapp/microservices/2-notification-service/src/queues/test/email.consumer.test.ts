import * as connection from '@notifications/queues/connection';
import amqp from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';
import { ExchangeNames, QueueNames, RoutingKeys } from '@notifications/enums';

jest.mock('@notifications/queues/connection');
jest.mock('amqplib');
jest.mock('@danieltalx/jobber-shared');

describe('Email Consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consumeAuthEmailMessages method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: QueueNames.AuthEmailQueue, messageCount: 0, consumerCount: 0});
      jest.spyOn(connection, 'createQueueConnection').mockReturnValue(channel as never);
      const connectionChannel: amqp.Channel | undefined = await connection.createQueueConnection();
      await consumeAuthEmailMessages(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith(ExchangeNames.JobberEmailNotification, 'direct');
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith(QueueNames.AuthEmailQueue, ExchangeNames.JobberEmailNotification, RoutingKeys.AuthEmail);
    });
  });

  describe('consumeOrderEmailMessages method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: QueueNames.OrderEmailQueue, messageCount: 0, consumerCount: 0});
      jest.spyOn(connection, 'createQueueConnection').mockReturnValue(channel as never);
      const connectionChannel: amqp.Channel | undefined = await connection.createQueueConnection();
      await consumeOrderEmailMessages(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith(ExchangeNames.JobberOrderNotification, 'direct');
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith(QueueNames.OrderEmailQueue, ExchangeNames.JobberOrderNotification, RoutingKeys.OrderEmail);
    });
  });
});