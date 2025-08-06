-- 1. 사용자(ROLE) 생성 (없으면)
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE rolname = 'admin') THEN
      CREATE ROLE admin WITH LOGIN PASSWORD '7824';
      ALTER ROLE admin CREATEDB;
   END IF;
END
$$;

-- 2. 데이터베이스 생성 (없으면)
DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_database
      WHERE datname = 'courtmanager') THEN
      CREATE DATABASE courtmanager OWNER admin;
   END IF;
END
$$;

-- 3. courtmanager DB 내부에서 실행될 테이블 생성
--    (psql -U admin -d courtmanager -f init.sql 로 실행)

-- 플레이어
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    checkin_date TIMESTAMP,
    playing_count INT DEFAULT 0,
    sort_order INT DEFAULT 0 
);

-- 코트
CREATE TABLE IF NOT EXISTS courts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- 배정 (코트와 플레이어 관계)
CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    court_id INT REFERENCES courts(id) ON DELETE CASCADE,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW()
);

-- 운영자 계정
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);