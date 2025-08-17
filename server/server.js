const express = require('express');
const cors = require('cors');
require('dotenv').config();
const readline = require('readline');
const { exec } = require('child_process');   // 빠져있던 exec 추가

const initDB = require('./initDB');
const playersRouter = require('./routes/players');
const courtsRouter = require('./routes/courts');
const assignmentsRouter = require('./routes/assignments');

const app = express();
app.use(cors());
app.use(express.json());

// API 라우터 연결
app.use('/api/players', playersRouter);
app.use('/api/courts', courtsRouter);
app.use('/api/assignments', assignmentsRouter);

// 테스트용 라우트
app.get('/', (req, res) => {
  res.send('Court Manager API is running...');
});

const PORT = process.env.PORT || 4000;

// ✅ DB 초기화 함수
function resetDatabase() {
  return new Promise((resolve, reject) => {
    console.log("⚠️ [server.js] 기존 데이터베이스를 초기화합니다...");
    exec("psql -U admin -d postgres -f init.sql", (error, stdout, stderr) => {
      if (error) {
        console.error("❌ [server.js] DB 초기화 실패:", stderr);
        reject(error);
      } else {
        console.log("✅ [server.js] DB 초기화 완료");
        console.log("ℹ️ [server.js] psql stdout:", stdout);
        resolve();
      }
    });
  });
}

// ✅ 서버 시작 함수
function startServer() {
  console.log("🚀 [server.js] 서버 시작 준비 중...");
  initDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 [server.js] Server running on port ${PORT}`));
  }).catch(err => {
    console.error("❌ [server.js] initDB 실행 중 에러:", err);
  });
}

// ✅ 실행 전에 물어보기
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("DB를 초기화하시겠습니까? (y/N): ", async (answer) => {
  rl.close();
  if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
    try {
      await resetDatabase();
      startServer();
    } catch (err) {
      console.error("❌ [server.js] resetDatabase 실행 중 오류:", err);
    }
  } else {
    console.log("⏩ [server.js] 기존 DB를 유지합니다.");
    startServer();
  }
});
