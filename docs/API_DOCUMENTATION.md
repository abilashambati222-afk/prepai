# PrepAI – REST API Specifications

All endpoints are hosted relative to the base route `/api/v1`. Route endpoints marked with **[Protected]** require an HTTP request header containing a valid Bearer JWT:
`Authorization: Bearer <JWT_TOKEN>`

---

## 🔐 1. Authentication Services `/auth`

### Register User
* **URL**: `/auth/register`
* **Method**: `POST`
* **Access**: Public
* **Payload Request**:
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "data": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "60d01f...",
        "fullName": "Jane Doe",
        "email": "jane@example.com"
      }
    }
  }
  ```

### Login User
* **URL**: `/auth/login`
* **Method**: `POST`
* **Access**: Public
* **Payload Request**:
  ```json
  {
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "60d01f...",
        "fullName": "Jane Doe",
        "email": "jane@example.com"
      }
    }
  }
  ```

### Get Active User Context
* **URL**: `/auth/me`
* **Method**: `GET`
* **Access**: **[Protected]**
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "60d01f...",
        "fullName": "Jane Doe",
        "email": "jane@example.com",
        "isOnboarded": true
      }
    }
  }
  ```

---

## 👤 2. Profile & Onboarding Services `/profile`

### Update Onboarding / Profile Details
* **URL**: `/profile`
* **Method**: `PUT`
* **Access**: **[Protected]**
* **Payload Request**:
  ```json
  {
    "college": "State University",
    "degree": "B.Tech",
    "branch": "Computer Science",
    "graduationYear": 2026,
    "cgpa": 8.5,
    "targetRole": "Software Engineer",
    "experienceLevel": "Fresher",
    "targetCompany": "Google",
    "programmingLanguages": ["JavaScript", "Python"],
    "frameworks": ["React", "Express"],
    "databases": ["MongoDB"],
    "tools": ["Git", "Docker"],
    "github": "https://github.com/janedoe",
    "linkedin": "https://linkedin.com/in/janedoe"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Profile updated successfully.",
    "data": {
      "isOnboarded": true,
      "college": "State University",
      "targetRole": "Software Engineer"
    }
  }
  ```

---

## 📊 3. Dashboard Console `/dashboard`

### Retrieve User Stats Summary
* **URL**: `/dashboard`
* **Method**: `GET`
* **Access**: **[Protected]**
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "fullName": "Jane Doe",
        "email": "jane@example.com",
        "interviewCertificates": []
      },
      "completedInterviews": 4,
      "resumeStatus": "Parsed",
      "overallReadinessScore": 76
    }
  }
  ```

---

## 📄 4. Resume Analyzer Services `/resume`

### Upload Resume PDF
* **URL**: `/resume/upload`
* **Method**: `POST`
* **Access**: **[Protected]**
* **Payload Request**: `multipart/form-data` containing the key `resume` containing the PDF file.
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Resume uploaded successfully.",
    "data": {
      "resumeMetadata": {
        "originalFileName": "jane_doe_cv.pdf",
        "fileSize": 145020,
        "status": "Uploaded",
        "version": 1
      }
    }
  }
  ```

### Trigger Gemini AI ATS Parse
* **URL**: `/resume/parse`
* **Method**: `POST`
* **Access**: **[Protected]**
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Resume parsing initiated.",
    "data": {
      "parsingConfidence": 92,
      "extractedDetails": {
        "skills": ["JavaScript", "React", "Node.js"],
        "education": "B.Tech in Computer Science",
        "experience": "Intern at Tech Corp"
      }
    }
  }
  ```

---

## 📝 5. Job Description Alignment `/job-descriptions`

### Save Target Job Profile
* **URL**: `/job-descriptions`
* **Method**: `POST`
* **Access**: **[Protected]**
* **Payload Request**:
  ```json
  {
    "title": "Frontend Engineer",
    "company": "Google",
    "jobRole": "Software Engineer",
    "descriptionText": "Strong skills in React, Tailwind, and Webpack required."
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Job description profile saved.",
    "data": {
      "id": "60d03b...",
      "company": "Google",
      "title": "Frontend Engineer"
    }
  }
  ```

---

## 🎙️ 6. Mock Placements Simulator `/interview`

### Initialize Interview Session
* **URL**: `/interview/start`
* **Method**: `POST`
* **Access**: **[Protected]**
* **Payload Request**:
  ```json
  {
    "interviewType": "Technical Interview",
    "company": "Google",
    "role": "Software Engineer",
    "difficulty": "Medium"
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d04c...",
      "interviewType": "Technical Interview",
      "questions": [
        {
          "questionId": "q1",
          "questionText": "Explain the difference between Virtual DOM and Real DOM in React.",
          "category": "Frontend"
        }
      ]
    }
  }
  ```

### Submit Answer Response
* **URL**: `/interview/answer`
* **Method**: `POST`
* **Access**: **[Protected]**
* **Payload Request**:
  ```json
  {
    "interviewId": "60d04c...",
    "answerText": "The Virtual DOM is a lightweight in-memory representation of the Real DOM. React uses it to compute diffs before updating the UI...",
    "duration": 45
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "isCompleted": false,
      "feedback": {
        "score": 85,
        "technicalAccuracy": 90,
        "completeness": 80,
        "communication": 85,
        "confidence": 85,
        "explanation": "Great explanation. You covered reconciliation and DOM diffing perfectly.",
        "improvementSuggestions": ["Mention the Fiber architecture for bonus points."]
      }
    }
  }
  ```

### Download Session Plaintext Transcript
* **URL**: `/interview/:id/transcript`
* **Method**: `GET`
* **Access**: **[Protected]**
* **Success Response (200 OK)**: Plain text stream download (`.txt` file content containing full question-and-answer dialogue details).
