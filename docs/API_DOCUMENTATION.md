# PrepAI – REST API Specification (Placeholder)

This document is a placeholder for the REST API endpoint design. When implemented, it will document request and response schemas, authentications, and error states for PrepAI's backend.

## Anticipated Endpoint Routes

### 1. Authentication Services (`/api/v1/auth`)
*   `POST /register` — Initialize new user accounts.
*   `POST /login` — Verify credentials and return active JWT credentials.
*   `POST /logout` — Terminate session.

### 2. Resume Services (`/api/v1/resumes`)
*   `POST /upload` — Ingest PDF resumes (via Multer).
*   `GET /critique/:id` — Retrieve generated ATS scoring and Gemini critique.

### 3. Interview simulator (`/api/v1/interviews`)
*   `POST /generate` — Create interview questions based on job description.
*   `POST /evaluate/:questionId` — Submit audio transcription/text response for AI evaluation.
