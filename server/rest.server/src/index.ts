
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import morgan from 'morgan';
import helmet from 'helmet';
import './env'
import BaseRouter from './routes';
import { StatusCodes } from 'http-status-codes';
import logger from './shared/logger';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

app.use('/', BaseRouter);

// Print API errors
const { INTERNAL_SERVER_ERROR } = StatusCodes;

app.use((err: Error, req: Request, res: Response) => {
  logger.error(err);

  return res.status(INTERNAL_SERVER_ERROR).json({
    status: 'failed',
    message: 'server error'
  });
});

// Handle 404 Errors
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: '404 Error!' });
});

// Start the API
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('API has been started on port: ' + port);
});
