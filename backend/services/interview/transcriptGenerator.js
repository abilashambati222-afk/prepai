/**
 * Formats full interview Q&A history as a clear readable transcript
 */
exports.generateTranscript = (session) => {
  let text = `==================================================\n`;
  text += `PREPAI INTERVIEW TRANSCRIPT\n`;
  text += `==================================================\n`;
  text += `Interview ID: ${session._id}\n`;
  text += `Type: ${session.interviewType}\n`;
  text += `Target Company: ${session.company || 'N/A'}\n`;
  text += `Target Role: ${session.role || 'N/A'}\n`;
  text += `Difficulty: ${session.difficulty}\n`;
  text += `Overall Score: ${session.analytics?.overallScore || 0}%\n`;
  text += `Duration: ${Math.round(session.duration / 60)} minutes\n`;
  text += `Date: ${new Date(session.createdAt).toLocaleString()}\n`;
  text += `==================================================\n\n`;

  (session.questions || []).forEach((q, idx) => {
    text += `[QUESTION ${idx + 1}] (${q.category})\n`;
    text += `Interviewer: ${q.questionText}\n\n`;
    text += `Candidate: ${q.answer?.answerText || '[No Answer Submitted]'}\n\n`;
    if (q.feedback) {
      text += `Feedback Score: ${q.feedback.score}%\n`;
      text += `Feedback Rationale: ${q.feedback.explanation || ''}\n`;
    }
    text += `--------------------------------------------------\n\n`;
  });

  return text;
};
