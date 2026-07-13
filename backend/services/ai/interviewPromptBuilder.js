/**
 * Prompt builder for Phase 10: AI Interview Engine
 */

/**
 * Builds prompt for generating a set of interview questions
 */
exports.buildQuestionGenerationPrompt = (user, params) => {
  const { interviewType, company, role, difficulty, count = 5 } = params;

  // Extract candidate profile details
  const profileSkills = [
    ...(user.programmingLanguages || []),
    ...(user.frameworks || []),
    ...(user.databases || []),
    ...(user.tools || [])
  ];
  
  const resumeMetadata = user.resumeMetadata || {};
  const resumeParsed = resumeMetadata.parsedData || {};
  const resumeSkills = resumeParsed.skills || [];
  
  const candidateSkills = Array.from(new Set([
    ...profileSkills,
    ...resumeSkills
  ])).join(', ') || 'General Software Engineering stack';

  const projects = resumeParsed.projects || [];
  const projectsText = projects.map(p => {
    return `Title: ${p.title || p.name || 'Project'}\nTech: ${(p.techStack || p.technologies || []).join(', ')}\nDesc: ${p.description || ''}`;
  }).join('\n\n') || 'Not explicitly listed';

  const experience = resumeParsed.experience || [];
  const experienceText = experience.map(exp => {
    return `Role: ${exp.role || exp.title || ''}\nCompany: ${exp.company || ''}\nDuration: ${exp.duration || ''}\nDetails: ${exp.description || ''}`;
  }).join('\n\n') || 'Not explicitly listed';

  let prompt = `
  You are an expert AI Technical and HR Recruiter at leading technology firms.
  Your task is to generate a list of ${count} interview questions for a mock interview session.

  INTERVIEW SETTINGS:
  - Interview Type: ${interviewType}
  - Target Company: ${company || 'General Tech Company'}
  - Target Role: ${role || 'Software Engineer'}
  - Difficulty Level: ${difficulty || 'Medium'}

  CANDIDATE DETAILS:
  - Skills: ${candidateSkills}
  - Experience Level: ${user.experienceLevel}
  - Past Experience:
  ${experienceText}
  - Academic Profile: College: ${user.college || 'N/A'}, Degree: ${user.degree || 'N/A'}, CGPA: ${user.cgpa || 'N/A'}
  - Projects:
  ${projectsText}

  ROLE SPECIFIC REQUIREMENTS:
  Please generate questions that assess the candidate's alignment with their goals.
  `;

  if (interviewType === 'Resume Based Interview') {
    prompt += `
    Focus 100% on verifying the candidate's claims in their Resume. Ask deep conceptual and validation questions about their listed skills, experiences, certifications, education, and achievements.
    Examples: "Explain why you chose MongoDB for project X?", "Explain JWT Authentication implementation in your server."
    `;
  } else if (interviewType === 'Project Based Interview' || interviewType === 'Project Deep Dive') {
    prompt += `
    Focus 100% on a deep dive into the projects listed in the candidate's profile. Ask questions probing the architecture, database choices, authentication models, deployment pipelines, security considerations, performance bottlenecks, scalability options, challenges faced, and future improvement paths.
    `;
  } else if (interviewType === 'HR Interview') {
    prompt += `
    Focus on general human resource assessment questions. Probe self-introductions, personal strengths/weaknesses, teamwork ethics, leadership experiences, conflict resolution skills, Handling failures, achievements, career goals, salary expectations, relocation, and organizational alignment ("Why our company?").
    `;
  } else if (interviewType === 'Behavioral Interview') {
    prompt += `
    Focus on behavioral situations requiring storytelling. Tailor the questions to extract STAR responses (Situation, Task, Action, Result). Target decision making under pressure, conflict handling, and problem solving.
    `;
  } else if (interviewType === 'Coding Interview') {
    prompt += `
    Generate coding algorithm problems.
    For each question, return:
    1. A problem description
    2. Constraints
    3. Input/Output Examples
    4. Hints (at least 2)
    5. Expected Time and Space Complexity
    6. A reference solution in JavaScript/Python
    7. Standard test cases for validation
    `;
  } else {
    // Technical Interview
    prompt += `
    Focus on technical core concepts: programming language fundamentals, OOP paradigms, DBMS, Operating Systems, Computer Networks, System Design, Cloud Deployments, and DevOps tools.
    `;
  }

  prompt += `
  Return ONLY a structured JSON array matching this format:
  [
    {
      "questionText": "Question string?",
      "type": "${interviewType.toLowerCase().replace(' interview', '')}",
      "category": "Topic Category (e.g. System Design, Recursion, conflict resolution)",
      "constraints": ["For coding: constraint 1", "For coding: constraint 2"],
      "examples": [
        { "input": "input details", "output": "expected output", "explanation": "explanation string" }
      ],
      "hints": ["Hint 1", "Hint 2"],
      "expectedComplexity": "Time: O(N), Space: O(1)",
      "referenceSolution": "code string",
      "testCases": [
        { "input": "test input", "output": "expected output" }
      ]
    }
  ]
  Do not include markdown code blocks or explanations outside of the JSON array.
  `;

  return prompt;
};

