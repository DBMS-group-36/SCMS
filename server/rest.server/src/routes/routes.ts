
import { Router } from 'express';
import { body, oneOf, param, query, ValidationChain } from 'express-validator';
import { Middleware } from 'express-validator/src/base';
import RoutesController from '../controllers/routes'

const routesRouter = Router({ mergeParams: true });

// Check Router
routesRouter.get('/routes/', RoutesController.getAll);

export default routesRouter;
