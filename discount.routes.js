const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const router = express.Router();

const WHEEL = [10, 20, 0, 15, 0, 30, 10, 0]; // % off; 0 = try again

router.post('/spin', (req, res) => {
  const { email } = req.body || {};
  const idx = crypto.randomInt(0, WHEEL.length);
  const percent = WHEEL[idx];
  if (percent === 0) return res.json({ percent: 0, message: 'Try again!' });

  const code = 'LN' + crypto.randomBytes(4).toString('hex').toUpperCase();
  db.prepare('INSERT INTO discounts (code, percent, user_email) VALUES (?, ?, ?)')
    .run(code, percent, email || null);
  res.json({ percent, code });
});

router.post('/validate', (req, res) => {
  const { code } = req.body || {};
  const row = db.prepare('SELECT * FROM discounts WHERE code = ? AND used = 0').get(code);
  if (!row) return res.status(404).json({ error: 'invalid or used' });
  res.json({ percent: row.percent, code: row.code });
});

module.exports = router;
