require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// API routes
app.use('/api/auth',     require('./routes/auth.routes'));
app.use('/api/leads',    require('./routes/lead.routes'));
app.use('/api/discount', require('./routes/discount.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'letsnutriate' }));

// Serve frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✓ LetsNutriate running on http://localhost:${PORT}`));
