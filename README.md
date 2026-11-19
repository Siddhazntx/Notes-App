# Full-Stack Notes Application

A secure, responsive, full-stack Notes Application built with React, Node.js, Express, PostgreSQL (Supabase), JWT authentication, and bcrypt password hashing.

---

## 1. Tech Stack

- **Frontend:** React (Vite), Axios, Plain CSS (Responsive & Mobile-Friendly)
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (hosted on Supabase) via `pg` (node-postgres)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Environment Management:** dotenv

---

## 2. Features

- **Authentication:**
  - User registration with email format & password length validation.
  - Password hashing with bcrypt (salt rounds = 10).
  - Duplicate email registration prevention (409 Conflict).
  - Secure login with JWT issuance (1-day expiration).
  - Passwords are never exposed or returned in API responses.
- **Notes Management (CRUD):**
  - Create notes with title and content.
  - Read all notes belonging to the authenticated user (sorted newest first).
  - Update notes with ownership enforcement.
  - Delete notes with ownership enforcement and frontend confirmation dialog.
  - Strict data isolation: Users cannot access, edit, or delete notes belonging to other users.
- **Security:**
  - Fully parameterized SQL queries (`$1, $2, ...`) preventing SQL injection.
  - Centralized JWT verification middleware extracting `req.user.id`.
  - CORS configuration with optional client URL whitelisting.
  - Global error handling returning clean JSON errors without leaking stack traces.

---

## 3. Project Structure

```text
NotesApp/
├── backend/
│   ├── config/
│   │   └── db.js               # PostgreSQL connection pool using pg
│   ├── controllers/
│   │   ├── authController.js   # Signup, login, validation logic
│   │   └── noteController.js   # Notes CRUD logic with ownership checks
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth routes
│   │   └── noteRoutes.js       # /api/notes protected routes
│   ├── .env.example            # Backend environment template
│   ├── package.json
│   └── server.js               # Express entry point & middleware setup
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.jsx        # Login & Signup toggle form
│   │   │   ├── Dashboard.jsx   # Main authenticated dashboard
│   │   │   ├── NoteCard.jsx    # Individual note display & action buttons
│   │   │   └── NoteForm.jsx    # Create / Edit note form
│   │   ├── api.js              # Axios client with JWT interceptor
│   │   ├── App.css             # Clean, responsive styles
│   │   ├── App.jsx             # Session management & routing
│   │   ├── index.css           # Base CSS reset
│   │   └── main.jsx
│   ├── .env.example            # Frontend environment template
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 4. Database Schema

The application uses two tables in PostgreSQL:

```sql
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notes Table
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. Environment Variables

### Backend (`backend/.env`)
Create `backend/.env` based on `backend/.env.example`:
```env
PORT=5000
DATABASE_URL=postgresql://postgres.<project-id>:<password>@<host>:5432/postgres
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
Create `frontend/.env` based on `frontend/.env.example`:
```env
VITE_API_URL=http://localhost:5000
```

---

## 6. Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (e.g. Supabase instance)

### Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file with your database connection string and secret key:
   ```bash
   cp .env.example .env
   ```
4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`.

### Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up `.env` (optional for local, defaults to `http://localhost:5000`):
   ```bash
   cp .env.example .env
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 7. API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required | Request Body |
|---|---|---|---|---|
| POST | `/api/auth/signup` | Register new user | No | `{ "email": "...", "password": "..." }` |
| POST | `/api/auth/login` | Login and receive JWT | No | `{ "email": "...", "password": "..." }` |
| GET | `/api/auth/me` | Verify JWT and return user ID | Yes (Bearer) | None |

### Notes
| Method | Endpoint | Description | Auth Required | Request Body |
|---|---|---|---|---|
| GET | `/api/notes` | Get all notes of logged-in user | Yes (Bearer) | None |
| POST | `/api/notes` | Create a new note | Yes (Bearer) | `{ "title": "...", "content": "..." }` |
| PUT | `/api/notes/:id` | Update an existing note | Yes (Bearer) | `{ "title": "...", "content": "..." }` |
| DELETE | `/api/notes/:id` | Delete a note | Yes (Bearer) | None |

### System
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/health` | Server health check | No |

---

## 8. Deployment Guide

### A. Deploy Backend to Render

1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com/) and click **New + > Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service settings:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Under **Environment Variables**, add:
   - `DATABASE_URL`: Your Supabase connection string.
   - `JWT_SECRET`: A long random secret string.
   - `CLIENT_URL`: Your frontend production URL (e.g., `https://your-app.vercel.app`).
   - `PORT`: `5000` (or leave default, Render sets `PORT` automatically).
6. Click **Deploy Web Service**.
7. Note down your Render backend URL (e.g. `https://notes-backend.onrender.com`).

### B. Deploy Frontend to Vercel

1. Sign in to [Vercel](https://vercel.com/) and click **Add New > Project**.
2. Select your repository.
3. In the project configuration:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click "Edit" and choose `frontend`.
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: Your deployed Render backend URL (e.g., `https://notes-backend.onrender.com`).
5. Click **Deploy**.
6. Once deployed, copy your Vercel URL and add it to `CLIENT_URL` in your Render backend settings.
