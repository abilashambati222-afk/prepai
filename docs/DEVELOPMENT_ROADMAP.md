# PrepAI – Technical Development Roadmap (Refined)

This document outlines the evolutionary milestones required to build, secure, scale, and launch the PrepAI platform.

---

## Phase 1: Core System Initialization (Current)
*   **Infrastructure:** Decoupled frontend/backend workspaces, scripts layout, custom error directories, test configuration folders.
*   **Backend:** Express routing architecture and database connection wrappers mapped.
*   **Frontend:** React 19 shell layout, Tailwind CSS v4 custom theme styles, navigation structures.

---

## Phase 2: Identity & Session Management
*   **Backend:**
    *   Mongoose `User` schemas with `bcryptjs` password hashing.
    *   JWT authentication routes (Register, Login, Token Refresh, Logout).
    *   RBAC middleware supporting Roles (`user`, `admin`).
    *   Test suites verifying login/signup transactions.
*   **Frontend:**
    *   Authentication screens (Login, Registration, Password Reset).
    *   State providers using Context API (`AuthContext`) and session persistence.
    *   Protected route guards for student dashboard features.

---

## Phase 3: Resume Ingestion & ATS Parsing (Gemini AI)
*   **Backend:**
    *   `Multer` file system handlers to ingest PDF resumes.
    *   Google Gemini API middleware integration for semantic text extraction.
    *   ATS scoring module evaluating keyword densities, structural omissions, and styling benchmarks.
*   **Frontend:**
    *   Drag-and-drop resume upload portal using `react-hook-form`.
    *   Visual ATS Score dials (Recharts radial bars) with dynamic critique summaries.

---

## Phase 4: AI Mock Interview Engine & Coding Sandboxes
*   **Backend:**
    *   AI prompt builder that crafts role-specific behavioral/technical question pools using Gemini.
    *   Speech-to-text response ingestion endpoints.
    *   AI grading service evaluating response completeness, clarity, and structural grammar.
*   **Frontend:**
    *   Audio recorder component with wave animations (Framer Motion).
    *   Mock interview simulator panel showcasing questions, timers, and webcam/audio feeds.
    *   Coding Practice: Monaco editor or text area code input mapped to an API compiler runtime sandbox.

---

## Phase 5: Platform Analytics & Admin Management
*   **Backend:**
    *   Aggregate performance metrics reporting weak and strong concepts.
    *   Admin moderation routes to manage company question bank repositories.
*   **Frontend:**
    *   Full progress dashboard displaying interactive analytics (Recharts bar, line, and area graphs).
    *   Admin dashboard showing platform analytics, database health, and system traffic.
