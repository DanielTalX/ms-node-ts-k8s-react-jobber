import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IOrderNotifcation } from '@danieltalx/jobber-shared';
import { markNotificationAsRead } from '@order/services/notification.service';

const markSingleNotificationAsRead = async (req: Request, res: Response): Promise<void> => {
  const { notificationId } = req.body;
  const notification: IOrderNotifcation = await markNotificationAsRead(notificationId);
  res.status(StatusCodes.OK).json({ message: 'Notification updated successfully.', notification });
};

export { markSingleNotificationAsRead };