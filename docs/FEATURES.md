# PrepAI – Feature Specifications (Placeholder)

This document maps detailed feature parameters and user flows for future implementation phases.

## Core Feature Roadmap & Definitions

### 1. Authentication & Security
- **JWT Middleware**: Access/refresh token pattern using HTTP-only cookies.
- **Identity Model**: Encrypted passwords (`bcryptjs`) with verification protocols.

### 2. ATS Resume Analytics
- **Parser Service**: Extraction of text elements from multi-part PDF streams via Multer.
- **Scoring Pipeline**: Evaluates key metrics against customized software engineering placement criteria using Google Gemini.

### 3. Mock Interview Engine
- **Question Generation**: Dynamic, role-specific prompts tailored using Gemini models.
- **Speech-to-Text**: Captures user microphone data, converting speech to text for analysis.
- **Assessment**: Semantic critique grading answers based on accuracy, structure, and communication delivery.

### 4. Coding & MCQ Practice
- **Compiler Sandbox**: Code compilation against predefined test configurations.
- **MCQ Bank**: Instantly graded conceptual tests with step-by-step explanations.
