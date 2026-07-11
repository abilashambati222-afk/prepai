# PrepAI – Database Design & Schema Models (Placeholder)

This document is a placeholder for MongoDB Atlas database schemas and collection definitions. Relationships between user records, resumes, and interview evaluations will be designed here.

## Anticipated Collections

### 1. `users`
Represents platform members (candidates, administrators).
*   `_id` (ObjectId)
*   `name` (String)
*   `email` (String, Unique)
*   `password` (String, hashed with bcryptjs)
*   `role` (String: `user` | `admin`)
*   `createdAt` / `updatedAt`

### 2. `resumes`
Contains metadata and evaluation results for parsed resumes.
*   `_id` (ObjectId)
*   `userId` (ObjectId, Reference -> users)
*   `filePath` (String)
*   `atsScore` (Number)
*   `critique` (Object)
*   `createdAt`

### 3. `interviews`
Tracks interactive mock sessions and grading scores.
*   `_id` (ObjectId)
*   `userId` (ObjectId, Reference -> users)
*   `topic` (String)
*   `questions` (Array of objects containing question, answer response, rating score, and feedback)
*   `overallScore` (Number)
*   `createdAt`
