
import { Router } from 'express';
import { body, oneOf, param, query, ValidationChain } from 'express-validator';
import { Middleware } from 'express-validator/src/base';
import EmployeesController from '../controllers/employees'

const employeesRouter = Router({ mergeParams: true });

// Check Router
employeesRouter.get('/drivers/', EmployeesController.getAllDrivers);
employeesRouter.get('/driverAssistants/', EmployeesController.getAllDriverAssistants);

export default employeesRouter;
