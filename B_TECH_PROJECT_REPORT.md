# B.Tech Graduation Project Report
## AI-Powered Career Preparation & Placement Simulator (PrepAI)

---

### Project Metadata
* **Project Title**: AI-Powered Career Preparation & Placement Simulator (PrepAI)
* **Candidate**: Candidate User
* **Degree**: Bachelor of Technology (B.Tech)
* **Branch**: Computer Science and Engineering
* **Host Institution**: Dept. of Computer Science & Engineering
* **Date of Submission**: July 2026

---

## 📑 TABLE OF CONTENTS
1. [Abstract](#-abstract)
2. [Chapter 1: Introduction](#-chapter-1-introduction)
3. [Chapter 2: Literature Survey & Problem Statement](#-chapter-2-literature-survey--problem-statement)
4. [Chapter 3: System Requirements & Specifications](#-chapter-3-system-requirements--specifications)
5. [Chapter 4: System Design & Methodology](#-chapter-4-system-design--methodology)
6. [Chapter 5: Implementation Details](#-chapter-5-implementation-details)
7. [Chapter 6: Results & Screenshots Analysis](#-chapter-6-results--screenshots-analysis)
8. [Chapter 7: Conclusion & Future Scope](#-chapter-7-conclusion--future-scope)

---

## 📝 ABSTRACT

Traditional placement preparation portals rely on static materials, generic test papers, and manual resume checks. These methods struggle to address individual skill gaps or provide interactive, real-time feedback. **PrepAI** is a cloud-based, AI-driven career preparation platform built on the MERN (MongoDB, Express, React, Node.js) stack that automates personalized placements training. 

By integrating Google Gemini models, PrepAI extracts candidate skills from PDF resumes, evaluates them against custom job descriptions to calculate ATS keyword matches, and generates realistic mock interview simulations (Technical, Behavioral, HR, Coding, Resume, and Project Deep-Dives). Responses are evaluated dynamically on correctness, completeness, clarity, and confidence. PrepAI visualizes user performance trends using interactive Recharts progress curves and issues digital, print-ready certificates for scores above 70%.

---

## 🏛️ CHAPTER 1: INTRODUCTION

### 1.1 Project Overview
PrepAI is a web platform designed to prepare students and professionals for technical placements. It integrates generative AI into the preparation loop, moving beyond simple mock tests to provide active, conversational placement training.

### 1.2 Objectives
* **Resume/ATS Analysis**: Parse PDF resumes to compute ATS compatibility scores and suggest keyword optimizations.
* **Dynamic Placement Simulation**: Conduct interactive, time-restricted interviews customized to target roles and companies.
* **Instant Evaluation**: Grade student answers across multiple criteria (technical accuracy, completeness, and clarity) with constructive feedback.
* **Visual Progress Tracking**: Map performance history and concept mastery using interactive dashboards.
* **Verified Credentials**: Issue secure completion certificates to validate placement readiness.

### 1.3 Scope of the Project
The platform is designed for university engineering students preparing for placements, bootcamps tracking candidate readiness, and job seekers aiming for roles at specific tech firms.

---

## 📖 CHAPTER 2: LITERATURE SURVEY & PROBLEM STATEMENT

### 2.1 Existing Systems & Gaps
* **Resume Review Portals**: Standard ATS tools check formatting but lack semantic understanding or role-based context.
* **Mock Interview Platforms**: Existing solutions are often static, expensive, or require manual grading by human mentors.
* **Practice Sandboxes**: Standard coding sandboxes grade code outputs but do not evaluate the architectural reasoning, situational context, or communication skills critical for system design and behavior rounds.

### 2.2 The PrepAI Solution
PrepAI addresses these gaps by using Google Gemini API to dynamically generate questions based on the candidate's profile. It also provides immediate semantic analysis of candidate answers, making personalized practice accessible at scale.

---

## 💻 CHAPTER 3: SYSTEM REQUIREMENTS & SPECIFICATIONS

### 3.1 Software Requirements
* **Operating System**: Windows / Linux / macOS
* **Runtime**: Node.js v20+
* **Database**: MongoDB (Local or Atlas)
* **Frontend Library**: React 19 (bundled with Vite)
* **AI Engine**: Google Gemini API SDK

### 3.2 System Stack Selection Rationale
* **MongoDB**: A document database that accommodates unstructured resume data, dynamic question schemas, and nested feedback records.
* **Express & Node.js**: Provides a lightweight backend server capable of handling asynchronous requests to the Gemini API.
* **React 19 & Vite**: Delivers a responsive SPA frontend with fast build and reload times.

---

## 🎨 CHAPTER 4: SYSTEM DESIGN & METHODOLOGY

### 4.1 System Block Architecture
PrepAI separates components into a decoupled structure to ensure scalability:
* **Presentation Layer**: React views, context states, and Recharts charts.
* **Application API Gateway**: Express routes protected by stateless JWT authentication middleware.
* **AI Service Layer**: Gemini prompt engines that structure prompt inputs and parse evaluation outputs into JSON.
* **Data Layer**: MongoDB collections representing users, interviews, and readiness analytics.

### 4.2 Data Model Relationships
The platform manages relationships through Mongoose schemas:
1. **User (1) ── (0..1) Career**: Integrates onboarding preferences and academic statistics.
2. **User (1) ── (0..*) Interview**: Tracks mock sessions, generated questions, and grades.
3. **User (1) ── (0..*) JobDescription**: Caches target roles, target companies, and job description texts.

---

## 🛠️ CHAPTER 5: IMPLEMENTATION DETAILS

### 5.1 Security & Session Management
PrepAI secures routes using stateless JSON Web Tokens (JWT). When a user registers or logs in, a JWT is signed on the backend and saved in the frontend's local storage. This token is attached to the `Authorization` header for subsequent requests.

### 5.2 Gemini Prompt Engineering & Output Formatting
The backend constructs strict prompt context templates to ensure the Gemini model returns clean, parseable JSON:

```javascript
const systemPrompt = `
  You are an expert technical recruiter. Evaluate the candidate's answer based on:
  - Technical Accuracy (0-100)
  - Completeness (0-100)
  - Communication & Clarity (0-100)
  
  Your response MUST strictly adhere to this JSON format:
  {
    "score": 85,
    "technicalAccuracy": 90,
    "completeness": 80,
    "communication": 85,
    "explanation": "Brief paragraph summarizing performance details.",
    "improvementSuggestions": ["Suggestion 1", "Suggestion 2"]
  }
`;
```

---

## 📈 CHAPTER 6: RESULTS & SCREENSHOTS ANALYSIS

### 6.1 Performance Analysis Results
* **ATS Score Gauge**: Matches candidate resumes against job description keywords, highlighting missing skills.
* **Timeline Progression**: The dashboard plots scores over time to show progression and skill acquisition.
* **Completion Certificate**: Students scoring $\ge$ 70% receive a verified certificate with a unique tracking ID, which is formatted for print.

---

## 🏁 CHAPTER 7: CONCLUSION & FUTURE SCOPE

### 7.1 Conclusion
PrepAI provides a scalable, automated alternative to traditional placement preparation. By combining resume analysis, job description matching, and real-time interview simulation, the platform offers structured, personalized training to help candidates build key technical and behavioral skills.

### 7.2 Future Work
* **Real-time Audio Processing**: Integrate WebRTC and text-to-speech engines to support voice-based mock interviews.
* **Code Sandbox Execution**: Add a secure execution container to run and validate candidate code during coding rounds.
* **Multi-tenant Dashboards**: Create dashboards for university administrators to monitor overall placement readiness metrics.
