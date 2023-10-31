import { Router } from 'express';
import { param } from 'express-validator';
import storesRouter from './stores';
import transportationTrainTripsRouter from './transportation_train_trips';
import productsRouter from './products';

const baseRouter = Router();

baseRouter.use(`/api/admin/`, storesRouter);
baseRouter.use(`/api/admin/`, transportationTrainTripsRouter);
baseRouter.use(`/api/admin/`, productsRouter);

export default baseRouter;
