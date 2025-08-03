const express = require('express');
const router = express.Router();
const pool = require('../db');

// 코트 전체 조회
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courts ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// 코트 추가
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO courts (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting court:', err);  // <-- 전체 로그 찍기
    res.status(500).send('Server Error');
  }
});

module.exports = router;