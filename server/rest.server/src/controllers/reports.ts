
import { Response, Request } from "express";
import getDatabaseConnection from "../databases/mysql";

export async function quartelySales(request: Request, response: Response) {

  const sql = `call get_quarterly_sales_report(?)`;
  const connection = await getDatabaseConnection();

  connection.query(sql, [request.params.year || 2023], (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }
    response.json({ report: rows })
    connection.commit()
  });

}

export async function itemsInWarehouse(request: Request, response: Response) {

  const sql = `SELECT Count(Id) AS Count FROM orders WHERE Status = 'Order Placed'`;
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }
    response.json({ data: rows })
    connection.commit()
  });

}

export async function totalEmployees(request: Request, response: Response) {

  const sql = `SELECT Count(UserId) AS Count FROM employees`;
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }
    response.json({ data: rows })
    connection.commit()
  });

}

export async function mostSoldProducts(request: Request, response: Response) {

  const sql = `call scms_database.get_products_sold_report();`;
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }
    response.json({ data: rows })
    connection.commit()
  });

}

export default { quartelySales, itemsInWarehouse, totalEmployees, mostSoldProducts }
