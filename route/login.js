
import jwt from "jsonwebtoken";
import conn from "../database.js";


export async function login(req, res) {
  const connection = await conn.getConnection();
  try {
    const result = await connection.query(
      "SELECT * FROM akun WHERE username = ? AND password = ?",
      [req.body.username, req.body.password]
    );
    if (result.length > 0) {
      console.log("masuk");
      const token = jwt.sign(result[0], 'process.env.SECRET_KEY');
      res.cookie("token", token);
      console.log(token);
      res.status(200).json({ message: "Login berhasil." });
    } else {
      res.status(401).send("Login gagal");
    }
  } finally {
    connection.release();
  }
}
