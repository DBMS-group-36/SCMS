import { Router } from 'express';
import { param } from 'express-validator';
import storesRouter from './stores';

const baseRouter = Router();

baseRouter.use(`/api/admin/`, storesRouter);

export default baseRouter;
