import express, { Router } from 'express';
import { seller as createSeller } from '@users/controllers/seller/create';
import { id, random, username } from '@users/controllers/seller/get';
import { seller as updateSeller } from '@users/controllers/seller/update';
import { seed } from '@users/controllers/seller/seed';

const router: Router = express.Router();

const sellerRoutes = (): Router => {
  router.get('/id/:sellerId', id);
  router.get('/username/:username', username);
  router.get('/random/:size', random);
  router.post('/create', createSeller);
  router.put('/seed/:count', seed);
  router.put('/:sellerId', updateSeller);

  return router;
};

export { sellerRoutes };