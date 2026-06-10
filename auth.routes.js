const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const { sign, requireAuth } = require('../auth');

const router = express.Router();

router.post('/register', (req, res) => {
  const { email, password, name, phone } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });
  if (password.length < 6) return res.status(400).json({ error: 'password too short' });
  try {
    const hash = bcrypt.hashSync(password, 10);
    const info = db.prepare(
      'INSERT INTO users (email, password_hash, name, phone) VALUES (?, ?, ?, ?)'
    ).run(email.toLowerCase().trim(), hash, name || null, phone || null);
    const token = sign({ id: info.lastInsertRowid, email });
    res.json({ token, user: { id: info.lastInsertRowid, email, name } });
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) return res.status(409).json({ error: 'email already registered' });
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email & password required' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  const token = sign({ id: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

router.get('/me', requireAuth, (req, res) => {
  const u = db.prepare('SELECT id, email, name, phone, created_at FROM users WHERE id = ?').get(req.user.id);
  res.json({ user: u });
});

module.exports = router;
