
import { Router } from 'express';
import { body, oneOf, param, query, ValidationChain } from 'express-validator';
import { Middleware } from 'express-validator/src/base';
import StoresController from '../controllers/stores'

const storesRouter = Router({ mergeParams: true });

const validateCreateData: Array<ValidationChain | Middleware> = [
    body('capacity').isNumeric(),
    body('city').notEmpty(),
]

const validateUpdateData: Array<ValidationChain | Middleware> = [
    param('id').notEmpty(),    
    body('capacity').isNumeric(),
    body('city').notEmpty(),
];


// Check Router
storesRouter.get('/stores/', StoresController.getAll);
storesRouter.post('/stores/', validateCreateData, StoresController.insert);
storesRouter.put('/stores/:id', validateUpdateData, StoresController.update);
storesRouter.delete('/stores/:id', param('id').notEmpty(), StoresController.remove)

export default storesRouter;
