
import { Router } from 'express';
import { body, oneOf, param, query, ValidationChain } from 'express-validator';
import { Middleware } from 'express-validator/src/base';
import UsersController from '../controllers/users'

const usersRouter = Router({ mergeParams: true });

// Check Router
usersRouter.post('/auth/users/login', UsersController.login);

export default usersRouter;
