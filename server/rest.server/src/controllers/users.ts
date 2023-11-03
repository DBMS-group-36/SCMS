
import { Response, Request } from "express";
import getDatabaseConnection from "../databases/mysql";

export async function login(request: Request, response: Response) {

  const sql = `call `;
  const connection = await getDatabaseConnection();

  connection.query(sql, [request.body.email], (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');

      return connection.commit()
    }
    if (!rows?.length || request.body.password !== 'demo') {
      response.json({ success: false });
    } else {
      response.json({ success: true });
    }

    connection.commit()
  });

}

export default { login }
