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

// 플레이어 전체 삭제 (/reset)
router.delete('/reset', async (req, res) => {
  try {
    await db.query('DELETE FROM players');
    await db.query("SELECT setval(pg_get_serial_sequence('players', 'id'), 1, false)");
    res.status(200).json({ message: 'All players deleted' });
  } catch (error) {
    console.error('Failed to reset players:', error);
    res.status(500).json({ error: 'Failed to reset players' });
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

// 플레이어 순서 업데이트
router.put('/order', async (req, res) => {
  const { players } = req.body; 
  // players: [{id: 1, sort_order: 0}, {id: 2, sort_order: 1}, ...]

  if (!Array.isArray(players)) {
    return res.status(400).json({ error: 'players array is required' });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');
    for (const p of players) {
      await client.query(
        'UPDATE players SET sort_order = $1 WHERE id = $2',
        [p.sort_order, p.id]
      );
    }
    await client.query('COMMIT');
    res.json({ msg: 'Player order updated' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Update order error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// 플레이어의 playing_count 업데이트
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { playing_count } = req.body;

  if (playing_count === undefined) {
    return res.status(400).json({ error: 'playing_count is required' });
  }

  try {
    const result = await db.query(
      'UPDATE players SET playing_count = $1 WHERE id = $2 RETURNING *',
      [playing_count, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update Player Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;