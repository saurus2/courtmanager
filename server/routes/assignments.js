const express = require('express');
const router = express.Router();
const pool = require('../db');

// 코트 배정 저장
router.post('/', async (req, res) => {
  const { court_id, player_id } = req.body;
  if (!court_id || !player_id) return res.status(400).send('Missing data');
  try {
    const result = await pool.query(
      'INSERT INTO assignments (court_id, player_id) VALUES ($1, $2) RETURNING *',
      [court_id, player_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting assignment:', err);
    res.status(500).send('Server error');
  }
});

// JOIN 해서 현재 배정 상태 조회
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.assigned_at, 
             c.name as court_name,
             p.name as player_name
      FROM assignments a
      JOIN courts c ON a.court_id = c.id
      JOIN players p ON a.player_id = p.id
      ORDER BY a.assigned_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
