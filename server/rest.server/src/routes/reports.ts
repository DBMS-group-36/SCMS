
import { Router } from 'express';
import { body, oneOf, param, query, ValidationChain } from 'express-validator';
import { Middleware } from 'express-validator/src/base';
import ReportsController from '../controllers/reports'

const reportsRouter = Router({ mergeParams: true });

// Check Router
reportsRouter.get('/reports/quartelySales/:year', ReportsController.quartelySales);
reportsRouter.get('/reports/itemsInWarehouse', ReportsController.itemsInWarehouse);
reportsRouter.get('/reports/totalEmployees', ReportsController.totalEmployees);
reportsRouter.get('/reports/mostSoldProducts', ReportsController.mostSoldProducts);

export default reportsRouter;
