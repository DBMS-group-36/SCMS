
import { connect, Mongoose } from "mongoose";
import mysql from 'mysql'
import logger from "../shared/logger";

let connection = null;

const getDatabaseConnection = async () => {
  try {
    if(connection != null) return connection;
    connection = mysql.createConnection({
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

// Close the MySQL connection when the server shuts down
process.on('SIGINT', () => {
  connection.end((err) => {
    if (err) {
      console.error('Error closing MySQL connection: ' + err.message);
    } else {
      console.log('MySQL connection closed.');
    }
    process.exit();
  });
});


export default getDatabaseConnection;