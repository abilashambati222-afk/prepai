# PrepAI – System Architecture & Data Flow

PrepAI is designed as a decoupled, standard MERN (MongoDB, Express, React, Node.js) system with pure JavaScript (ES6+). This architecture provides a clear separation of concerns, high modularity, and reliable scaling.

---

## 1. Component Architecture Topology

```mermaid
graph TB
    subgraph Client View Layer (React 19)
        A[Vite React SPA] --> B[Auth Pages / Guards]
        A --> C[Dashboard / Console]
        A --> D[Resume / ATS Parser]
        A --> E[Mock Placement Simulator]
        A --> F[Analytics & Certificates]
    end

    subgraph API Controller Layer (Express.js)
        B -->|JWT Token / Credentials| G[Auth Router]
        C -->|Secure Request| H[Dashboard Router]
        D -->|PDF Upload / Parse request| I[Resume Router]
        E -->|Initialize / Answer / End| J[Interview Router]
        F -->|Fetch stats / Print cert| K[Analytics Router]
    end

    subgraph Business Service Layer (Node.js)
        I -->|Parse Document File| L[Resume Parser Service]
        J -->|Construct Prompts| M[Gemini AI prompt builder]
        J -->|Evaluate Answers| N[AI Evaluation Engine]
        L -->|Analyze Skills| O[Gemini API Client]
        M -->|Send Context| O
        N -->|Verify Concepts| O
    end

    subgraph Persistent Storage Layer
        G -->|Save Credentials| P[(MongoDB Atlas)]
        H -->|Query Stats| P
        I -->|Save Extracted Details| P
        J -->|Save Sessions & Scores| P
        K -->|Query Charts & Certificates| P
    end
```

---

## 2. Dynamic Ingestion Pipelines

### A. Resume Upload & ATS Parsing Flow
```mermaid
sequenceDiagram
    participant Candidate
    participant SPA as Client SPA
    participant API as Express API
    participant Gem as Gemini AI Engine
    participant DB as MongoDB

    Candidate->>SPA: Selects PDF and clicks Upload
    SPA->>API: POST /api/v1/resume/upload (Multer multipart)
    API->>API: Saves temporary PDF file to backend/uploads/
    API->>DB: Saves Resume metadata (status: 'Uploaded')
    API-->>SPA: Returns Success (201 Created)
    
    Candidate->>SPA: Clicks "Initiate Parse Console"
    SPA->>API: POST /api/v1/resume/parse
    API->>API: Reads PDF buffer and extracts plain text
    API->>Gem: Sends extracted text with strict JSON template prompt
    Gem-->>API: Returns structured JSON (Skills, Education, Experience)
    API->>DB: Updates Resume metadata (status: 'Parsed', extractedDetails)
    API->>DB: Creates CareerSnapshot record
    API-->>SPA: Returns parsingConfidence & extractedDetails JSON
    SPA-->>Candidate: Renders Parsed Resume metrics & tables
```

### B. Mock Interview Lifecycle & Evaluation
```mermaid
sequenceDiagram
    participant Candidate
    participant SPA as Client SPA
    participant API as Express API
    participant Gem as Gemini AI Engine
    participant DB as MongoDB

    Candidate->>SPA: Selects Track (e.g. Technical) & Clicks Initialize
    SPA->>API: POST /api/v1/interview/start
    API->>Gem: Generates 5 personalized questions based on user target role & skills
    Gem-->>API: Returns 5-question structured array
    API->>DB: Saves Interview session (status: 'started', questions array)
    API-->>SPA: Returns first Question details
    
    Loop 5 times (for each question)
        Candidate->>SPA: Submits written response / speech transcript
        SPA->>API: POST /api/v1/interview/answer
        API->>Gem: Sends question, response, and scoring prompt criteria
        Gem-->>API: Returns score, accuracy, communication rating & feedback suggestions
        API->>DB: Updates questions.answer & questions.feedback in Interview schema
        API-->>SPA: Returns Evaluation feedback scorecard
        SPA-->>Candidate: Renders immediate response feedback
    end

    Candidate->>SPA: Reaches final step
    SPA->>API: POST /api/v1/interview/end
    API->>API: Aggregates category averages (Technical, Communication, Coding)
    API->>DB: Updates Interview session (status: 'completed', analytics summary)
    API-->>SPA: Returns Final Report data
    SPA-->>Candidate: Unlocks printable Completion Certificate if score >= 70%
```

---

## 3. Decoupled Workspace Scalability Strategy

PrepAI ensures that high-load operations (such as dynamic AI processing) do not block main application components:

*   **Static Asset Delivery:** The React 19 frontend is bundled via Vite and is optimized for zero-overhead static hosting on Content Delivery Networks (CDNs) like Vercel or Netlify.
*   **Encapsulated Integration APIs (`backend/lib/`):** Third-party API clients, including the Google Gemini AI SDK, email SMTP relays, and file upload systems, are quarantined inside dedicated library scripts. Swapping AI versions (e.g. upgrading to a newer Gemini flash/pro model) requires no changes to Express routers or controller bodies.
*   **Centralized Exception Middleware (`backend/errors/`):** App exceptions are managed via custom error subclasses (such as `UnauthorizedError`, `BadRequestError`, and `NotFoundError`) extending a base `AppError` class. A global Express error interceptor maps these to standardized JSON payloads, preventing application crashes.
