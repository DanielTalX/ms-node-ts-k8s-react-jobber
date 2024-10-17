import express, { Router } from 'express';
import { authMiddleware } from '@gateway/services/auth-middleware';
import { Get } from '@gateway/controllers/review/get';
import { Create } from '@gateway/controllers/review/create';

class ReviewRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/review/gig/:gigId', authMiddleware.checkAuthentication, Get.prototype.reviewsByGigId);
    this.router.get('/review/seller/:sellerId', authMiddleware.checkAuthentication, Get.prototype.reviewsBySellerId);
    this.router.post('/review', authMiddleware.checkAuthentication, Create.prototype.review);
    return this.router;
  }
}

export const reviewRoutes: ReviewRoutes = new ReviewRoutes();