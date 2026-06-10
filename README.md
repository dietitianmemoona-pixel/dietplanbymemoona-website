# LetsNutriate by MJ — Full Stack

Complete nutrition platform: static HTML frontend + Node/Express backend + SQLite database + JWT authentication + REST API.

## Quick Start

```bash
npm install
cp .env.example .env
npm run init-db
npm start
```

Open http://localhost:3000

## Structure

```
letsnutriate/
├── frontend/index.html        # Full website (Spin-the-Wheel, calculators, checkout)
├── backend/
│   ├── server.js              # Express app, serves frontend + API
│   ├── db.js                  # SQLite connection
│   ├── auth.js                # JWT middleware
│   └── routes/
│       ├── auth.routes.js     # /api/auth/register, /login, /me
│       ├── booking.routes.js  # /api/bookings  (create + list user bookings)
│       ├── lead.routes.js     # /api/leads     (quiz/contact submissions)
│       └── discount.routes.js # /api/discount/spin (server-side wheel result)
├── database/
│   ├── init.js                # Creates tables + seeds
│   └── schema.sql             # SQL schema
└── .env.example
```

## API Endpoints

| Method | Path                    | Auth | Purpose                           |
|--------|-------------------------|------|-----------------------------------|
| POST   | /api/auth/register      | —    | Create account (email + password) |
| POST   | /api/auth/login         | —    | Returns JWT                       |
| GET    | /api/auth/me            | JWT  | Current user                      |
| POST   | /api/leads              | —    | Save quiz / contact lead          |
| POST   | /api/discount/spin      | —    | Server-validated wheel discount   |
| POST   | /api/bookings           | JWT  | Book a plan (plan, duration, discount) |
| GET    | /api/bookings           | JWT  | List my bookings                  |

## Auth

JWT (HS256). Send `Authorization: Bearer <token>` on protected routes.
Passwords hashed with bcrypt (10 rounds).

## Database

SQLite via better-sqlite3 — zero-config, single file at `database/letsnutriate.db`.
Tables: `users`, `leads`, `bookings`, `discounts`.

## Deploy

Runs anywhere Node 18+ is available (Render, Railway, Fly.io, VPS).
For GoDaddy `letsnutriate.com`, point DNS A record to your server IP, or use a static host for `frontend/index.html` alone if you only want the marketing site.
