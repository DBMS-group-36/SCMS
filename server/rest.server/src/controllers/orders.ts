
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
  const sql = `SELECT * FROM orders_on_train WHERE StoreId = ?`;
  const connection = await getDatabaseConnection();

  connection.query(sql, [request.query.storeId], (err, rows) => {
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
  const sql = `SELECT * FROM orders WHERE Status = 'At Store' AND StoreId = ?`;
  const connection = await getDatabaseConnection();

  connection.query(sql, [request.query.storeId], (err, rows) => {
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
  const sql = `SELECT * FROM orders_delivering WHERE StoreId = ?`;
  const connection = await getDatabaseConnection();

  connection.query(sql, [request.query.storeId], (err, rows) => {
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
  const sql = `SELECT * FROM orders_delivered WHERE StoreId = ?`;
  const connection = await getDatabaseConnection();

  connection.query(sql, [request.query.storeId], (err, rows) => {
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
  const sql = `SELECT * FROM orders_cancelled`;
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

  const tripId = request.body.tripId

  request.body.orderDistributions?.forEach(distribution_to_stores => {
    const sql = `INSERT INTO distribution_to_stores(OrderId,StoreId,TripId) Values(?,?,?)`;

    connection.query(sql, [distribution_to_stores.orderId, distribution_to_stores.storeId, tripId], (err, rows) => {
      if (err) {
        console.error('Error executing the query: ' + err.message);
        response.status(500).send('Error querying the database');

        return connection.commit()
      }
    });

  });

  return response.json({ success: 'true' });

}

export async function unloadFromTrain(request: Request, response: Response) {
  const connection = await getDatabaseConnection();
  const sql = `UPDATE orders SET Status = 'At Store' WHERE Id = ?`;

  connection.query(sql, [request.params.id], (err, rows) => {
    if (err) {
      console.error('Error executing the query: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }
  });

  return response.json({ success: 'true' });

}

export async function setDeliveredToCustomer(request: Request, response: Response) {
  const connection = await getDatabaseConnection();
   const sql = `UPDATE orders SET Status = 'Delivered' WHERE Id = ?`;

    connection.query(sql,[request.params.id], (err, rows) => {
      if (err) {
        console.error('Error executing the query: ' + err.message);
        response.status(500).send('Error querying the database');

        return connection.commit()
      }
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
  distributeOrdersByTrain,
  unloadFromTrain,
  setDeliveredToCustomer
}
