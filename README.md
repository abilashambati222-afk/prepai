# PrepAI – AI Career Preparation Platform

> **Practice Smarter. Interview Better.**

PrepAI is a production-ready, scalable, AI-powered career preparation platform designed to help software engineering students and professionals ace their placements. The project is structured using the standard MERN (MongoDB, Express, React, Node.js) stack in pure JavaScript (ES6+), optimized for rapid development, independent testing, and clean separation of concerns.

---

## 📂 Project Architecture

The repository is structured side-by-side with independent frontend and backend workspaces:

```
PrepAI/ (Root)
│
├── scripts/                # Database seeders, deployment, utility scripts
├── assets/                 # Brand assets (logos, favicons, OG images)
├── .github/                # GitHub workflows (CI/CD) and PR/issue templates
│
├── frontend/               # React 19 Client SPA
│   ├── src/
│   │   ├── config/         # API and navigation configurations
│   │   ├── styles/         # Global styles overrides and keyframes CSS
│   │   ├── theme/          # HSL themes, spacing, and shadows
│   │   └── (others)
│   └── package.json
│
├── backend/                # Node.js + Express.js API Server
│   ├── config/             # DB & environmental integrations
│   ├── lib/                # Integrations (Gemini API, Cloudinary, Email SMTP)
│   ├── errors/             # Centralized Custom error classes
│   ├── tests/              # Unit & Integration test suites
│   │   ├── unit/
│   │   └── integration/
│   └── package.json
│
├── docs/                   # Planning & architectural specifications
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATABASE_DESIGN.md
│   ├── DEVELOPMENT_ROADMAP.md
│   ├── API_DOCUMENTATION.md
│   ├── FEATURES.md
│   ├── CHANGELOG.md
│   └── CONTRIBUTING.md
│
├── README.md               # Quickstart & overview documentation
└── .gitignore              # Project-wide ignore rules
```

---

## 🛡️ Authentication Flow

```
   User
    │
    ▼
 Register (Input validation / Uniqueness check)
    │
    ▼
Password Hash (bcrypt pre-save hook)
    │
    ▼
 MongoDB (Mongoose Schema with email indexing)
    │
    ▼
  Login (Password verification / Update lastLogin date)
    │
    ▼
JWT Access Token (Stateless sign in backend/utils/jwt.js)
    │
    ▼
Protected Routes (protect middleware check context req.user)
```

---

## 🔗 API Endpoints

### Authentication Services `/api/v1/auth`

| Endpoint | Method | Access | Payload | Response Data |
| :--- | :--- | :--- | :--- | :--- |
| `/register` | `POST` | Public | `{ fullName, email, password }` | `{ success: true, message: "...", data: { token, user } }` |
| `/login` | `POST` | Public | `{ email, password }` | `{ success: true, message: "...", data: { token, user } }` |
| `/logout` | `POST` | Public | None | `{ success: true, message: "..." }` |
| `/me` | `GET` | Protected | None (Bearer Token) | `{ success: true, data: { user } }` |
| `/forgot-password` | `POST` | Public | Placeholder | `501 Not Implemented` |
| `/reset-password` | `POST` | Public | Placeholder | `501 Not Implemented` |
| `/verify-email` | `GET` | Public | Placeholder | `501 Not Implemented` |

---

## ⚙️ Environment Variables

### Backend Workspace (`/backend/.env`)
- `PORT` — Express server listener port (e.g. `5000`).
- `NODE_ENV` — Runtime environment environment (`development` | `production`).
- `MONGODB_URI` — MongoDB Atlas or local connection string.
- `CLIENT_URL` — Frontend client browser origin (default `http://localhost:5173`).
- `JWT_SECRET` — Private key used to sign access tokens.
- `JWT_EXPIRES_IN` — Lifetime of the JWT token (default `7d`).
- `GEMINI_API_KEY` — Google Gemini SDK developer token (future phases).

### Frontend Workspace (`/frontend/.env`)
- `VITE_API_URL` — Base endpoint pointing to the backend API (default `http://localhost:5000/api/v1`).

---

## 🚀 Project Startup Instructions

### Prerequisites
- [Node.js (LTS v20+)](https://nodejs.org)
- [MongoDB (Local or Atlas URI)](https://www.mongodb.com/atlas)

### Execution Steps

1. **Clone & Setup Environment**:
   Create `.env` files in both the `/backend` and `/frontend` directories using their corresponding `.env.example` templates.

2. **Run Backend Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *Verify console log:* `🚀 PrepAI Server running on port 5000` & `[MDB] Connection established successfully`

3. **Run Frontend App**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *Open browser:* http://localhost:5173

---

## 📋 Roadmap & Phase Checklist
- [x] Base Folder Structures & Placeholder `.gitkeep` directories
- [x] Configuration Files (Vite, Tailwind CSS v4, Express app)
- [x] Environment templates (`.env.example`)
- [x] Mongoose connection outlines (`backend/config/db.js`)
- [x] System documentation (`docs/`)
- [x] **Phase 2:** Authentication and Profile Management (Refined and Polished)
- [ ] **Phase 3:** ATS Score & AI Resume Analysis
- [ ] **Phase 4:** Mock Interviews & Coding/MCQ Practice
- [ ] **Phase 5:** System Analytics & Admin Dashboard

---
*PrepAI has been initialized by the engineering architecture team. Implementation of core modules will proceed upon approval.*