/**
 * Builds prompt for evaluating a single candidate answer
 */
exports.buildAnswerEvaluationPrompt = (question, answerText, interviewType) => {
  let prompt = `
  You are an expert Interview Evaluator.
  Given the interview question and the candidate's answer, perform a semantic assessment of the response.
  You must rate the response across multiple sub-dimensions on a scale from 0 to 100.
  Do NOT calculate a final weighted score. The backend will compute the final weighted average.
  
  QUESTION DETAILS:
  - Text: ${question.questionText}
  - Category: ${question.category}
  - Expected type: ${question.type}
  ${question.referenceSolution ? `- Reference Solution: ${question.referenceSolution}` : ''}

  CANDIDATE'S SUBMITTED ANSWER:
  "${answerText}"

  EVALUATION INSTRUCTIONS:
  Evaluate the answer on the following 7 sub-metrics (score each 0 to 100):
  1. technicalAccuracy: How technically correct are the concepts stated? (Set to 0 if completely wrong or irrelevant)
  2. communication: How clear, fluent, and well-structured is the response?
  3. completeness: Does the answer address all parts of the question?
  4. confidence: Does the vocabulary and phrasing project certainty and expertise?
  5. keywords: Did the candidate mention critical industry terms, technologies, or architectures related to the question?
  6. professionalism: Is the tone polite, professional, and career-oriented?
  7. grammar: Are there grammatical errors or vocabulary slips?

  `;

  if (interviewType === 'Behavioral Interview') {
    prompt += `
    Since this is a Behavioral Interview, evaluate the story using the STAR format (Situation, Task, Action, Result).
    Break down what part of the response corresponds to S, T, A, and R, and map this inside the "starEvaluation" JSON keys:
    - "situation": Rationale/Situation identified
    - "task": Task described
    - "action": Action taken
    - "result": Result/Outcome described
    `;
  }

  prompt += `
  Return ONLY a structured JSON object matching this schema:
  {
    "technicalAccuracy": 85,
    "communication": 90,
    "completeness": 80,
    "confidence": 75,
    "keywords": 80,
    "professionalism": 95,
    "grammar": 90,
    "explanation": "Provide a detailed paragraph detailing what the user did well, where they made mistakes, and the semantic accuracy of their response.",
    "improvementSuggestions": [
      "Suggestion 1 to improve this answer",
      "Suggestion 2 to improve this answer"
    ],
    "starEvaluation": {
      "situation": "Details or N/A",
      "task": "Details or N/A",
      "action": "Details or N/A",
      "result": "Details or N/A"
    }
  }
  Do not include markdown code blocks or explanations outside of the JSON object.
  `;

  return prompt;
};
