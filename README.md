# Notes App

A full-stack notes management application built with React, Node.js, Express, and PostgreSQL (Supabase). It features secure user authentication with JWT, hashed passwords with bcrypt, and complete CRUD operations for personal notes.

- **Live Application:** [https://notes-app-lilac-psi-56.vercel.app/](https://notes-app-lilac-psi-56.vercel.app/)
- **Demo Video:** [Watch Walkthrough](https://drive.google.com/file/d/1At5I3aA7jgwdF5_3vKHmHkBxnSRbeEZp/view?usp=sharing)

---

## Features

- **Authentication:** Sign up and log in securely using email and password. Passwords are never stored in plaintext — they're hashed with bcrypt before saving to the database.
- **Notes Management:** Create, read, edit, and delete notes in real time. Notes are automatically sorted with the newest ones first.
- **Session Handling:** Uses JSON Web Tokens (JWT) stored in the browser to maintain login state. If a token expires or is invalid, the user is redirected back to the login screen.
- **Clean UI:** A simple, responsive interface built with vanilla CSS that works seamlessly across desktop and mobile devices.

---

## Privacy

Every user's notes are private. When User A creates a note, only User A can view, edit, or delete it. Other users cannot access that note, even if they know its ID.

Each note is linked to the user who created it, and the backend checks ownership whenever someone tries to access or modify a note. This ensures users can only manage their own notes.

---

## Tech Stack

- **Frontend:** React (Vite), Axios, Plain CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL on Supabase (`pg` library)
- **Authentication:** JWT (`jsonwebtoken`) & `bcryptjs`
- **Config:** `dotenv` & `cors`

---

## Project Structure

```text
NotesApp/
├── backend/
│   ├── config/
│   │   └── db.js               # PostgreSQL pool connection
│   ├── controllers/
│   │   ├── authController.js   # Signup, login, validation logic
│   │   └── noteController.js   # Notes CRUD and user ownership logic
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth endpoints
│   │   └── noteRoutes.js       # /api/notes endpoints (protected)
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth.jsx        # Login & signup form
│   │   │   ├── Dashboard.jsx   # Main view for notes
│   │   │   ├── NoteCard.jsx    # Note display and action buttons
│   │   │   └── NoteForm.jsx    # Create and edit note form
│   │   ├── api.js              # Axios setup with JWT interceptor
│   │   ├── App.jsx             # Main container and auth state
│   │   ├── App.css             # Main styling
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Database Tables

The application runs on two PostgreSQL tables:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notes table
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

## Local Setup

### 1. Prerequisites
- Node.js (v18+)
- A PostgreSQL database (e.g. free Supabase tier)

### 2. Backend Setup
Navigate into the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create your `.env` file from the example:
```bash
cp .env.example .env
```

Fill in your actual environment variables in `backend/.env`:
```env
PORT=5000
DATABASE_URL=your_supabase_postgresql_connection_string
JWT_SECRET=your_random_secret_key
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
Open a second terminal, navigate into the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Create your `.env` file from the example:
```bash
cp .env.example .env
```

Your `frontend/.env` should point to your local backend:
```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## API Endpoints

### Auth Routes
| Method | Endpoint | Description | Requires Token |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Authenticate user and receive JWT | No |
| GET | `/api/auth/me` | Fetch currently authenticated user | Yes |

### Notes Routes
| Method | Endpoint | Description | Requires Token |
|---|---|---|---|
| GET | `/api/notes` | Get all notes for the logged-in user | Yes |
| POST | `/api/notes` | Create a new note | Yes |
| PUT | `/api/notes/:id` | Update a note (must be owner) | Yes |
| DELETE | `/api/notes/:id` | Delete a note (must be owner) | Yes |

### Health Check
| Method | Endpoint | Description | Requires Token |
|---|---|---|---|
| GET | `/health` | Check if server is running | No |

---

## How I Deployed the App

Here is how I set up and deployed the application:

### 1. Database (Supabase)
- Set up a cloud PostgreSQL database on [Supabase](https://supabase.com/).
- Created the `users` and `notes` tables with appropriate constraints (unique emails, primary keys, and cascade deletion for user notes).
- Extracted the PostgreSQL connection string to connect through the `pg` client.

### 2. Backend (Render)
- Connected my GitHub repository to [Render](https://render.com/) as a Web Service.
- Set the root directory to `backend`.
- Set the build command to `npm install` and start command to `npm start`.
- Configured the environment variables in Render:
  - `DATABASE_URL`: Supabase connection string.
  - `JWT_SECRET`: Secret key for token generation and verification.
  - `CLIENT_URL`: `https://notes-app-lilac-psi-56.vercel.app` (for CORS).
  - `PORT`: `5000`

### 3. Frontend (Vercel)
- Imported the repository into [Vercel](https://vercel.com/).
- Set the root directory to `frontend` using the Vite preset.
- Added the environment variable:
  - `VITE_API_URL`: Set to the deployed backend URL on Render.
- Deployed the application to [https://notes-app-lilac-psi-56.vercel.app/](https://notes-app-lilac-psi-56.vercel.app/).

