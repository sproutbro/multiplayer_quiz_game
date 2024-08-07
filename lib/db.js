const pg = require("pg");
const { Pool } = pg;

// 데이터베이스 연결 풀 설정
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

function executeQuery(text, params) {
  return pool.query(text, params);
}

module.exports = executeQuery;
