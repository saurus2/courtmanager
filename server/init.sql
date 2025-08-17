-- 1. 사용자(ROLE) 생성
DO
$$
BEGIN
   RAISE NOTICE '🔄 [init.sql] ROLE admin 생성 확인 중...';
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin'
   ) THEN
      CREATE ROLE admin WITH LOGIN PASSWORD '7824';
      ALTER ROLE admin CREATEDB;
      RAISE NOTICE '✅ [init.sql] ROLE admin 생성 완료';
   ELSE
      RAISE NOTICE '⏩ [init.sql] ROLE admin 이미 존재';
   END IF;
END
$$;

-- 2. 데이터베이스 생성 (DO 블록 대신 일반 CREATE DATABASE IF NOT EXISTS 대체)
-- Postgres는 CREATE DATABASE에 IF NOT EXISTS가 없으므로 안전하게 실행하려면
-- initDB.js에서 ensureDatabase()로 처리하는 것이 정석입니다.
-- 하지만 여기서는 단순하게 해봅니다.

-- 존재하지 않으면 만들어라 (실패해도 무시 가능)
CREATE DATABASE courtmanager OWNER admin;

-- ✅ 여기서 반드시 courtmanager DB로 전환
\connect courtmanager;

-- 3. 테이블 생성
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    checkin_date TIMESTAMP,
    playing_count INT DEFAULT 0,
    sort_order INT DEFAULT 0 
);

CREATE TABLE IF NOT EXISTS courts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    court_id INT REFERENCES courts(id) ON DELETE CASCADE,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. 소유자(admin)로 변경
ALTER TABLE players OWNER TO admin;
ALTER TABLE courts OWNER TO admin;
ALTER TABLE assignments OWNER TO admin;
ALTER TABLE users OWNER TO admin;

ALTER SEQUENCE players_id_seq OWNER TO admin;
ALTER SEQUENCE courts_id_seq OWNER TO admin;
ALTER SEQUENCE assignments_id_seq OWNER TO admin;
ALTER SEQUENCE users_id_seq OWNER TO admin;

-- 5. 권한 부여
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

-- ✅ 실행 로그 출력
DO $$
BEGIN
  RAISE NOTICE '🎉 [init.sql] 모든 테이블 및 권한 설정 완료';
END$$;
