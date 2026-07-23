import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flag,
  AlertTriangle,
  Loader,
  X,
  CheckCircle,
  XCircle,
  HelpCircle,
  LogOut,
  BrainCircuit
} from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function MCQQuizSession() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Parse parameters
  const subject = searchParams.get('subject') || 'Aptitude';
  const topic = searchParams.get('topic') || '';
  const mode = searchParams.get('mode') || 'Practice'; // Practice or Test
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const difficulty = searchParams.get('difficulty') || '';

  // Core State
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({}); // { questionIndex: optionIndex }
  const [verifiedAnswers, setVerifiedAnswers] = useState({}); // { questionIndex: true } (only for Practice Mode)
  const [flagged, setFlagged] = useState({}); // { questionIndex: true }
  const [bookmarked, setBookmarked] = useState({}); // { questionId: true }
  
  // Timer & Metrics
  const [timeLeft, setTimeLeft] = useState(mode === 'Test' ? limit * 60 : 0);
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef(null);

  // AI Helper Modal State
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiError, setAiError] = useState('');

  // Submit confirmation modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const queryParams = new URLSearchParams({
          subject,
          topic,
          limit: limit.toString()
        });
        if (difficulty) {
          queryParams.append('difficulty', difficulty);
        }

        const response = await api.get(`/mcq/questions?${queryParams.toString()}`);
        if (response.data?.success) {
          const fetchedQs = response.data.data.questions || [];
          setQuestions(fetchedQs);

          // Initialize bookmark statuses
          const bookmarkMap = {};
          fetchedQs.forEach(q => {
            if (q.isBookmarked) {
              bookmarkMap[q._id] = true;
            }
          });
          setBookmarked(bookmarkMap);
        }
      } catch (err) {
        console.error('Failed to retrieve quiz questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subject, topic, difficulty, limit]);

  // Timer Effect
  useEffect(() => {
    if (loading || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);

      if (mode === 'Test') {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, questions, mode]);

  // Handle Automatic submission on timeout
  const handleAutoSubmit = async () => {
    console.log('Timer expired! Auto submitting quiz results.');
    await submitQuiz(true);
  };

  const handleToggleBookmark = async (qId) => {
    try {
      const response = await api.post(`/mcq/bookmark/${qId}`);
      if (response.data?.success) {
        setBookmarked(prev => ({
          ...prev,
          [qId]: response.data.data.bookmarked
        }));
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleOptionSelect = (optionIndex) => {
    // If in Practice Mode and already verified, lock the option change
    if (mode === 'Practice' && verifiedAnswers[currentIndex]) return;

    setSelectedOptions(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const handleVerifyAnswer = () => {
    if (selectedOptions[currentIndex] === undefined) return;
    setVerifiedAnswers(prev => ({
      ...prev,
      [currentIndex]: true
    }));
  };

  const handleToggleFlag = () => {
    setFlagged(prev => ({
      ...prev,
      [currentIndex]: !prev[currentIndex]
    }));
  };

  // Submit Quiz Data
  const submitQuiz = async (isAuto = false) => {
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const formattedAnswers = questions.map((q, index) => ({
        questionId: q._id,
        selectedOptionIndex: selectedOptions[index] !== undefined ? selectedOptions[index] : -1
      }));

      const payload = {
        subject,
        topic,
        quizMode: mode,
        timeSpent,
        answers: formattedAnswers
      };

      const response = await api.post('/mcq/submit', payload);
      if (response.data?.success) {
        navigate(`/mcq-practice/report/${response.data.data._id}`);
      } else {
        navigate('/mcq-practice');
      }
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      navigate('/mcq-practice');
    }
  };

  // Trigger Gemini AI Concept Helper
  const handleAskAi = async (qId) => {
    setAiLoading(true);
    setAiError('');
    setAiExplanation(null);
    setShowAiModal(true);

    try {
      const response = await api.get(`/mcq/explain/${qId}`);
      if (response.data?.success) {
        setAiExplanation(response.data.data);
      } else {
        setAiError('Failed to fetch AI explanation. Please try again.');
      }
    } catch (err) {
      console.error('Error invoking Gemini AI Helper:', err);
      setAiError('Error communicating with the AI Model. Verify your connection and API Key.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-md mx-auto">
        <AlertTriangle className="w-12 h-12 text-brand-warning mx-auto" />
        <h3 className="text-lg font-bold text-white">No Questions Available</h3>
        <p className="text-xs text-slate-400">We couldn't find any questions matching the selected parameters. Try another topic or difficulty.</p>
        <button onClick={() => navigate('/mcq-practice')} className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all">
          Go back to Catalog
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isSelected = selectedOptions[currentIndex] !== undefined;
  const isVerified = verifiedAnswers[currentIndex];
  const isCorrect = isSelected && isVerified && selectedOptions[currentIndex] === currentQuestion.correctOptionIndex;

  // Format timer
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full items-start relative">
      
      {/* 1. Main Workspace (3 cols) */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Quiz Header */}
        <div className="glass-panel p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
                  navigate('/mcq-practice');
                }
              }}
              className="p-2 hover:bg-white/5 border border-brand-border/60 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Exit Quiz"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
            <div>
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wide block">{subject}</span>
              <h3 className="text-sm font-bold text-white leading-tight">{topic}</h3>
            </div>
          </div>
          
          {/* Timer Display */}
          <div className="flex items-center gap-3 bg-white/5 border border-brand-border/80 px-4 py-2 rounded-xl">
            <Clock className={`w-4 h-4 ${mode === 'Test' && timeLeft < 60 ? 'text-brand-error animate-pulse' : 'text-brand-secondary'}`} />
            <span className={`text-sm font-bold font-mono text-white ${mode === 'Test' && timeLeft < 60 ? 'text-brand-error' : ''}`}>
              {mode === 'Test' ? formatTime(timeLeft) : formatTime(timeSpent)}
            </span>
          </div>
        </div>

        {/* Question Panel */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 bg-brand-primary/20 text-brand-primary text-[10px] font-bold px-3 py-1.5 rounded-br-xl">
            Question {currentIndex + 1} of {questions.length}
          </div>

          <div className="flex items-start justify-between gap-6 pt-4">
            <h2 className="text-base md:text-lg font-semibold text-white leading-relaxed whitespace-pre-wrap">
              {currentQuestion.question}
            </h2>
            <button
              onClick={() => handleToggleBookmark(currentQuestion._id)}
              className="p-2 rounded-xl border border-brand-border/60 hover:border-brand-primary/40 bg-white/5 text-slate-400 hover:text-white cursor-pointer transition-all"
              title={bookmarked[currentQuestion._id] ? 'Saved' : 'Save Question'}
            >
              <Bookmark className={`w-4.5 h-4.5 ${bookmarked[currentQuestion._id] ? 'fill-brand-secondary text-brand-secondary' : ''}`} />
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, idx) => {
              const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D
              const isCurrentSelected = selectedOptions[currentIndex] === idx;
              
              // Correctness highlight in Practice mode
              let optionClass = 'border-brand-border/60 bg-white/5 text-slate-300 hover:border-brand-primary/40 hover:bg-white/10';
              if (isCurrentSelected) {
                optionClass = 'border-brand-primary bg-brand-primary/10 text-white';
              }

              if (mode === 'Practice' && isVerified) {
                if (idx === currentQuestion.correctOptionIndex) {
                  optionClass = 'border-brand-success bg-brand-success/15 text-white';
                } else if (isCurrentSelected && idx !== currentQuestion.correctOptionIndex) {
                  optionClass = 'border-brand-error bg-brand-error/15 text-white';
                } else {
                  optionClass = 'border-brand-border/40 bg-white/3 text-slate-500 opacity-60 pointer-events-none';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={mode === 'Practice' && isVerified}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left font-semibold text-xs transition-all duration-200 cursor-pointer ${optionClass}`}
                >
                  <span className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                    isCurrentSelected 
                      ? 'bg-brand-primary text-white' 
                      : mode === 'Practice' && isVerified && idx === currentQuestion.correctOptionIndex
                        ? 'bg-brand-success text-white'
                        : 'bg-brand-border/80 text-slate-400'
                  }`}>
                    {optionLabel}
                  </span>
                  <span className="leading-relaxed pt-0.5">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Practice Mode Instant Explanation and AI Helper Integration */}
          {mode === 'Practice' && isVerified && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-xl border ${
                isCorrect 
                  ? 'bg-brand-success/5 border-brand-success/20 text-slate-200' 
                  : 'bg-brand-error/5 border-brand-error/20 text-slate-200'
              } space-y-4`}
            >
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-brand-border/60 pb-3">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-brand-success shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-brand-error shrink-0" />
                  )}
                  <h4 className="font-extrabold text-sm text-white">
                    {isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                  </h4>
                </div>

                {/* Gemini AI concept explanation invocation */}
                <button
                  onClick={() => handleAskAi(currentQuestion._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary/15 border border-brand-primary/30 hover:bg-brand-primary/25 hover:border-brand-primary/60 text-[10px] font-black text-brand-primary transition-all cursor-pointer"
                >
                  <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
                  ASK GEMINI AI EXPERT
                </button>
              </div>

              {currentQuestion.explanation && (
                <div className="space-y-1">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Solution:</h5>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white/5 border border-brand-border hover:border-brand-primary/50 text-xs font-bold text-slate-300 hover:text-white rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-3">
            {mode === 'Practice' && isSelected && !isVerified && (
              <button
                onClick={handleVerifyAnswer}
                className="px-6 py-2.5 bg-brand-secondary text-white text-xs font-black rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-brand-secondary/10"
              >
                Submit Answer
              </button>
            )}
            <button
              onClick={handleToggleFlag}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                flagged[currentIndex]
                  ? 'bg-brand-warning/15 border-brand-warning text-brand-warning'
                  : 'bg-white/5 border-brand-border/60 hover:border-brand-warning/40 text-slate-400 hover:text-white'
              }`}
              title="Flag Question for Review"
            >
              <Flag className="w-4.5 h-4.5" />
            </button>
          </div>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-xs font-bold text-white rounded-xl transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-white/5 border border-brand-border hover:border-brand-primary/50 text-xs font-bold text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Side navigation & progress tracker (1 col) */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-brand-border pb-3">
          Quiz Progress
        </h3>

        {/* Indicator grid */}
        <div className="grid grid-cols-5 gap-2.5">
          {questions.map((_, idx) => {
            const isActive = currentIndex === idx;
            const isAttempted = selectedOptions[idx] !== undefined;
            const isFlagged = flagged[idx];
            const isCorrectAnswer = mode === 'Practice' && verifiedAnswers[idx] && selectedOptions[idx] === questions[idx].correctOptionIndex;
            const isWrongAnswer = mode === 'Practice' && verifiedAnswers[idx] && selectedOptions[idx] !== questions[idx].correctOptionIndex;

            let bubbleClass = 'bg-white/5 border-brand-border/60 text-slate-400 hover:bg-white/10';
            if (isActive) {
              bubbleClass = 'border-brand-primary bg-brand-primary/10 text-white font-black scale-105';
            } else if (isFlagged) {
              bubbleClass = 'border-brand-warning bg-brand-warning/10 text-brand-warning';
            } else if (mode === 'Practice' && verifiedAnswers[idx]) {
              bubbleClass = isCorrectAnswer 
                ? 'border-brand-success bg-brand-success/15 text-brand-success' 
                : 'border-brand-error bg-brand-error/15 text-brand-error';
            } else if (isAttempted) {
              bubbleClass = 'border-slate-500 bg-slate-700/30 text-white';
            }

            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold border transition-all cursor-pointer ${bubbleClass}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Legends */}
        <div className="space-y-2.5 pt-4 border-t border-brand-border/40 text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded border border-brand-primary bg-brand-primary/10" />
            <span>Active Question</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded border border-slate-500 bg-slate-700/30" />
            <span>Attempted</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded border border-brand-warning bg-brand-warning/10" />
            <span>Flagged for Review</span>
          </div>
          {mode === 'Practice' && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded border border-brand-success bg-brand-success/15" />
                <span>Correct Answer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded border border-brand-error bg-brand-error/15" />
                <span>Incorrect Answer</span>
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-xs font-bold text-white rounded-xl shadow-lg shadow-brand-primary/10 transition-all cursor-pointer"
        >
          Submit Entire Quiz
        </button>
      </div>

      {/* Gemini AI helper modal */}
      <AnimatePresence>
        {showAiModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAiModal(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-y-12 right-0 left-0 m-auto w-[92%] max-w-2xl h-[85vh] bg-brand-card border border-brand-border rounded-2xl flex flex-col z-50 overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-brand-border/60 flex items-center justify-between bg-white/3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary border border-brand-primary/25">
                    <BrainCircuit className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Gemini AI Placements Advisor</h3>
                    <p className="text-[10px] text-slate-400">Step-by-step logic breakdown & shortcuts</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {aiLoading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                    <Loader className="w-8 h-8 text-brand-primary animate-spin" />
                    <span className="text-xs text-slate-400 font-semibold">Gemini is formulating explanations and derivations...</span>
                  </div>
                ) : aiError ? (
                  <div className="p-4 rounded-xl bg-brand-error/10 border border-brand-error/25 text-brand-error text-xs flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span>{aiError}</span>
                  </div>
                ) : aiExplanation ? (
                  <div className="space-y-6">
                    {/* Concept */}
                    <div className="p-4 bg-brand-primary/5 border border-brand-primary/25 rounded-xl space-y-1.5">
                      <h4 className="text-[10px] font-black uppercase text-brand-secondary tracking-widest flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        Core Concept
                      </h4>
                      <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                        {aiExplanation.concept}
                      </p>
                    </div>

                    {/* Step by Step */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        Logical Derivation & Explanation
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-white/3 border border-brand-border/60 p-4 rounded-xl font-mono">
                        {aiExplanation.stepByStep}
                      </p>
                    </div>

                    {/* Shortcut (if exists) */}
                    {aiExplanation.shortcut && (
                      <div className="p-4 bg-brand-success/5 border border-brand-success/20 rounded-xl space-y-1.5">
                        <h4 className="text-[10px] font-black uppercase text-brand-success tracking-widest">
                          Placements Shortcut / Speed Trick
                        </h4>
                        <p className="text-xs text-slate-200 leading-relaxed font-semibold italic">
                          {aiExplanation.shortcut}
                        </p>
                      </div>
                    )}

                    {/* Common Pitfalls */}
                    {aiExplanation.pitfalls && (
                      <div className="p-4 bg-brand-warning/5 border border-brand-warning/20 rounded-xl space-y-1.5">
                        <h4 className="text-[10px] font-black uppercase text-brand-warning tracking-widest">
                          Common Pitfalls / Candidate Traps
                        </h4>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {aiExplanation.pitfalls}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20 text-slate-500 text-xs">
                    No explanation available.
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-brand-border/60 flex justify-end bg-white/2">
                <button
                  onClick={() => setShowAiModal(false)}
                  className="px-5 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg cursor-pointer hover:brightness-110 transition-all"
                >
                  Got it, Close Advisor
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmitModal(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 m-auto w-[90%] max-w-sm h-fit glass-panel rounded-2xl p-6 z-50 shadow-2xl text-center space-y-6"
            >
              <AlertTriangle className="w-12 h-12 text-brand-warning mx-auto" />
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white">Submit Placement Quiz?</h3>
                <p className="text-xs text-slate-400">
                  You have completed {Object.keys(selectedOptions).length} of {questions.length} questions.
                  Are you ready to lock your answers and compute final statistics?
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-brand-border text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Review Answers
                </button>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    submitQuiz();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-xs font-bold text-white transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
                >
                  Yes, Submit
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
