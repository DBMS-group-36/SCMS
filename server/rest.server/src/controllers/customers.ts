
import { Response, Request } from "express";
import getDatabaseConnection from "../databases/mysql";

export async function getAllEndCustomers(request: Request, response: Response) {

  const sql = 'SELECT * FROM end_customers_view';
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }

    response.json({ endcustomers: rows });
    connection.commit()
  });

}

export async function getAllRetailers(request: Request, response: Response) {

  const sql = 'SELECT * FROM retailers_view';
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }

    response.json({ retailers: rows });
    connection.commit()
  });

}

export async function getAllWholeSalers(request: Request, response: Response) {

  const sql = 'SELECT * FROM wholesalers_view';
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }

    response.json({ wholesalers: rows });
    connection.commit()
  });

}

export default { getAllEndCustomers, getAllRetailers, getAllWholeSalers }
