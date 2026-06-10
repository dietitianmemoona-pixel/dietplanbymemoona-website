const express = require('express');
const db = require('../db');
const { requireAuth } = require('../auth');
const router = express.Router();

const PRICES = {
  basic:   { '1m': 1500, '3m': 4000, '6m': 7500 },
  premium: { '1m': 2500, '3m': 6800, '6m': 12500 },
  elite:   { '1m': 4000, '3m': 11000, '6m': 20000 }
};

router.post('/', requireAuth, (req, res) => {
  const { plan, duration, discount_code, notes } = req.body || {};
  const base = PRICES[plan]?.[duration];
  if (!base) return res.status(400).json({ error: 'invalid plan/duration' });

  let pct = 0;
  if (discount_code) {
    const d = db.prepare('SELECT * FROM discounts WHERE code = ? AND used = 0').get(discount_code);
    if (d) {
      pct = d.percent;
      db.prepare('UPDATE discounts SET used = 1 WHERE id = ?').run(d.id);
    }
  }
  const final = Math.round(base * (1 - pct / 100));
  const info = db.prepare(
    `INSERT INTO bookings (user_id, plan, duration, base_price, discount_pct, final_price, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(req.user.id, plan, duration, base, pct, final, notes || null);
  res.json({ id: info.lastInsertRowid, base_price: base, discount_pct: pct, final_price: final });
});

router.get('/', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json({ bookings: rows });
});

module.exports = router;
