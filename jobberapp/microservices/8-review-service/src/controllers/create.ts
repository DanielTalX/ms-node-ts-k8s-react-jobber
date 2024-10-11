import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IReviewDocument } from '@danieltalx/jobber-shared';
import { addReview } from '@review/services/review.service';

export const review = async (req: Request, res: Response): Promise<void> => {
  const review: IReviewDocument = await addReview(req.body);
  res.status(StatusCodes.CREATED).json({ message: 'Review created successfully.', review });
};