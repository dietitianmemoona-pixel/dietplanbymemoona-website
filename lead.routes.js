const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', (req, res) => {
  const { name, email, phone, source, payload } = req.body || {};
  const info = db.prepare(
    'INSERT INTO leads (name, email, phone, source, payload) VALUES (?, ?, ?, ?, ?)'
  ).run(name || null, email || null, phone || null, source || 'contact', JSON.stringify(payload || {}));
  res.json({ id: info.lastInsertRowid, ok: true });
});

module.exports = router;
