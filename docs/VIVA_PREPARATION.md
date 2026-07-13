# Viva Preparation Q&A Guide (Milestone 8)

This document provides answers to technical and architectural questions commonly asked during academic defense panels and project presentations.

---

## 🙋 TECHNICAL QUESTIONS & ANSWERS

### Q1: How does user authentication work in PrepAI?
* **Answer**: Authentication in PrepAI uses a stateless **JSON Web Token (JWT)** mechanism:
  * **Registration & Login**: The candidate inputs credentials. The backend verifies the user and generates a signed JWT containing the user's ID and role (`backend/utils/jwt.js`).
  * **Password Storage**: Passwords are encrypted before database insertion using a pre-save Mongoose hook with **bcryptjs** salting.
  * **Request Authentication**: The client saves the token in local storage and sends it in the `Authorization` header (`Bearer <token>`) for protected routes.
  * **Session Validation**: The backend `protect` middleware extracts and verifies the token. If valid, the user's profile is attached to the request context (`req.user`).

---

### Q2: Can you explain the MongoDB schema design and relationships?
* **Answer**: PrepAI uses five collections, referencing objects by ObjectIDs to maintain schema relations:
  * **`users`**: Stores login credentials and onboarding preferences.
  * **`interviews`**: References `users` (`user: { type: ObjectId, ref: 'User' }`). Contains a sub-document array representing the generated questions, submitted answers, and category evaluations.
  * **`careers`**: References `users` and caches job description matches, skill gaps, roadmaps, and project recommendations.
  * **`careersnapshots`**: Tracks historical career scores over time for analytics plotting.
  * **`jobdescriptions`**: Stores custom target job profiles and descriptions.

---

### Q3: How is Express routing structured on the backend?
* **Answer**: Routing is modularized into feature-specific files inside `backend/routes/`:
  * **`authRoutes.js`**: Registration, login, and token check endpoints.
  * **`profileRoutes.js`**: Handles onboarding profile updates.
  * **`resumeRoutes.js`**: Ingests resume files and triggers ATS parsing.
  * **`interviewRoutes.js`**: Controls starting sessions, saving answers, and retrieving reports.
  * **`dashboardRoutes.js`**: Compiles dashboard statistics.
  * **`careerRoutes.js`**: Analyzes career readiness metrics.

---

### Q4: Explain the frontend React architecture.
* **Answer**: PrepAI's frontend is structured as a decoupled Single Page Application (SPA) using React 19 and Vite:
  * **Routing**: Managed by `react-router-dom` with route guards (`PrivateRoute` and `PublicRoute`) checking the JWT session context.
  * **Global State**: Administered via React Context Providers (e.g. `AuthContext` for credentials and `ToastContext` for feedback notifications).
  * **Visual Styling**: Built using **Tailwind CSS v4** with HSL tokens configured in `index.css` for consistent dark-theme colors.
  * **Visual Animations**: Powered by **Framer Motion** for smooth tab switches and card transitions.
  * **Charts & Gauges**: Implemented using **Recharts** wrappers that draw data from the user's career and interview stats.

---

### Q5: How does the Google Gemini AI integration and prompt engineering work?
* **Answer**: Integration is handled via the `@google/genai` or `google-generative-ai` SDK. To ensure reliable parsing, PrepAI uses structured prompt templates:
  * **Structured Instructions**: The system prompts instruct the model to behave as an expert recruiter or technical evaluator.
  * **Context Injection**: Candidate data (such as skills, experiences, and role details) is injected into the prompt context.
  * **JSON Response Enforcement**: The prompt instructs the model to return output matching a specific JSON schema. The backend then parses this response directly into database structures.

---

### Q6: How does the AI evaluation pipeline grade candidate responses?
* **Answer**:
  1. The candidate submits their answer (`POST /api/v1/interview/answer`).
  2. The controller sends the question and response to the evaluator service (`backend/services/interview/`).
  3. The service calls the Gemini API to analyze the response across multiple parameters:
     * **Technical Accuracy**: Verifies concepts and terminology.
     * **Completeness**: Checks if all parts of the question were answered.
     * **Clarity & Communication**: Evaluates vocabulary and professionalism.
     * **STAR Method Verification**: Evaluates situation, task, action, and result details for behavioral questions.
  4. The model returns score percentages for each parameter, along with feedback explanation text and specific improvement suggestions.
  5. The backend saves this feedback in the database and returns it to the client.

---

### Q7: How is the overall ATS score calculated?
* **Answer**: The ATS score is calculated semantically using the Gemini API. Rather than just checking for exact string matches, the AI compares the skills in the parsed resume against the requirements of the job description, categorizing gaps and identifying missing skills.

---

### Q8: What is the deployment architecture for PrepAI?
* **Answer**:
  * **Frontend Client**: The React 19 static bundle (`/dist` directory) is built via Vite and deployed to Vercel's global CDN.
  * **Backend API Server**: The Node.js Express server is deployed on Render, running continuously.
  * **Database**: MongoDB Atlas is utilized as a hosted cloud database with network whitelisting enabled for secure client access.
  * **Environmental Separation**: The frontend points to the Render domain using a Vercel environment variable (`VITE_API_URL`), while backend configuration parameters (such as the database connection string and Gemini keys) are stored securely in Render.
