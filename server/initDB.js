const pool = require('./db');

async function initDB() {
  try {
    // 운영자 계정 테이블
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 플레이어 테이블
    await pool.query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        checkin_date TIMESTAMP NOT NULL,
        playing_count INT DEFAULT 0
      );
    `);

    // 코트 테이블
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
    `);

    // 배정 이력 테이블
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
