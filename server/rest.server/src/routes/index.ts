import { Router } from 'express';
import { param } from 'express-validator';
import checksRouter from './checks';

const baseRouter = Router();

baseRouter.use(`/:account_name/`, param('account_name').notEmpty(), checksRouter);

export default baseRouter;
