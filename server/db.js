const { Pool } = require('pg'); // PostgreSQL 클라이언트
require('dotenv').config(); // .env 파일 읽기

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
  ? { rejectUnauthorized: false } // 배포환경 (Heroku, Railway 등)
  : false                         // 로컬에서는 SSL 안씀
});

module.exports = pool; // 다른 파일에서 pool 사용 가능
