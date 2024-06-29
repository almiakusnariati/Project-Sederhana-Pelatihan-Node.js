import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  database: "apotekk",
});


export default pool;