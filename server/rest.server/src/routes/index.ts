import { Router } from 'express';
import { param } from 'express-validator';
import storesRouter from './stores';
import transportationTrainTripsRouter from './transportation_train_trips';
import productsRouter from './products';
import trucksRouter from './trucks';
import customersRouter from './customers';

const baseRouter = Router();

baseRouter.use(`/api/admin/`, storesRouter);
baseRouter.use(`/api/admin/`, transportationTrainTripsRouter);
baseRouter.use(`/api/admin/`, productsRouter);
baseRouter.use(`/api/admin/`, trucksRouter);
baseRouter.use(`/api/admin/`, customersRouter);

export default baseRouter;
