import { Router } from 'express';
import { param } from 'express-validator';
import storesRouter from './stores';
import transportationTrainTripsRouter from './transportation_train_trips';
import productsRouter from './products';
import trucksRouter from './trucks';
import ordersRouter from './orders';
import customersRouter from './customers';
import employeesRouter from './employees';

const baseRouter = Router();

baseRouter.use(`/api/admin/`, storesRouter);
baseRouter.use(`/api/admin/`, transportationTrainTripsRouter);
baseRouter.use(`/api/admin/`, productsRouter);
baseRouter.use(`/api/admin/`, trucksRouter);
baseRouter.use(`/api/admin/`, customersRouter);
baseRouter.use(`/api/admin/`, ordersRouter);
baseRouter.use(`/api/admin/`, employeesRouter);

export default baseRouter;
