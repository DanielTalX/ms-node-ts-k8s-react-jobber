import http from 'http';

import 'express-async-errors';
import { CustomError, IAuthPayload, IErrorResponse, winstonLogger } from '@danieltalx/jobber-shared';
import { Logger } from 'winston';
import { config } from '@gig/config';
import { Application, Request, Response, NextFunction, json, urlencoded } from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { checkConnection, createIndex } from '@gig/elasticsearch';
import { appRoutes } from '@gig/routes';
import { Channel } from 'amqplib';
import { MsElasticIndexes } from '@gig/enums';
import { createQueueConnection } from '@gig/queues/connection';
import { consumeGigDirectMessage, consumeSeedDirectMessages } from '@gig/queues/gig.consumer';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigServer', 'debug');

export let gigChannel: Channel;

export function start(app: Application): void {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  gigErrorHandler(app);
  startServer(app);
}

function securityMiddleware(app: Application): void {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: config.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const payload: IAuthPayload = verify(token, config.JWT_TOKEN!) as IAuthPayload;
      req.currentUser = payload;
    }
    next();
  });
}

function standardMiddleware(app: Application): void {
  app.use(compression());
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ extended: true, limit: '200mb' }));
}

function routesMiddleware(app: Application): void {
  appRoutes(app);
}

async function startQueues(): Promise<void> {
  gigChannel = await createQueueConnection() as Channel;
  await consumeGigDirectMessage(gigChannel);
  await consumeSeedDirectMessages(gigChannel);
}

function startElasticSearch(): void {
  checkConnection();
  createIndex(MsElasticIndexes.gigs)
}

function gigErrorHandler(app: Application): void {
  app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    log.log('error', `${config.MS_NAME} ${error.comingFrom}:`, error);
    if (error instanceof CustomError) {
      res.status(error.statusCode).json(error.serializeErrors());
    }
    next();
  });
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`${config.MS_NAME} has started with process id ${process.pid}`);
    httpServer.listen(config.SERVER_PORT, () => {
      log.info(`${config.MS_NAME} running on port ${config.SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', `${config.MS_NAME} startServer() method error:`, error);
  }
}