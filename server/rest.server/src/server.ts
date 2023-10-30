
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import 'express-async-errors';

import BaseRouter from './routes';
import logger from '@shared/logger';
import connectDatabase from './databases/mongodb';
import { StatusCodes } from 'http-status-codes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
const DB = connectDatabase();
logger.info('MongoDB connection established for API');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

app.use('/', BaseRouter);

// Print API errors
const { INTERNAL_SERVER_ERROR } = StatusCodes;

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  return res.status(INTERNAL_SERVER_ERROR).json({
    status: 'failed',
    message: 'server error'
  });
});

// Handle 404 Errors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: '404 Error!' });
});

export default app;
