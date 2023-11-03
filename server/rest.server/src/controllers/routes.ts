
import { Response, Request } from "express";
import getDatabaseConnection from "../databases/mysql";

export async function getAll(request: Request, response: Response) {

  const sql = 'SELECT r.*, s.City As StoreCity FROM routes r LEFT OUTER JOIN stores s ON s.Id = r.StoreId';
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }

    response.json({ routes: rows });
    connection.commit()
  });

}

export default {getAll}
