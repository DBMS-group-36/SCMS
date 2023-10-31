
import { Router } from 'express';
import { body, oneOf, param, query, ValidationChain } from 'express-validator';
import { Middleware } from 'express-validator/src/base';
import TrucksController from '../controllers/trucks'

const trucksRouter = Router({ mergeParams: true });

// Check Router
trucksRouter.get('/trucks/', TrucksController.getAll);

export default trucksRouter;
