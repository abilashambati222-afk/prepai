import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import {
  Sparkles,
  ChevronRight,
  Send,
  MessageSquare,
  Clock,
  Mic,
  AlertCircle,
  HelpCircle,
  Code2,
  XCircle,
  ArrowRight,
  Play,
  RotateCcw
} from 'lucide-react';

export default function InterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  
  // Timers and evaluation states
  const [timeLeft, setTimeLeft] = useState(120); // 120s limit per question
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState('');

  // Voice UI animation
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/interview/session/${id}`);
        if (res.data?.success) {
          const s = res.data.data;
          setSession(s);
          
          // Find first unanswered question index
          const idx = s.questions.findIndex(q => !q.answer || !q.answer.answerText);
          setCurrentIdx(idx >= 0 ? idx : s.questions.length - 1);
          if (idx === -1) {
            setIsDone(true);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to retrieve interview details.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  // Countdown timer effect
  useEffect(() => {
    if (loading || submitting || feedback || isDone) return;

    if (timeLeft <= 0) {
      handleSubmitAnswer(); // Auto-submit on timeout
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, loading, submitting, feedback, isDone]);

  const handleSubmitAnswer = async () => {
    if (!answer.trim() && timeLeft > 0) return;
    
    setSubmitting(true);
    setError('');
    const timeSpent = 120 - timeLeft;

    try {
      const response = await api.post('/interview/answer', {
        interviewId: id,
        answerText: answer || '[Time limit exceeded - No answer provided]',
        duration: timeSpent
      });

      if (response.data?.success) {
        const result = response.data.data;
        setFeedback(result.feedback);
        setIsDone(result.isCompleted);
      }
    } catch (err) {
      console.error(err);
      setError('Evaluation server error. Failed to save response.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setAnswer('');
    setTimeLeft(120);
    if (isDone) {
      navigate(`/mock-interviews/report/${id}`);
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const toggleMockSpeech = () => {
    setIsListening(prev => !prev);
    if (!isListening) {
      setAnswer(prev => prev ? prev + " Speech input simulated." : "Speech input simulated.");
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400 text-xs animate-pulse">
        <Sparkles className="w-5 h-5 animate-spin mr-2" />
        Configuring interview environment...
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-6 rounded-2xl max-w-md mx-auto text-center space-y-4">
        <XCircle className="w-12 h-12 text-brand-error mx-auto" />
        <h3 className="font-extrabold text-white text-base">Error Initializing Session</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
        <button onClick={() => navigate('/mock-interviews')} className="px-5 py-2.5 bg-brand-primary rounded-xl text-xs font-bold text-white">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const q = session.questions[currentIdx];
  const progressPercent = ((currentIdx) / session.questions.length) * 100;

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full">
      {/* 1. Header Progress bar */}
      <div className="glass-panel p-4 rounded-xl flex items-center justify-between border-brand-border/40 gap-4">
        <div className="flex items-center gap-2 text-xs">
          <Clock className="w-4 h-4 text-brand-secondary" />
          <span className="font-bold text-slate-300 uppercase tracking-wider">{session.interviewType}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 font-semibold">{session.role} at {session.company || 'Global Tech'}</span>
        </div>

        <div className="flex-1 max-w-xs space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Progress: {currentIdx + 1} / {session.questions.length}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-brand-dark rounded-full h-1.5 overflow-hidden">
            <div className="bg-brand-primary h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Virtual Interviewer Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-between min-h-[350px] relative overflow-hidden">
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[9px] font-black uppercase tracking-wider">
            Interviewer Panel
          </div>

          {/* Time Limit Countdown */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <Clock className="w-4 h-4 text-brand-warning animate-pulse" />
            <span className={timeLeft < 20 ? 'text-brand-error font-black animate-pulse' : ''}>{timeLeft}s</span>
          </div>

          <div className="my-auto space-y-6 text-center w-full">
            {/* Avatar representation */}
            <div className="relative w-24 h-24 rounded-full bg-brand-dark border-2 border-brand-border flex items-center justify-center mx-auto shadow-inner">
              <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary opacity-15 blur-sm" />
              <MessageSquare className="w-10 h-10 text-brand-primary" />
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-white">Virtual Interviewer</h4>
              <p className="text-[10px] text-brand-secondary font-bold uppercase tracking-wider">AI Placement engine</p>
            </div>

            {/* Speaking Wave Animation */}
            <div className="h-6 flex items-center justify-center gap-1.5">
              {!feedback && !submitting && !isListening ? (
                <span className="text-[10px] text-slate-500 italic">Waiting for your response...</span>
              ) : isListening ? (
                [...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-4 bg-brand-secondary rounded-full"
                    animate={{ height: [4, 16, 4] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                  />
                ))
              ) : submitting ? (
                <span className="text-[10px] text-brand-warning animate-pulse">Evaluating answer...</span>
              ) : (
                <span className="text-[10px] text-brand-success font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-ping" />
                  Answer Evaluated
                </span>
              )}
            </div>
          </div>

          <div className="w-full text-center text-[10px] text-slate-500 pt-4 border-t border-brand-border/40">
            Click 'Start Speech' to simulate voice transcription.
          </div>
        </div>

        {/* Right: Question and Submission Terminal */}
        <div className="lg:col-span-2 flex flex-col justify-between min-h-[400px]">
          <AnimatePresence mode="wait">
            {!feedback ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                {/* Question Details */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-brand-border/40 pb-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-white/5 border border-brand-border px-2 py-0.5 rounded">
                      Topic: {q.category || 'General'}
                    </span>
                    {q.type === 'coding' && (
                      <span className="text-[10px] text-brand-success font-bold flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5" />
                        Coding Sandbox
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-extrabold text-white leading-relaxed">{q.questionText}</h2>
                  
                  {/* Hints and constraints for coding */}
                  {q.type === 'coding' && (
                    <div className="space-y-3 p-4 bg-brand-dark/60 border border-brand-border/40 rounded-xl text-[11px] text-slate-400">
                      {q.constraints && q.constraints.length > 0 && (
                        <div>
                          <strong className="text-white">Constraints:</strong>
                          <ul className="list-disc list-inside mt-1 font-mono">
                            {q.constraints.map((c, i) => <li key={i}>{c}</li>)}
                          </ul>
                        </div>
                      )}
                      {q.hints && q.hints.length > 0 && (
                        <div className="mt-2.5">
                          <strong className="text-brand-secondary">Hint:</strong>
                          <p className="mt-1">{q.hints[0]}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Answer Box */}
                <div className="space-y-3">
                  <div className="relative">
                    <textarea
                      value={answer}
                      onChange={e => setAnswer(e.target.value)}
                      placeholder={q.type === 'coding' ? "Write your code block or function here..." : "Type your answer details here..."}
                      className="w-full h-44 p-4 bg-brand-card/90 rounded-2xl border border-brand-border/60 text-xs text-white placeholder-slate-500 focus-ring transition-all font-sans resize-none"
                    />

                    {/* Speech / Mic simulate button */}
                    <button
                      onClick={toggleMockSpeech}
                      className={`absolute bottom-4 right-4 p-2.5 rounded-full border transition-all cursor-pointer ${
                        isListening
                          ? 'bg-brand-error text-white border-brand-error animate-pulse'
                          : 'bg-brand-dark text-slate-400 border-brand-border hover:bg-white/5'
                      }`}
                      title="Simulate Voice Input"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">
                      Ensure your response is clear and covers required concepts.
                    </span>
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={submitting || (!answer.trim() && timeLeft > 0)}
                      className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {submitting ? 'Analyzing...' : 'Submit Answer'}
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                {/* Score results card */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
                    <span className="text-[10px] font-bold text-brand-success uppercase tracking-wider bg-brand-success/15 border border-brand-success/20 px-2.5 py-0.5 rounded-full">
                      Answer Score: {feedback.score}%
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Concept feedback</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-1 text-center">
                    <div className="p-3 bg-white/2 border border-brand-border/30 rounded-xl">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Accuracy</span>
                      <span className="text-sm font-black text-white">{feedback.technicalAccuracy}%</span>
                    </div>
                    <div className="p-3 bg-white/2 border border-brand-border/30 rounded-xl">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Completeness</span>
                      <span className="text-sm font-black text-white">{feedback.completeness}%</span>
                    </div>
                    <div className="p-3 bg-white/2 border border-brand-border/30 rounded-xl">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Clarity</span>
                      <span className="text-sm font-black text-white">{feedback.communication}%</span>
                    </div>
                    <div className="p-3 bg-white/2 border border-brand-border/30 rounded-xl">
                      <span className="text-[9px] text-slate-400 block uppercase font-bold">Confidence</span>
                      <span className="text-sm font-black text-white">{feedback.confidence}%</span>
                    </div>
                  </div>

                  {/* Star review for behavioral */}
                  {feedback.starEvaluation && feedback.starEvaluation.situation !== 'Not explicitly detected.' && (
                    <div className="p-4 bg-brand-secondary/5 border border-brand-secondary/25 rounded-xl space-y-2 text-[11px] text-slate-300">
                      <div className="font-extrabold text-white text-xs uppercase tracking-wider border-b border-brand-border/40 pb-1">
                        STAR Narrative Evaluation
                      </div>
                      <div><strong>Situation:</strong> {feedback.starEvaluation.situation}</div>
                      <div><strong>Task:</strong> {feedback.starEvaluation.task}</div>
                      <div><strong>Action:</strong> {feedback.starEvaluation.action}</div>
                      <div><strong>Result:</strong> {feedback.starEvaluation.result}</div>
                    </div>
                  )}

                  <div className="space-y-2 text-xs">
                    <h4 className="font-extrabold text-white">Interviewer Explanation:</h4>
                    <p className="text-slate-300 leading-relaxed">{feedback.explanation}</p>
                  </div>

                  {feedback.improvementSuggestions && feedback.improvementSuggestions.length > 0 && (
                    <div className="space-y-2 text-xs">
                      <h4 className="font-extrabold text-brand-warning">Suggestions for Improvement:</h4>
                      <ul className="list-disc list-inside text-slate-400 space-y-1">
                        {feedback.improvementSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow cursor-pointer active:scale-95 transition-all"
                  >
                    {isDone ? 'Generate Final Report' : 'Proceed to Next Question'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
