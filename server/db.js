// Unified DB adapter: PostgreSQL on Render (DATABASE_URL), MySQL locally
const isPG = !!process.env.DATABASE_URL;

let _pool;

function getPool() {
  if (_pool) return _pool;
  if (isPG) {
    const { Pool } = require("pg");
    _pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  } else {
    const mysql = require("mysql2/promise");
    _pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost", user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "", database: process.env.DB_NAME || "student_tracker",
      waitForConnections: true, connectionLimit: 10,
    });
  }
  return _pool;
}

// SELECT / UPDATE / DELETE — returns array of rows
async function query(sql, params = []) {
  const pool = getPool();
  if (isPG) {
    let i = 0;
    const { rows } = await pool.query(sql.replace(/\?/g, () => `$${++i}`), params);
    return rows;
  }
  const [rows] = await pool.query(sql, params);
  return rows;
}

// INSERT — returns new row id
async function insertGetId(sql, params = []) {
  const pool = getPool();
  if (isPG) {
    let i = 0;
    const { rows } = await pool.query(sql.replace(/\?/g, () => `$${++i}`) + " RETURNING id", params);
    return rows[0]?.id;
  }
  const [result] = await pool.query(sql, params);
  return result.insertId;
}

module.exports = { query, insertGetId, isPG };
