
import { Router } from 'express';
import { body, oneOf, param, query, ValidationChain } from 'express-validator';
import { Middleware } from 'express-validator/src/base';
import TransportationTrainTripsController from '../controllers/transportation_train_trips'

const transportationTrainTripsRouter = Router({ mergeParams: true });

// Check Router
transportationTrainTripsRouter.get('/transportation_train_trips/', TransportationTrainTripsController.getAll);

export default transportationTrainTripsRouter;
