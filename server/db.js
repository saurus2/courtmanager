const { Pool } = require('pg'); // PostgreSQL 클라이언트
require('dotenv').config(); // .env 파일 읽기

const pool = new Pool({  // DB 연결 설정
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

module.exports = pool; // 다른 파일에서 pool 사용 가능
