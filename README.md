# Prodesk IT — Sprint 14
## Authentication & Protected Dashboard

A full-stack authentication MVP built for Prodesk IT Sprint 14. It includes registration and login forms, a Node.js/Express API, MongoDB user storage, password hashing with bcrypt, JWT-based authentication, and a protected dashboard.

> **Stack note:** The frontend is React + Vite + React Router (not Next.js/Firebase). Authentication is handled by the Express API using MongoDB and JWT.

## Features

- Register with name, email, and password
- Login with email and password
- Hash passwords with `bcryptjs` before saving them
- Issue a signed JWT after successful login/registration
- Protect backend routes with Bearer-token verification
- Protect the dashboard route and redirect unauthenticated users to login
- Keep the signed-in user's session data in browser local storage
- MongoDB connection configured through environment variables

## Tech Stack

**Frontend:** React, Vite, React Router, CSS  
**Backend:** Node.js, Express  
**Database:** MongoDB with Mongoose  
**Authentication:** bcryptjs, JSON Web Tokens (JWT)

## Project Structure

```text
prodesk-it-sprint-14/
├── client/
│   ├── src/
│   │   ├── components/    # Auth card and protected route
│   │   ├── context/       # Authentication context
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
└── README.md
```

## Prerequisites

- Node.js (LTS recommended)
- npm
- MongoDB database (local or MongoDB Atlas)

## Run Locally

### 1. Start the backend

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env` and set your own values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Then start the API:

```bash
npm run dev
```

### 2. Start the frontend

Open a second terminal:

```bash
cd client
npm install
```

Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL shown by Vite (normally `http://localhost:5173`).

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Authenticate an account |
| GET | `/api/dashboard` | Example protected endpoint (requires a valid Bearer token) |
| GET | `/api/health` | Check whether the API is responding |

## Environment Variables

### Backend (`server/.env`)

- `PORT` — API port (default: `5000`)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — private signing secret for JWTs
- `CLIENT_URL` — frontend origin allowed by CORS

### Frontend (`client/.env`)

- `VITE_API_URL` — API base URL, including `/api`

Never commit real secrets, database credentials, or production environment files. Keep `.env` files private and use the hosting provider's environment-variable settings for deployment.

## Sprint 14 Verification Checklist

- [ ] Register a new user and confirm the password is stored as a hash
- [ ] Log in with correct credentials
- [ ] Confirm incorrect credentials are rejected
- [ ] Open the dashboard while logged out and confirm redirect to login
- [ ] Call the protected dashboard API without a token and confirm it returns `401`
- [ ] Send an invalid or expired token and confirm it is rejected
- [ ] Verify MongoDB and frontend API environment variables are configured correctly

## Security Notes

Passwords are hashed before database storage and protected API routes verify JWTs on the server. For a production deployment, use HTTPS, a strong secret stored only in environment variables, appropriate CORS origins, rate limiting, and a reviewed token-storage/session strategy. Browser local storage is convenient for this MVP but can be exposed by cross-site scripting, so it should be evaluated before production use.

---

Built by **Harsh Maurya** for Prodesk IT Sprint 14.
