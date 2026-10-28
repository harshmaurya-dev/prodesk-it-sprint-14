# Prodesk IT — Sprint 14
## Authentication & Protected Dashboard

A full-stack authentication MVP for Prodesk IT Sprint 14. It includes registration and login forms, a Node.js/Express API, MongoDB user storage, bcrypt password hashing, JWT authentication, and a protected dashboard.

> **Track:** Full Stack Developer (Track B). The frontend is React + Vite + React Router, and the backend is Express + MongoDB + JWT. This repository does not use Next.js or Firebase.

## Features

- Registration and login forms with input validation
- Passwords hashed with `bcryptjs` before database storage
- JWT returned after successful registration/login (7-day expiry)
- Protected Express endpoint using Bearer-token verification
- Protected dashboard route redirects unauthenticated users to login
- Saved sessions are validated against the protected API on app startup
- Missing, invalid, or expired JWTs clear the local session and redirect to login
- MongoDB and JWT secrets configured through environment variables
- Clear API health endpoint at `/api/health`

## Tech Stack

- **Frontend:** React, Vite, React Router, CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB + Mongoose
- **Authentication:** bcryptjs + JSON Web Tokens (JWT)

## Project Structure

```text
prodesk-it-sprint-14/
├── client/
│   ├── src/
│   │   ├── components/    # Auth card and protected route
│   │   ├── context/       # Session and authentication state
│   │   ├── pages/         # Login, Register, Dashboard
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   └── package.json
├── server/
│   ├── config/            # MongoDB connection
│   ├── controllers/       # Register and login logic
│   ├── middleware/        # JWT verification
│   ├── models/            # Mongoose User model
│   ├── routes/            # Auth and dashboard routes
│   ├── .env.example
│   └── server.js
├── package.json
└── README.md
```

## Prerequisites

- Node.js LTS and npm
- A MongoDB database (local or MongoDB Atlas)

## Run Locally

### 1. Configure and start the backend

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env`, then replace the placeholders with your own values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_own_random_secret_at_least_32_characters_long
CLIENT_URL=http://localhost:5173
```

The server checks that `MONGO_URI` and a `JWT_SECRET` of at least 32 characters are configured before starting. Then run:

```bash
npm run dev
```

### 2. Configure and start the frontend

Open a second terminal:

```bash
cd client
npm install
```

Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

Alternatively, from the repository root, run `npm install`, then `npm run install-all` to install dependencies in the client and server. The root `npm run dev` script starts both processes together.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account and return a JWT |
| POST | `/api/auth/login` | Verify credentials and return a JWT |
| GET | `/api/dashboard` | Protected endpoint; requires a valid Bearer token |
| GET | `/api/health` | Check API availability |

## Environment Variables

### Backend — `server/.env`

- `PORT` — API port (defaults to `5000`)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — private JWT signing secret; use a long random value
- `CLIENT_URL` — frontend origin allowed by CORS (comma-separated if multiple)

### Frontend — `client/.env`

- `VITE_API_URL` — API base URL, including `/api`

Never commit real secrets, database credentials, or production `.env` files. Set production values in the hosting provider's environment-variable settings.

## Sprint 14 Acceptance Checklist

Use this checklist to verify the running application before submitting:

- [ ] Register a new user; confirm MongoDB stores a bcrypt hash, not the original password
- [ ] Log in with correct credentials and confirm a JWT is returned
- [ ] Confirm incorrect credentials and duplicate registration are rejected
- [ ] Open `/dashboard` while logged out and confirm redirect to `/login`
- [ ] Call `GET /api/dashboard` without a token and confirm HTTP `401`
- [ ] Send an invalid or expired JWT and confirm HTTP `401`
- [ ] Refresh the page with a valid token and confirm the session is restored
- [ ] Refresh with an invalid/expired token and confirm the session is cleared and login is shown
- [ ] Confirm the MongoDB URI, JWT secret, CORS origin, and frontend API URL are set for the target environment

## Security Notes

The API hashes passwords, avoids returning password fields, and verifies JWTs on protected routes. For production, use HTTPS, a unique secret stored only in environment variables, narrowly configured CORS origins, rate limiting, and a reviewed session/token-storage strategy. Local storage is used for this internship MVP, but it can be exposed by cross-site scripting and should be evaluated before production use.

---

Built by **Harsh Maurya** for Prodesk IT Sprint 14.
