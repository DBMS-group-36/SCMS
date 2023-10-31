
import { Response, Request } from "express";
import getDatabaseConnection from "../databases/mysql";

export async function getAll(request: Request, response: Response) {

  const sql = `SELECT t.Id, t.Capacity, t.StoreId, s.City as 'StoreCity' FROM trucks t LEFT OUTER JOIN stores s on t.StoreId = s.Id`;
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }

    response.json({ trucks: rows });
    connection.commit()
  });

}

export default {getAll}
