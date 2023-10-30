
import { Response, Request } from "express";
import getDatabaseConnection from "../databases/mysql";

export async function insert(request: Request, response: Response) {
  const { city, capacity } = request.body;
  const sql = 'INSERT INTO stores (city, capacity) VALUES (?, ?)';
  const connection = await getDatabaseConnection();

  connection.query(sql, [city, capacity], (err, result) => {
    if (err) {
      console.error('Error inserting into the database: ' + err.message);
      response.status(500).send('Error inserting data into the database');
      return;
    }
    response.status(201).json({ id: result.insertId });
  });

  connection.commit()
}

export async function getAll(request: Request, response: Response) {
  const storeId = request.params.id;
  const sql = 'SELECT * FROM stores WHERE id = ?';
  const connection = await getDatabaseConnection();
  connection.query(sql, [storeId], (err, rows) => {
    if (err) {
      console.error('Error querying the database: ' + err.message);
      response.status(500).send('Error querying the database');
      return;
    }

    if (rows.length === 0) {
      response.status(404).send('Store not found');
      return;
    }
    response.json(rows[0]);
  });

  connection.commit()
}


export async function update(request: Request, response: Response) {
  const storeId = request.params.id;
  const { city, capacity } = request.body;

  const sql = 'UPDATE stores SET city = ?, capacity = ? WHERE id = ?';
  const connection = await getDatabaseConnection();

  connection.query(sql, [city, capacity, storeId], (err, result) => {
    if (err) {
      console.error('Error updating the database: ' + err.message);
      response.status(500).send('Error updating data in the database');
      return;
    }

    if (result.affectedRows === 0) {
      response.status(404).send('Store not found');
      return;
    }
    response.sendStatus(204);
  });
}

export async function remove(request: Request, response: Response) {
  const storeId = request.params.id;
  const sql = 'DELETE FROM stores WHERE id = ?';

  const connection = await getDatabaseConnection();
  connection.query(sql, [storeId], (err, result) => {
    if (err) {
      console.error('Error deleting from the database: ' + err.message);
      response.status(500).send('Error deleting data from the database');
      return;
    }

    if (result.affectedRows === 0) {
      response.status(404).send('Store not found');
      return;
    }
    response.sendStatus(204);
  });
}

export default { insert, update, remove, getAll }
