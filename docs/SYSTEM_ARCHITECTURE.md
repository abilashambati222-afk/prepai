# PrepAI – System Architecture Specification (Final Spec)

## 1. Directory Structure Blueprint

PrepAI is structured as a decoupled, standard MERN system in JavaScript (ES6+). The folder layout is organized as follows:

```
prepai/ (Root)
│
├── scripts/                # Database seeders, deployment helpers, and utility scripts
├── assets/                 # Logo, favicon, Open Graph, and branding graphics
├── .github/                # GitHub Actions workflows, PR/Issue templates
│
├── docs/                   # Central system planning and architecture specifications
│   ├── SYSTEM_ARCHITECTURE.md   # Architectural designs and execution pipelines
│   ├── DEVELOPMENT_ROADMAP.md   # Milestones, phases, and developer tracks
│   ├── API_DOCUMENTATION.md     # Request/response interfaces and endpoint details
│   ├── DATABASE_DESIGN.md       # Mongoose schemas, document models, and relationships
│   ├── FEATURES.md              # Detailed platform module specifications
│   ├── CHANGELOG.md             # Version history and release tracking
│   ├── CONTRIBUTING.md          # PR templates, branching models, coding styling rules
│   └── UI_UX/                   # Wireframes, user flows, and design system documentations
│
├── frontend/               # React 19 Client SPA
│   ├── src/
│   │   ├── assets/         # App-specific static images, icons
│   │   ├── components/     # Atomic, reusable UI components (Buttons, Inputs, Cards)
│   │   ├── layouts/        # Page shell structures (DashboardLayout, AuthLayout)
│   │   ├── pages/          # Direct route landing views (DashboardPage, InterviewPage)
│   │   ├── routes/         # React Router configurations and page guards
│   │   ├── context/        # State managers (e.g. AuthContext)
│   │   ├── hooks/          # Reusable React custom hooks
│   │   ├── lib/            # Axios instance, local storage helper, token manager
│   │   ├── config/         # Navigation setups, API endpoints configurations
│   │   ├── styles/         # Global styles overrides, scrollbar styling, keyframes
│   │   ├── theme/          # Custom color profiles, typography, spacing HSL parameters
│   │   ├── services/       # Network API endpoint query mappings
│   │   ├── utils/          # Formatting helpers, time calculations
│   │   ├── constants/      # App properties, menu lists, state enums
│   │   ├── App.jsx         # Custom fluid navigation shell
│   │   └── main.jsx        # App DOM mount wrapper
│   └── package.json
│
├── backend/                # Node.js + Express.js API Server
│   ├── config/             # DB settings, environment loaders
│   ├── controllers/        # Request controllers handling business operations
│   ├── middleware/         # Security ratelimiters, auth parses, error boundaries
│   ├── models/             # Mongoose schemas
│   ├── routes/             # REST route routing mapping
│   ├── services/           # Decoupled business helpers (e.g. ATS parsing, email smtp)
│   ├── lib/                # Integrations (Gemini API SDK, Cloudinary, Email SMTP client)
│   ├── errors/             # Custom exception classes and definitions
│   ├── tests/              # Test suites
│   │   ├── unit/           # Unit tests
│   │   └── integration/    # API integration tests
│   ├── validators/         # Joi/Zod request validator configurations
│   ├── utils/              # Internal utilities and helpers
│   ├── uploads/            # Temporary file storage (User resumes, avatars)
│   ├── logs/               # Production runtime logs
│   ├── app.js              # Express app bootstrap
│   ├── server.js           # Server listen script
│   └── package.json
```

---

## 2. Decoupled MERN Scalability Strategy

This architecture supports high scalability, modularity, and reliable deployment:

*   **Decoupled Workspaces:** The frontend acts as a fully static SPA deployed via CDN (Vercel/Netlify). The backend runs inside containers (Docker on AWS ECS/App Runner). This allows independent scaling based on load (e.g., Express servers scale horizontally under high Gemini API request loads).
*   **Encapsulated Core Libraries (`lib/`):** Both frontend and backend isolate third-party clients (Axios, Gemini API client, Cloudinary file uploads) in a central `lib/` directory. This makes updating SDKs or swapping providers straightforward without breaking controllers or views.
*   **Centralized Exception System (`backend/errors/`)**: Defines custom error patterns (e.g. `UnauthorizedError`, `BadRequestError`, `NotFoundError`) that inherit from a base `AppError`. Centralized Express error-handling middleware intercepts these to standardise JSON error responses.
*   **Testing Coverage (`backend/tests/`)**: Subdivision into `unit/` and `integration/` ensures that low-level helpers (like parser engines) and controller APIs can be validated in isolation, accelerating CI/CD checks in `.github/`.
