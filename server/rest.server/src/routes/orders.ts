
import { Router } from 'express';
import { body, oneOf, param, query, ValidationChain } from 'express-validator';
import { Middleware } from 'express-validator/src/base';
import OrdersController from '../controllers/orders'

const ordersRouter = Router({ mergeParams: true });

// Check Router
ordersRouter.get('/orders/', OrdersController.getAll);
ordersRouter.get('/orders/stillInWarehouse', OrdersController.getOrdersStillInWareHouse);
ordersRouter.get('/orders/onTrain', OrdersController.getOrdersOnTrain);
ordersRouter.get('/orders/atStore', OrdersController.getOrdersAtStore);
ordersRouter.get('/orders/delivering', OrdersController.getOrdersDelivering);
ordersRouter.get('/orders/delivered', OrdersController.getOrdersDelivered);
ordersRouter.get('/orders/cancelled', OrdersController.getOrdersCancelled);

ordersRouter.post('/orders/distributeOrdersByTrain', OrdersController.distributeOrdersByTrain);

export default ordersRouter;
