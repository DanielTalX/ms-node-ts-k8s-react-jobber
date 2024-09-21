import { config } from '@auth/config';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function health(_req: Request, res: Response): void {
  res.status(StatusCodes.OK).send(`${config.MS_NAME} is healthy and OK.`);
}
