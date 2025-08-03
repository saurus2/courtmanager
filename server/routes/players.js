const express = require('express');
const router = express.Router();
const db = require('../db');

// 모든 플레이어 조회
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM players ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 플레이어 추가
router.post('/', async (req, res) => {
  const { name, checkInDate, playingCount } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO players (name, checkin_date, playing_count)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, checkInDate || new Date(), playingCount || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Insert Player Error:', err); // ← 에러 전체 로그 찍기
    res.status(500).json({ error: err.message }); // ← 클라이언트에 메시지 반환
  }  
});

// 플레이어 삭제
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM players WHERE id = $1', [id]);
    res.json({ msg: 'Player removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;