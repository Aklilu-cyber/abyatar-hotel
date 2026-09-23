# Abyatar International Hotel — Backend API

Node.js + Express + MongoDB (Mongoose) API for menu, orders, room bookings, event bookings, and contact messages, with JWT-protected admin routes.

## 1. Setup

```
npm install
cp .env.example .env
```

Fill in `.env`:
- `MONGO_URI` — a MongoDB Atlas connection string (create a free cluster at mongodb.com/atlas)
- `JWT_SECRET` — any long random string
- `CLIENT_ORIGIN` — the URL of your deployed frontend, for CORS

## 2. Create your admin login

```
node scripts/createAdmin.js you@example.com yourPassword
```

## 3. (Optional) Seed rooms and menu items

Edit `scripts/seed.js` to include your full menu (copy from the frontend's `MENU` array), then:

```
node scripts/seed.js
```

## 4. Run locally

```
npm run dev
```

The API runs at `http://localhost:5000/api`. Health check: `GET /api/health`.

## 5. Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/login | — | Admin login, returns a JWT |
| GET | /api/menu | — | List menu items |
| POST/PUT/PATCH/DELETE | /api/menu(/:id) | admin | Manage menu |
| POST | /api/orders | — | Place a delivery order |
| GET | /api/orders | admin | List orders |
| PATCH | /api/orders/:id/status | admin | Update order status |
| GET | /api/rooms | — | List room types |
| GET | /api/rooms/availability/check | — | Check availability for dates |
| POST | /api/bookings | — | Request a room booking |
| GET | /api/bookings | admin | List bookings |
| POST | /api/events | — | Request an event booking |
| GET | /api/events | admin | List event bookings |
| POST | /api/contact | — | Submit contact form |
| GET | /api/contact | admin | List messages |

Admin routes require `Authorization: Bearer <token>` from `/api/auth/login`.

## 6. Deploying

- **Railway / Render**: connect this repo, set the same environment variables, deploy. Both auto-detect `npm start`.
- **MongoDB**: use MongoDB Atlas (free tier works) rather than a local database once deployed.
- **Frontend**: point the frontend's API calls at your deployed backend URL (e.g. `https://your-api.up.railway.app/api`) and set `CLIENT_ORIGIN` on the backend to your deployed frontend's URL.

## Not included (left as next steps)

- Email notifications (wire up a provider like Resend or SendGrid in the orders/bookings routes)
- PDF invoice generation (e.g. with `pdfkit`, triggered after a booking/order is confirmed)
- Multi-language content (store an `amharic` field alongside each menu/room field, or serve a translations JSON)
