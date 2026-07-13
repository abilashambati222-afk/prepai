# Presentation Slides Outline (Milestone 6)

This document provides a slide-by-slide structure and outline for a 15–20 slide PowerPoint presentation for academic or professional evaluation.

---

## 📽️ SLIDE OUTLINE PLAN

### Slide 1: Title & Overview
* **Title**: PrepAI – AI-Powered Placement Prep & Mock Interview Simulator
* **Subtitle**: A Decoupled Cloud Platform for Semantic Resume Auditing and Conversational Evaluation
* **Content**:
  * Presenter Names & Credentials.
  * Project Domain: Artificial Intelligence in Career Development.
  * Key Pitch: Moving from static tests to active AI-driven placement preparation.

### Slide 2: Problem Statement
* **Title**: The Placement Preparation Gap
* **Content**:
  * **Static Resources**: Practice portals rely on outdated, non-personalized questions.
  * **Resume Parsing Gaps**: Keyword filters fail to measure actual semantic match or target job relevance.
  * **High Assessment Costs**: Dynamic mock interviews with human reviewers are expensive and hard to scale.
  * **Lack of Performance Analytics**: Candidates don't get detailed feedback on their weak concepts.

### Slide 3: Objectives & Scope
* **Title**: Project Goals & Scope
* **Content**:
  * **ATS Auditing**: Extract candidate skills from resumes and compare them against target job descriptions.
  * **Mock Placement Simulator**: Conduct interactive sessions across technical, behavioral, HR, and coding tracks.
  * **Instant Evaluations**: Grade candidate answers on correctness, completeness, and clarity.
  * **Performance Progressions**: Track concept mastery and historical scores.
  * **Verified Credentials**: Issue certificates for verified scores above 70%.

### Slide 4: Current Systems vs. Proposed PrepAI
* **Title**: Competitive Review
* **Content**:
  * **Traditional Systems**: Multiple Choice Questions (MCQ) only, static resume reviews, manual grading.
  * **PrepAI Features**:
    * Generative questions based on candidate profiles and target roles.
    * Real-time semantic analysis of written responses.
    * Multi-parameter scoring (Clarity, Completeness, Accuracy).
    * Dynamic, print-ready certificates of completion.

### Slide 5: System Stack & Technology Selection
* **Title**: Decoupled Technology Stack
* **Content**:
  * **Frontend**: React 19 SPA, Tailwind CSS v4, Vite, Framer Motion, Recharts.
  * **Backend**: Node.js, Express.js API Gateway, JWT security.
  * **Database**: MongoDB Atlas cloud document store (Mongoose ODM).
  * **AI Integration**: Google Gemini API SDK.
  * **Deployment**: Frontend served via Vercel, Backend running on Render.

### Slide 6: Component Flow & Block Diagram
* **Title**: System Component Architecture
* **Content**:
  * Block diagram mapping the decoupled architecture:
    * **Client Layer**: React 19 SPA, State Context Providers.
    * **API Routing Layer**: Express JWT routers.
    * **AI Service Layer**: Gemini prompt builders and response parsers.
    * **Persistent Storage**: MongoDB collections.

### Slide 7: Database Design (Entity Relationships)
* **Title**: MongoDB Schema Architecture
* **Content**:
  * Entity Relationships:
    * `User` (1) ── (0..1) `Career` (Contains roadmap & weekly targets)
    * `User` (1) ── (0..*) `Interview` (Contains questions, answers, and feedback)
    * `User` (1) ── (0..*) `JobDescription` (For resume alignment analysis)
    * `Career` (1) ── (1..*) `CareerSnapshot` (For historical progression charting)

### Slide 8: User Registration & Session Security (JWT Flow)
* **Title**: Stateless Session Security
* **Content**:
  * **Registration**: Salted password hashing (bcryptjs) on the user schema pre-save hook.
  * **Authentication**: Stateless session management via JWT.
  * **Middlewares**: `protect` middleware extracts the Bearer token, decodes the signature, and injects user context into incoming requests.

### Slide 9: Candidate Onboarding Module
* **Title**: Customizing the Preparation Track
* **Content**:
  * Custom inputs to collect target roles, target companies, skills, and timeline goals.
  * Links profile setup directly to the dashboard, showing the user's current progress toward their targets.

### Slide 10: Resume Ingestion & ATS Parsing Engine
* **Title**: AI-Powered Resume Parsing
* **Content**:
  * Multer ingestion stores PDF resumes.
  * Extract plain text from PDF buffers.
  * Sends text to Gemini to parse structured details (Skills, Education, Experience).
  * Generates an initial parsing confidence index based on formatting.

### Slide 11: Job Description Match Analysis
* **Title**: Target Job Description Alignment
* **Content**:
  * Compares parsed resume credentials against specific job descriptions.
  * Identifies critical and optional skill gaps.
  * Recommends specific projects and resources to address identified gaps.

### Slide 12: Mock Interview Simulator Loop
* **Title**: Interactive Simulation Lifecycle
* **Content**:
  * Tracks: HR, Technical, Behavioral, Coding, Resume, and Project Deep-Dives.
  * Generates a 5-question session customized to the user's target profile.
  * Implements time limits per question with automatic submission on timeout.

### Slide 13: Real-Time Speech Input Processing
* **Title**: Audio Speech Transcription
* **Content**:
  * Real-time mic speech simulation.
  * Evaluates spoken answers using the same criteria as written submissions.

### Slide 14: AI Performance Evaluation Criteria
* **Title**: Semantic Scoring Model
* **Content**:
  * Graded across multiple parameters:
    * **Technical Accuracy**: Verifies core concepts and terminology.
    * **Completeness**: Checks if all parts of the question were answered.
    * **Clarity & Communication**: Evaluates vocabulary and professionalism.
    * **STAR Method Verification**: Evaluates situation, task, action, and result details for behavioral questions.

### Slide 15: Progress Charts & Concept Analytics
* **Title**: Analytics Dashboard
* **Content**:
  * Recharts Area Chart plots overall score history.
  * Radar Chart visualizes concept mastery across subject areas.
  * Bar Charts show category-wise performance.

### Slide 16: Verification & Completion Credentials
* **Title**: Digital Placements Verification
* **Content**:
  * Generates digital certificates for sessions scoring $\ge$ 70%.
  * Assigns unique tracking IDs.
  * Formats certificates for print and download.

### Slide 17: Project Deployed Infrastructure
* **Title**: Production Cloud Infrastructure
* **Content**:
  * **Client hosting**: Vite static bundle served globally on Vercel edge networks.
  * **Server hosting**: Express API running on Render.
  * **Database hosting**: MongoDB Atlas shared cluster.

### Slide 18: Summary, Conclusions & Future Extensions
* **Title**: Project Summary & Future Scope
* **Content**:
  * **Summary**: Built an automated, AI-driven placement preparation platform.
  * **Future Scope**:
    * Integrate real-time audio analysis.
    * Add a secure sandbox to run and test candidate code.
    * Create dashboards for university administrators to monitor overall class readiness.
