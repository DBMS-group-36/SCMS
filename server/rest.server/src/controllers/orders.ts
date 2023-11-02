
import { Response, Request } from "express";
import getDatabaseConnection from "../databases/mysql";

export async function getAll(request: Request, response: Response) {
  const sql = `SELECT * FROM orders ORDER BY Id desc`;
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
  const sql = `SELECT * FROM orders_in_warehouse ORDER BY Id desc`;
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

export async function distributeOrdersByTrain(request: Request, response: Response) {
  const connection = await getDatabaseConnection();

  const tripId = request.body.trainTripId

  request.body.orderDistributions?.forEach(distribution_to_stores => {
    const sql = `INSERT INTO distribution_to_stores(OrderId,StoreId,TripId) Values(?,?,?)`;
    const sql2 = `UPDATE orders SET status = 'On Train' WHERE Id = ?`;
    
    connection.query(sql,[distribution_to_stores.orderId, distribution_to_stores.storeId, tripId], (err, rows) => {
      if (err) {
        console.error('Error executing the database: ' + err.message);
        response.status(500).send('Error querying the database');

        return connection.commit()
      }

    });

    connection.query(sql2,[distribution_to_stores.orderId]);

    connection.commit()
  });

  return response.json({ success: 'true' });

}

export default {
  getAll,
  getOrdersStillInWareHouse,
  getOrdersAtStore,
  getOrdersDelivered,
  getOrdersDelivering,
  getOrdersCancelled,
  getOrdersOnTrain,
  distributeOrdersByTrain
}
