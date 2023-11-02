
import { Response, Request } from "express";
import getDatabaseConnection from "../databases/mysql";

export async function getAll(request: Request, response: Response) {
  const sql = `SELECT * FROM orders`;
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }

    response.json({ orders: rows });
    connection.commit()
  });

}

export async function getOrdersStillInWareHouse(request: Request, response: Response) {
  const sql = `SELECT * FROM orders`;
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }

    response.json({ orders: rows });
    connection.commit()
  });
}

export async function getOrdersOnTrain(request: Request, response: Response) {
  const sql = `SELECT * FROM orders WHERE status = 'On Train'`;
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }

    response.json({ orders: rows });
    connection.commit()
  });
}

export async function getOrdersAtStore(request: Request, response: Response) {
  const sql = `SELECT * FROM orders WHERE status = 'At Store'`;
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }

    response.json({ orders: rows });
    connection.commit()
  });
}

export async function getOrdersDelivering(request: Request, response: Response) {
  const sql = `SELECT * FROM orders WHERE status = 'Delivery'`;
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }

    response.json({ orders: rows });
    connection.commit()
  });
}

export async function getOrdersDelivered(request: Request, response: Response) {
  const sql = `SELECT * FROM orders WHERE status = 'Delivered'`;
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }

    response.json({ orders: rows });
    connection.commit()
  });
}

export async function getOrdersCancelled(request: Request, response: Response) {
  const sql = `SELECT * FROM orders WHERE status = 'Cancelled'`;
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }

    response.json({ orders: rows });
    connection.commit()
  });
}

export default {
  getAll,
  getOrdersStillInWareHouse,
  getOrdersAtStore,
  getOrdersDelivered,
  getOrdersDelivering,
  getOrdersCancelled, 
  getOrdersOnTrain
}
