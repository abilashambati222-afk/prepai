# PrepAI – Contributing Guidelines (Placeholder)

Thank you for contributing to PrepAI! Follow these instructions to maintain a scalable, secure, and clean codebase.

## 1. Branching & PR Guidelines
- Work should be done in individual feature branches named `feature/<module-name>`.
- Open a Pull Request targeting the `main` branch.
- Ensure all test suites inside `backend/tests/` and frontend builds pass cleanly before asking for reviews.

## 2. Coding Standards
- Maintain ES6+ JavaScript standard practices.
- Decouple third-party integrations (e.g. email SMTP, Gemini LLM SDK, Axios) in their corresponding `lib/` directory.
- Throw custom error structures defined inside `backend/errors/` to enforce unified error handler interceptors.

## 3. UI/UX & Designs
- Adhere to the established Tailwind CSS v4 variables in `frontend/src/styles/` and `frontend/src/theme/`.
- UI files and components should prioritize rich aesthetics, responsive design layouts, and Framer Motion micro-animations.
