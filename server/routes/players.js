const express = require('express');
const router = express.Router();
const pool = require('../db');

// 플레이어 전체 조회
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 플레이어 추가
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send('Name required');
  try {
    const result = await pool.query(
      'INSERT INTO players (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 플레이어 삭제
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM players WHERE id=$1', [id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;