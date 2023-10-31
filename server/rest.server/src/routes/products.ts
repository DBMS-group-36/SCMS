
import { Router } from 'express';
import { body, oneOf, param, query, ValidationChain } from 'express-validator';
import { Middleware } from 'express-validator/src/base';
import ProductsController from '../controllers/products'

const productsRouter = Router({ mergeParams: true });

// Check Router
productsRouter.get('/products/', ProductsController.getAll);

export default productsRouter;
