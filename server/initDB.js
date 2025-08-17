const pool = require('./db');  // courtmanager DB용 pool

async function initDB() {
  console.log("🔄 [initDB.js] DB 초기화 시작...");
  try {
    // users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ [initDB.js] users 테이블 확인/생성 완료");

    // players
    await pool.query(`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        checkin_date TIMESTAMP NOT NULL,
        playing_count INT DEFAULT 0,
        sort_order INT DEFAULT 0
      );
    `);
    console.log("✅ [initDB.js] players 테이블 확인/생성 완료");

    // courts
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
    `);
    console.log("✅ [initDB.js] courts 테이블 확인/생성 완료");

    // assignments
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assignments (
        id SERIAL PRIMARY KEY,
        court_id INT REFERENCES courts(id) ON DELETE CASCADE,
        player_id INT REFERENCES players(id) ON DELETE CASCADE,
        assigned_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ [initDB.js] assignments 테이블 확인/생성 완료");

    console.log("🎉 [initDB.js] 모든 테이블 확인/생성 완료");
  } catch (err) {
    console.error("❌ [initDB.js] DB init error:", err);
    throw err;
  }
}

module.exports = initDB;
