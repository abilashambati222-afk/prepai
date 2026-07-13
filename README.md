# PrepAI – AI-Powered Career Preparation Platform

> **Practice Smarter. Interview Better. Master Placements.**

PrepAI is a production-ready, scalable, AI-powered career preparation platform designed to help software engineering candidates ace technical and HR interviews. Built on the modern MERN (MongoDB, Express, React, Node.js) stack, PrepAI integrates Google Gemini AI to analyze resumes against ATS benchmarks, map detailed skill gaps, and run interactive mock placements simulations with real-time feedback, category scoring, and digital credentials.

---

## 🚀 Key Modules & Features

1. **Candidate Onboarding Console**: Collects education, career goals, target companies, and current skills inventory to customize the preparation track.
2. **Resume Analyzer & ATS Parser**: Leverages Google Gemini models to extract structured resume datasets, calculate parsing confidence scores, and provide keyword recommendations.
3. **Job Description Alignment**: Compares resumes against specific job requirements, highlighting structural keyword gaps and calculating matching readiness ratios.
4. **Mock Placements Simulator**: Runs full 5-question mock interviews (Technical, HR, Behavioral, Coding, Resume, or Project-based). Candidate answers are graded instantly on technical accuracy, completeness, clarity, and confidence.
5. **Analytics Dashboard**: Renders interactive progress curves, polar concepts grids, and category-wise rating matrices.
6. **Digital Credentials**: Generates printable verification certificates of completion for any mock interview session scoring $\ge$ 70%.

---

## 📂 Repository Structure

The project has a clean, side-by-side frontend and backend workspace configuration:

```
PrepAI/ (Root)
│
├── scripts/                # Database seeders, setup scripts, and mock data loaders
├── assets/                 # Brand assets, logos, and graphic materials
│
├── frontend/               # React 19 Client SPA (Vite, Tailwind CSS v4, Framer Motion)
│   ├── src/
│   │   ├── components/     # Reusable layout and modular visual components
│   │   ├── context/        # State context providers (AuthContext, ToastContext)
│   │   ├── layouts/        # Shell templates (ProtectedLayout)
│   │   ├── pages/          # Interactive pages (Dashboard, Resume, Mock Interviews, Report)
│   │   ├── styles/         # Global stylesheets and animation utilities
│   │   └── lib/            # Axios API config wrappers
│   └── package.json
│
├── backend/                # Node.js + Express.js API Server
│   ├── config/             # DB configuration and security middleware setup
│   ├── controllers/        # Express route handlers and controller logic
│   ├── models/             # Mongoose MongoDB data schemas
│   ├── routes/             # API Router definitions
│   ├── services/           # AI Prompt Builders, Resume Parsers, and Interview Evaluation engines
│   └── package.json
│
├── docs/                   # Detailed architectural and usage specifications
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATABASE_DESIGN.md
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── DEVELOPMENT_ROADMAP.md
│
├── README.md               # Quickstart overview and module roadmap (This file)
└── B_TECH_PROJECT_REPORT.md # Comprehensive academic submission project report
```

---

## ⚙️ Environmental Configurations

### Backend Workspace (`/backend/.env`)
Create a `.env` file in the `/backend` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/prepai
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_signing_secret_key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=AIzaSy...your_gemini_api_developer_key
```

### Frontend Workspace (`/frontend/.env`)
Create a `.env` file in the `/frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🛠️ Quickstart & Local Startup

### Prerequisites
* [Node.js (LTS v20+)](https://nodejs.org)
* [MongoDB (Local community edition or Atlas URI)](https://www.mongodb.com)

### Steps to Run

1. **Clone the repository** and navigate to the project directory.
2. **Run Backend Server**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *Expected output:* `🚀 PrepAI Server running on port 5000` & `[MDB] Connection established successfully`
3. **Run Frontend Application**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *Access dashboard at:* [http://localhost:5173](http://localhost:5173)

---

## 📋 Project Roadmap Progress

- [x] **Phase 1: Foundation Setup**: Core directories, configurations, Tailwind v4 base style architecture, and system planning.
- [x] **Phase 2: Authentication & Profile**: Stateful registration, secure password hashing (bcrypt), stateless JWT sign-in, and onboarding profile customization.
- [x] **Phase 3: ATS Resume Analyzer**: Multi-part file upload parsing, Gemini-powered keyword extraction, confidence index ratings, and PDF preview.
- [x] **Phase 4: Mock Interview Simulator**: Dynamic question generators, answer timers, mock speech simulation, and instant grade evaluation feedback.
- [x] **Phase 5: Analytics & Verification**: Overall readiness indexes, Recharts progression timeline charts, polar domain grids, and printable completion certificates.
- [x] **Milestone 1: UI/UX Polish**: Responsive sidebar layout adjustments, unified focus ring controls, animated gradients, and profile completion cards.
- [x] **Milestone 2: Documentation**: Comprehensive specs, schema reference, system architecture diagrams, and B.Tech Project Report.
