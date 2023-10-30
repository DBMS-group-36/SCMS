
import { connect, Mongoose } from "mongoose";
import mysql from 'mysql'
import logger from "../shared/logger";

const getDatabaseConnection = async () => {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    connection.connect(err => {
      if (err) {
        logger.error('Error connecting to MySQL: ' + err.stack);
        return;
      }
      logger.info('Connected to MySQL as id ' + connection.threadId);
    });

    return connection;
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

export default getDatabaseConnection;