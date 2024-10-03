import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, ISellerGig, uploads } from '@danieltalx/jobber-shared';
import { getDocumentCount } from '@gig/elasticsearch';
import { gigCreateSchema } from '@gig/schemes/gig';
import { createGig } from '@gig/services/gig.service';
import { MsElasticIndexes } from '@gig/enums';
import { config } from '@gig/config';

const gigCreate = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(gigCreateSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'Create gig() method');
  }
  const uploadResult: UploadApiResponse = config.USE_CLOUDINARY ?
  await uploads(req.body.coverImage) as UploadApiResponse :
  { coverImage: req.body.coverImage, public_id: 'public_id_coverImage_test', secure_url: 'secure_url_coverImage_test' } as any;

  if (!uploadResult.public_id) {
    throw new BadRequestError('File upload error. Try again.', 'Create gig() method');
  }
  // todo: fix parallel error
  const count: number = await getDocumentCount(MsElasticIndexes.gigs);
  const gig: ISellerGig = {
    sellerId: req.body.sellerId,
    username: req.currentUser!.username,
    email: req.currentUser!.email,
    profilePicture: req.body.profilePicture,
    title: req.body.title,
    description: req.body.description,
    categories: req.body.categories,
    subCategories: req.body.subCategories,
    tags: req.body.tags,
    price: req.body.price,
    expectedDelivery: req.body.expectedDelivery,
    basicTitle: req.body.basicTitle,
    basicDescription: req.body.basicDescription,
    coverImage: `${uploadResult?.secure_url}`,
    sortId: count + 1
  };
  const createdGig: ISellerGig = await createGig(gig);
  res.status(StatusCodes.CREATED).json({ message: 'Gig created successfully.', gig: createdGig });
};

export { gigCreate };