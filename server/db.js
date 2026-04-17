// Unified DB adapter: PostgreSQL on Render (DATABASE_URL), MySQL locally
const isPG = !!process.env.DATABASE_URL;

let _pool;

function getPool() {
  if (_pool) return _pool;
  if (isPG) {
    const { Pool } = require("pg");
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  } else {
    const mysql = require("mysql2/promise");
    _pool = mysql.createPool({
      host:     process.env.DB_HOST     || "localhost",
      user:     process.env.DB_USER     || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME     || "student_tracker",
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return _pool;
}

// Normalised query: always returns plain array of row objects
async function query(sql, params = []) {
  const pool = getPool();
  if (isPG) {
    // Convert MySQL ? placeholders → PostgreSQL $1 $2 …
    let i = 0;
    const pgSql = sql.replace(/\?/g, () => `$${++i}`);
    const { rows } = await pool.query(pgSql, params);
    return rows;
  } else {
    const [rows] = await pool.query(sql, params);
    return rows;
  }
}

module.exports = { query, isPG };
