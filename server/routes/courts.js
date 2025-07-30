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

module.exports = router;