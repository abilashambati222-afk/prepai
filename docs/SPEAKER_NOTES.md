# Presentation Speaker Notes (Milestone 4)

This document provides slide-by-slide speaker notes designed to accompany the 18-slide presentation outline in `docs/PRESENTATION_STRUCTURE.md`. Each slide note is structured for a 30-to-60 second explanation.

---

### Slide 1: Title & Overview
> "Good morning, respected members of the evaluation panel. Today, I am pleased to present **PrepAI**, an AI-powered placement preparation and mock interview simulator. 
> 
> Our platform addresses a critical challenge in career development: moving from static study guides to active, personalized placement training. By utilizing a decoupled MERN stack and integrating Google Gemini AI, we have built a semantic resume auditor and conversational mock placement engine that offers dynamic, real-time feedback."

---

### Slide 2: Problem Statement
> "Let's first understand the core problem. Traditional preparation systems are passive. They rely on fixed MCQs or generic questions that fail to assess a candidate's actual conversational readiness. 
> 
> Furthermore, current ATS resume checkers match exact keyword strings rather than evaluating semantic alignment against a target job description. This creates a gap where candidates lack detailed feedback on their weaknesses before entering actual interviews."

---

### Slide 3: Objectives & Scope
> "To address these gaps, our project has four primary objectives:
> 1. To parse PDF resumes and extract candidate credentials.
> 2. To dynamically analyze skills against target job description requirements.
> 3. To run interactive mock placement interviews using technical, behavioral, and coding tracks.
> 4. To evaluate candidate answers in real-time, mapping performance progression on interactive dashboards and issuing verified credentials for high performance."

---

### Slide 4: Current Systems vs. Proposed PrepAI
> "A comparison highlights the advantages of our proposed system. While existing portals offer static questions and manual grading, PrepAI introduces dynamic, profile-based question generation. 
> 
> It provides immediate semantic scoring of written responses across multiple criteria, including accuracy, completeness, and clarity. It also supports simulated voice transcription and automated PDF certificate generation."

---

### Slide 5: System Stack & Technology Selection
> "Our architecture is built on a modern MERN stack. We selected Vite React 19 for a fast, responsive Single Page Application frontend. The backend runs on Node.js and Express.js, providing an API gateway. 
> 
> We utilize MongoDB Atlas as a cloud document database to handle flexible schemas for career roadmaps and session logs. The Google Gemini API serves as our AI engine."

---

### Slide 6: Component Flow & Block Diagram
> "Here, we see our component topology. The architecture is decoupled:
> - The **Client View Layer** manages navigation and states.
> - The **Express Routing Layer** enforces JWT security and routes requests.
> - The **AI Service Layer** handles prompt construction and compiles responses.
> - The **Persistent Storage Layer** stores credentials, session histories, and certifications."

---

### Slide 7: Database Design (Entity Relationships)
> "Our MongoDB collection relationships are designed for consistency and flexibility. The `User` collection sits at the center. It has a one-to-one relationship with the `Career` collection, which holds the roadmap details and company matching records. 
> 
> The `User` collection also has one-to-many relationships with both the `Interview` and the `JobDescription` collections. This supports detailed history tracking and job description caching."

---

### Slide 8: User Registration & Session Security (JWT Flow)
> "Security is a core requirement of the platform. We utilize stateless **JSON Web Tokens (JWT)** for session management. Passwords are encrypted before database insertion using a pre-save Mongoose hook with **bcryptjs** salting. 
> 
> Incoming protected API requests pass through our `protect` middleware, which verifies the token signature and attaches user context."

---

### Slide 9: Candidate Onboarding Module
> "Onboarding is the starting point for personalization. Candidates input their education, CGPA, target dream companies, target roles, skill sets, and daily practice targets. 
> 
> This onboarding configuration populates the user's dashboard and provides the necessary context for the AI mock interview engine."

---

### Slide 10: Resume Ingestion & ATS Parsing Engine
> "For resume analysis, candidates upload a PDF. Our backend processes the PDF buffer, extracts the plain text, and calls the Gemini API to parse the resume. 
> 
> The AI returns a structured JSON object containing parsed skills, education, and experiences. The system also calculates a parsing confidence score based on formatting layout indicators."

---

### Slide 11: Job Description Match Analysis
> "Once parsed, candidates can align their profile with target job descriptions. The AI compares their resume against the job requirements, calculating an overall ATS match score. 
> 
> It lists critical skill gaps, recommends specific projects to address those gaps, and suggests tailored learning resources."

---

### Slide 12: Mock Interview Simulator Loop
> "The Mock Interview Simulator conducts 5-question mock interviews across several tracks, including Technical, Behavioral, HR, and Coding. 
> 
> The questions are generated dynamically using the candidate's target role and skills. Each question has a time limit, and responses are auto-submitted on timeout."

---

### Slide 13: Real-Time Speech Input Processing
> "To simulate spoken interviews, candidates can use voice input. The frontend supports mic input simulation, transcribing speech in real-time. 
> 
> This transcript is submitted to the backend and evaluated using the same semantic scoring models as typed inputs."

---

### Slide 14: AI Performance Evaluation Criteria
> "Our evaluation pipeline grades responses across four key parameters:
> - **Technical Accuracy**: Verifies core concepts and terminology.
> - **Completeness**: Checks if all parts of the question were answered.
> - **Clarity & Communication**: Evaluates vocabulary and professionalism.
> - **STAR Method Verification**: Evaluates situation, task, action, and result details for behavioral questions."

---

### Slide 15: Progress Charts & Concept Analytics
> "The dashboard visualizes candidate performance history. We use Recharts Area charts to plot overall score trends. 
> 
> A Radar chart maps concept mastery across subject areas, and Bar charts show category-specific ratings (Technical, HR, Coding)."

---

### Slide 16: Verification & Completion Credentials
> "To validate placement readiness, candidates scoring $\ge$ 70% earn a digital certificate of completion. 
> 
> Each certificate is assigned a unique verification tracking ID and is formatted for clean printing and download."

---

### Slide 17: Project Deployed Infrastructure
> "For production hosting, we use a decoupled cloud infrastructure:
> - The React frontend is served via Vercel's global edge network.
> - The Node.js Express server is hosted on Render.
> - The database runs on MongoDB Atlas.
> - Environment variables secure connection strings, JWT secrets, and API keys."

---

### Slide 18: Summary, Conclusions & Future Extensions
> "In summary, PrepAI offers a scalable, automated alternative to traditional placement preparation. 
> 
> For future work, we plan to integrate real-time audio analysis, add a secure execution sandbox for coding questions, and build admin dashboards for universities to track overall placement metrics. Thank you, and I welcome any questions."
