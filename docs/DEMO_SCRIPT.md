# Live Demonstration Script (Milestone 7)

This document provides a minute-by-minute guide for an 8-to-10 minute presentation demonstrating PrepAI's key features.

---

## ⏱️ MINUTE-BY-MINUTE DEMONSTRATION WORKFLOW

```
  0:00                 1:30                 2:30                        5:30                        8:30          10:00
   ├─── Register/Login ───┼─── Onboarding Setup ───┼─── Resume & ATS Parser ───┼─── Mock Placements Simulator ───┼─── Analytics & Cert ───┤
```

### 1. Introduction & Authentication Flow (0:00 – 1:30)
* **Screen View**: Login Page (`/login`) & Register Page (`/register`).
* **Presenter Script**:
  > "Welcome. Today I will demonstrate **PrepAI**, an AI-driven platform built on the MERN stack designed to help candidates prepare for placement rounds. 
  > 
  > Let's start by creating a new account. Notice the responsive inputs and focus states as we register. Once registered, a JWT token is generated on the backend and saved in the client's local storage to secure the session."
* **User Actions**:
  1. Click **Create Account** to navigate to `/register`.
  2. Input name, email, and password.
  3. Click **Register** to log in and redirect to the onboarding step.

---

### 2. Candidate Onboarding (1:30 – 2:30)
* **Screen View**: Onboarding wizard page (`/onboarding`).
* **Presenter Script**:
  > "Before starting prep, candidates configure their profiles. They select academic branches, target dream companies, target roles (e.g. Software Engineer), skill sets, and daily practice targets. 
  > 
  > This onboarding process configures the prep dashboard and tailors the AI interview generator to the candidate's goals."
* **User Actions**:
  1. Input College, CGPA, target dream company, target role, and preferred difficulty.
  2. Enter skills (programming languages, frameworks, databases, tools).
  3. Click **Complete Profile** to redirect to the dashboard.

---

### 3. Resume Upload & ATS Parsing (2:30 – 4:00)
* **Screen View**: Resume Management page (`/resume`).
* **Presenter Script**:
  > "Now, we will upload a resume. I will drag and drop a PDF into the dropzone. 
  > 
  > The backend receives the file, extracts the text, and calls the Gemini API to parse the resume. The extracted details (Skills, Education, Experience) are then displayed on the console."
* **User Actions**:
  1. Click **Resume Analyzer** in the sidebar.
  2. Drag and drop a PDF resume into the upload zone.
  3. Watch the upload progress bar and wait for the parsing status to update.
  4. View the extracted structured details.

---

### 4. Job Description Matching & ATS Analysis (4:00 – 5:30)
* **Screen View**: AI Analyst tab in Resume Page (`/resume#analyst`).
* **Presenter Script**:
  > "To evaluate placement readiness, the candidate can enter a target job description. The AI compares the resume skills against the job requirements, calculating an ATS match percentage, identifying skill gaps, and recommending relevant study projects."
* **User Actions**:
  1. Paste a job description into the text area.
  2. Click **Analyze Placement Fit**.
  3. Review the ATS matching score gauge, identified skill gaps, and recommended projects.

---

### 5. Mock Interview Simulator (5:30 – 7:30)
* **Screen View**: Interview Setup (`/mock-interviews`) & Active Session (`/mock-interviews/session/:id`).
* **Presenter Script**:
  > "Let's start a mock interview. I will select a **Technical Interview** track with a Medium difficulty level. 
  > 
  > The AI generates a 5-question interview based on the candidate's profile. During the session, the candidate has a time limit to answer each question. We can also simulate voice input using speech transcription."
* **User Actions**:
  1. Click **Mock Interviews** in the sidebar, select **Technical Interview**, and click **Initialize**.
  2. Review the generated question.
  3. Type an answer, click **Start Speech** to simulate transcription, and submit.
  4. Review the immediate feedback score and explanation, then click **Next**.
  5. Complete the remaining questions.

---

### 6. Performance Reports & Digital Certificates (7:30 – 8:30)
* **Screen View**: Interview Report (`/mock-interviews/report/:id`) & Certificates (`/certificates`).
* **Presenter Script**:
  > "After submitting the final response, the session ends, and the backend aggregates the category scores. 
  > 
  > The report displays the overall score, question-by-question evaluations, and candidate transcripts. Because the score exceeded 70%, the candidate earns a print-ready certificate of completion."
* **User Actions**:
  1. Review the final report dashboard scores.
  2. Click **Print Certificate** or navigate to `/certificates` to view and print the credential.

---

### 7. Historical Analytics & Summary (8:30 – 10:00)
* **Screen View**: Dashboard Overview (`/`) & Analytics (`/analytics`).
* **Presenter Script**:
  > "The Analytics page tracks performance over time. Recharts Area charts display historical trends, while Radar charts map concept mastery. 
  > 
  > In conclusion, PrepAI provides an automated, AI-driven placement preparation loop to help candidates analyze resumes, align with job descriptions, and practice interviews. Thank you, and I welcome any questions."
* **User Actions**:
  1. Navigate to the **Analytics Console**.
  2. Highlight the Area, Radar, and Bar charts.
  3. Return to the main dashboard and log out to complete the demo.
