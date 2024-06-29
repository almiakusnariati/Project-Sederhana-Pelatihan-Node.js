
import jwt from "jsonwebtoken";
import pool from "../database.js";

export async function addUser(req, res) {
  try {
    const rows = await pool.query(
      `INSERT INTO akun VALUES (NULL, '${req.body.username}', '${req.body.password}')`
    );

    if (rows.length > 0) {
      if (req.body.username === rows[0].username) {
        res.send("Nama Pengguna sudah ada, coba nama lain");
      }
    } else {
      res.send("Pengguna telah ditambahkan.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
