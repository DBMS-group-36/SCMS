
import { Response, Request } from "express";
import getDatabaseConnection from "../databases/mysql";

export async function getAllDrivers(request: Request, response: Response) {

  const sql = 'SELECT * FROM driver_view';
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }

    response.json({ drivers: rows });
    connection.commit()
  });

}

export async function getAllDriverAssistants(request: Request, response: Response) {

  const sql = 'SELECT * FROM driver_assistant_view';
  const connection = await getDatabaseConnection();

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }

    response.json({ driverAssistants: rows });
    connection.commit()
  });

}



export default { getAllDrivers, getAllDriverAssistants }
