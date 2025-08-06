const { Pool } = require('pg');
const pool = require('./db');  // courtmanager DB용 pool

async function ensureDatabase() {
  // postgres DB에 연결해서 데이터베이스 존재 확인
  const sysPool = new Pool({
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // 시스템 DB
    password: process.env.DB_PASSWORD || '7824',
    port: process.env.DB_PORT || 5432,
  });

  const dbName = 'courtmanager';

  try {
    const result = await sysPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );
    if (result.rowCount === 0) {
      console.log(`Database ${dbName} not found. Creating...`);
      await sysPool.query(`CREATE DATABASE ${dbName} OWNER admin`);
      console.log(`Database ${dbName} created ✅`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }
  } finally {
    await sysPool.end();
  }
}

async function initDB() {
  try {
    await ensureDatabase();

    // 테이블 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        checkin_date TIMESTAMP NOT NULL,
        playing_count INT DEFAULT 0,
        sort_order INT DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS courts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS assignments (
        id SERIAL PRIMARY KEY,
        court_id INT REFERENCES courts(id) ON DELETE CASCADE,
        player_id INT REFERENCES players(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('DB Tables initialized ✅');
  } catch (err) {
    console.error('DB init error:', err);
  }
}

module.exports = initDB;
