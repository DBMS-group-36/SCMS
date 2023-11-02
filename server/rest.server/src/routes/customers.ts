
import { Router } from 'express';
import { body, oneOf, param, query, ValidationChain } from 'express-validator';
import { Middleware } from 'express-validator/src/base';
import CustomersController from '../controllers/customers'

const customersRouter = Router({ mergeParams: true });

// Check Router
customersRouter.get('/retailers/', CustomersController.getAllRetailers);
customersRouter.get('/endcustomers/', CustomersController.getAllEndCustomers);
customersRouter.get('/wholesalers/', CustomersController.getAllWholeSalers);

export default customersRouter;
