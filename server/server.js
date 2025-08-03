const express = require('express');
const cors = require('cors');
require('dotenv').config();

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

// 테스트용 라우트 (확인용)
app.get('/', (req, res) => {
  res.send('Court Manager API is running...');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const db = require('./db');

db.query('SELECT NOW()')
  .then(res => console.log('DB Connected:', res.rows[0]))
  .catch(err => console.error('DB Error:', err));

// DB 테이블 자동 초기화 후 서버 실행
initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
