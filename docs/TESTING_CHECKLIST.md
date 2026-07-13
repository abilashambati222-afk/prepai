# End-to-End Testing Checklist

This checklist defines the validation scenarios required to test PrepAI's workflows.

---

## 🔐 1. AUTHENTICATION MODULE

- [ ] **User Registration**:
  - [ ] Submit registration form with valid parameters. Verify account creation and redirection.
  - [ ] Submit registration with an already-registered email. Verify error messaging.
  - [ ] Submit registration with invalid email format. Verify form validation errors.
- [ ] **User Login**:
  - [ ] Login with correct credentials. Verify JWT generation and storage in local storage.
  - [ ] Login with incorrect password. Verify "Invalid credentials" error response.
  - [ ] Login with non-existent email. Verify "User not found" error response.
- [ ] **Logout Flow**:
  - [ ] Click logout. Verify local storage token deletion and redirection to `/login`.
- [ ] **Route Protection**:
  - [ ] Attempt to access `/` or `/resume` directly without a token. Verify redirection to login.

---

## 📄 2. RESUME ANALYZER MODULE

- [ ] **PDF Upload & Ingestion**:
  - [ ] Drag and drop a valid PDF resume. Verify upload progress bar and metadata retrieval.
  - [ ] Attempt to upload a non-PDF file. Verify file-type error message.
  - [ ] Attempt to upload a PDF larger than 5MB. Verify size-limit warning.
- [ ] **Gemini ATS Parser**:
  - [ ] Click "Parse Resume". Verify parsing spinner and extraction output.
  - [ ] Review extracted structured fields (Skills, Education, Experience). Verify parsing confidence score.
- [ ] **Resume Replacement**:
  - [ ] Click "Replace". Upload a new PDF. Verify metadata update and version increment.
- [ ] **Resume Deletion**:
  - [ ] Click "Delete". Confirm deletion. Verify dropzone reset and database cleanup.

---

## 📝 3. JOB DESCRIPTION MODULE

- [ ] **Create Job Profile**:
  - [ ] Save a new Job Description profile (Title, Company, Description). Verify list update.
- [ ] **Compare & Align**:
  - [ ] Run comparison on saved Job Descriptions. Verify ATS compatibility match gauge calculations.
  - [ ] Verify display of identified skill gaps and recommended learning resources.
- [ ] **Job Deletion**:
  - [ ] Delete a saved job profile. Verify it is removed from the target list.

---

## 🎙️ 4. MOCK INTERVIEWS SIMULATOR

- [ ] **Interview Setup**:
  - [ ] Select interview track, target company, role, and difficulty. Click "Initialize".
  - [ ] Verify 5-question generation spinner.
- [ ] **Active Interview Loop**:
  - [ ] Verify timer starts countdown (120s limit).
  - [ ] Input written response and submit. Verify immediate scorecard feedback.
  - [ ] Verify speech simulation: Click mic, confirm transcription simulation, and submit response.
  - [ ] Verify auto-submission when timer reaches 0s.
- [ ] **Final Report**:
  - [ ] Submit the 5th answer. Verify redirection to final report page.
  - [ ] Verify aggregated scoring metrics (Technical, HR, Communication) and question-by-question expand/collapse accordions.
- [ ] **Completion Certificates**:
  - [ ] If overall score is $\ge$ 70%, verify "Download Certificate" button is visible.
  - [ ] Click certificate. Verify printable layout contains unique ID, score, and user name.
  - [ ] If score is < 70%, verify certificate is locked.

---

## 📊 5. DASHBOARD & ANALYTICS MODULES

- [ ] **Metrics Dashboard**:
  - [ ] Verify metrics (completed interviews count, resume status, overall readiness index) load dynamically.
  - [ ] Verify "Mock Interviews" card is clickable and navigates to the setup page.
- [ ] **Analytics Console**:
  - [ ] Verify Recharts Area Chart plots score trends.
  - [ ] Verify Radar Chart renders concept mastery.
  - [ ] Verify Bar Chart shows category-specific averages.

---

## 🎨 6. UI/UX & RESPONSIBILITY CHECKS

- [ ] **Responsive Layouts**:
  - [ ] Test views on Mobile (375px), Tablet (768px), and Desktop (1024px+). Verify sidebar responsiveness and layout folding.
- [ ] **Focus Rings**:
  - [ ] Select input fields and buttons. Verify that the `.focus-ring` styling displays correctly.
- [ ] **Loading & Empty States**:
  - [ ] Verify spinners display when API calls are loading.
  - [ ] Verify empty states display when no resumes or job descriptions are uploaded.
