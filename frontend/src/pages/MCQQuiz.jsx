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
  LogOut,
  BrainCircuit,
  HelpCircle
} from 'lucide-react';
import api from '../lib/api';

export default function MCQQuiz() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Parse parameters from route
  const subject = searchParams.get('subject') || 'Aptitude';
  const topic = searchParams.get('topic') || '';
  const mode = searchParams.get('mode') || 'Practice'; // Practice or Test
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const difficulty = searchParams.get('difficulty') || '';

  // State Management
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({}); // { questionIndex: optionIndex }
  const [verifiedAnswers, setVerifiedAnswers] = useState({}); // { questionIndex: true }
  const [flagged, setFlagged] = useState({}); // { questionIndex: true }
  const [bookmarked, setBookmarked] = useState({}); // { questionId: true }
  const [questionTimes, setQuestionTimes] = useState({}); // { questionIndex: seconds }

  // Timer
  const [timeLeft, setTimeLeft] = useState(mode === 'Test' ? limit * 60 : 0);
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef(null);
  const questionTimerRef = useRef(null);

  // AI Advisor Modal
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiError, setAiError] = useState('');

  // Submit modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Initialize Quiz
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        // Check if there is an interrupted test session in localStorage matching this subject/topic
        const savedSession = localStorage.getItem('prepai_mcq_interrupted_test');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed.subject === subject && parsed.topic === topic) {
            const confirmResume = window.confirm(
              `We found an unfinished practice session for "${topic}" from earlier. Would you like to resume it?`
            );
            if (confirmResume) {
              setQuestions(parsed.questions);
              setCurrentIndex(parsed.currentIndex || 0);
              setSelectedOptions(parsed.selectedOptions || {});
              setVerifiedAnswers(parsed.verifiedAnswers || {});
              setFlagged(parsed.flagged || {});
              setTimeLeft(parsed.timeLeft);
              setTimeSpent(parsed.timeSpent || 0);
              setBookmarked(parsed.bookmarked || {});
              setQuestionTimes(parsed.questionTimes || {});
              setLoading(false);
              return;
            } else {
              localStorage.removeItem('prepai_mcq_interrupted_test');
            }
          }
        }

        const res = await api.post('/mcq/start-test', {
          subject,
          topic,
          difficulty,
          quizMode: mode,
          count: limit
        });

        if (res.data?.success) {
          const fetchedQs = res.data.data.questions || [];
          setQuestions(fetchedQs);

          const bookmarkMap = {};
          fetchedQs.forEach(q => {
            if (q.isBookmarked) {
              bookmarkMap[q._id] = true;
            }
          });
          setBookmarked(bookmarkMap);
        }
      } catch (err) {
        console.error('Failed to start quiz:', err);
      } finally {
        setLoading(false);
      }
    };
    initializeQuiz();
  }, [subject, topic, difficulty, mode, limit]);

  // Auto-Save Effect
  useEffect(() => {
    if (loading || questions.length === 0) return;
    const sessionState = {
      subject,
      topic,
      questions,
      currentIndex,
      selectedOptions,
      verifiedAnswers,
      flagged,
      timeLeft,
      timeSpent,
      bookmarked,
      questionTimes
    };
    localStorage.setItem('prepai_mcq_interrupted_test', JSON.stringify(sessionState));
  }, [currentIndex, selectedOptions, verifiedAnswers, flagged, timeLeft, timeSpent, bookmarked, questionTimes, loading, questions]);

  // Overall Timer & Question Speed Timer
  useEffect(() => {
    if (loading || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);

      // Log time spent on current question
      setQuestionTimes(prev => ({
        ...prev,
        [currentIndex]: (prev[currentIndex] || 0) + 1
      }));

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
  }, [loading, questions, mode, currentIndex]);

  const handleAutoSubmit = async () => {
    console.log('Timer expired! Submitting test.');
    await submitQuiz();
  };

  const handleToggleBookmark = async (qId) => {
    try {
      const isCurrentlyBookmarked = bookmarked[qId];
      let res;
      if (isCurrentlyBookmarked) {
        res = await api.delete(`/mcq/bookmark/${qId}`);
      } else {
        res = await api.post('/mcq/bookmark', { questionId: qId });
      }

      if (res.data?.success) {
        setBookmarked(prev => ({
          ...prev,
          [qId]: !isCurrentlyBookmarked
        }));
      }
    } catch (err) {
      console.error('Failed to change bookmark status:', err);
    }
  };

  const handleOptionSelect = (optionIndex) => {
    if (mode === 'Practice' && verifiedAnswers[currentIndex]) return; // lock option once verified

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

  // Submit test and navigate to results page
  const submitQuiz = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    localStorage.removeItem('prepai_mcq_interrupted_test');

    try {
      const formattedAnswers = questions.map((q, index) => ({
        questionId: q._id,
        selectedOptionIndex: selectedOptions[index] !== undefined ? selectedOptions[index] : -1,
        timeSpent: questionTimes[index] || 0
      }));

      const payload = {
        subject,
        topic,
        quizMode: mode,
        timeSpent,
        answers: formattedAnswers
      };

      const res = await api.post('/mcq/submit', payload);
      if (res.data?.success) {
        navigate('/mcq/results', { state: { testDetails: res.data.data, answersMap: selectedOptions } });
      } else {
        navigate('/mcq-practice');
      }
    } catch (err) {
      console.error('Submission failure:', err);
      navigate('/mcq-practice');
    }
  };

  const handleAskAi = async (qId) => {
    setAiLoading(true);
    setAiError('');
    setAiExplanation(null);
    setShowAiModal(true);

    try {
      const res = await api.get(`/mcq/explain/${qId}`);
      if (res.data?.success) {
        setAiExplanation(res.data.data);
      } else {
        setAiError('Failed to retrieve AI feedback. Please retry.');
      }
    } catch (err) {
      console.error('Gemini AI execution failure:', err);
      setAiError('Gemini API is busy. Please try again.');
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
        <p className="text-xs text-slate-400">Could not retrieve questions matching those filters.</p>
        <button onClick={() => navigate('/mcq/categories')} className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all cursor-pointer">
          Browse Catalog
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isSelected = selectedOptions[currentIndex] !== undefined;
  const isVerified = verifiedAnswers[currentIndex];
  const isCorrect = isSelected && isVerified && selectedOptions[currentIndex] === currentQ.correctOptionIndex;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full items-start relative">
      {/* Workspace */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Header bar */}
        <div className="glass-panel p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('Exit quiz? Progress in this session will not be saved.')) {
                  localStorage.removeItem('prepai_mcq_interrupted_test');
                  navigate('/mcq-practice');
                }
              }}
              className="p-2 hover:bg-white/5 border border-brand-border/60 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
              title="Quit Session"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
            <div>
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wide block">{subject}</span>
              <h3 className="text-sm font-bold text-white leading-tight">{topic}</h3>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-brand-border/80 px-4 py-2 rounded-xl">
            <Clock className={`w-4 h-4 ${mode === 'Test' && timeLeft < 60 ? 'text-brand-error animate-pulse' : 'text-brand-secondary'}`} />
            <span className={`text-sm font-bold font-mono text-white ${mode === 'Test' && timeLeft < 60 ? 'text-brand-error' : ''}`}>
              {mode === 'Test' ? formatTime(timeLeft) : formatTime(timeSpent)}
            </span>
          </div>
        </div>

        {/* Question Card */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 bg-brand-primary/20 text-brand-primary text-[10px] font-bold px-3 py-1.5 rounded-br-xl">
            Question {currentIndex + 1} of {questions.length}
          </div>

          <div className="flex items-start justify-between gap-6 pt-4">
            <h2 className="text-base md:text-lg font-semibold text-white leading-relaxed whitespace-pre-wrap">
              {currentQ.question}
            </h2>
            <button
              onClick={() => handleToggleBookmark(currentQ._id)}
              className="p-2 rounded-xl border border-brand-border/60 hover:border-brand-primary/40 bg-white/5 text-slate-400 hover:text-white cursor-pointer transition-all shrink-0"
            >
              <Bookmark className={`w-4.5 h-4.5 ${bookmarked[currentQ._id] ? 'fill-brand-secondary text-brand-secondary border-brand-secondary' : ''}`} />
            </button>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.options.map((option, idx) => {
              const label = String.fromCharCode(65 + idx);
              const isCurrent = selectedOptions[currentIndex] === idx;
              
              let styling = 'border-brand-border/60 bg-white/5 text-slate-300 hover:border-brand-primary/40 hover:bg-white/10';
              if (isCurrent) styling = 'border-brand-primary bg-brand-primary/10 text-white';

              if (mode === 'Practice' && isVerified) {
                if (idx === currentQ.correctOptionIndex) {
                  styling = 'border-brand-success bg-brand-success/15 text-white';
                } else if (isCurrent) {
                  styling = 'border-brand-error bg-brand-error/15 text-white';
                } else {
                  styling = 'border-brand-border/40 bg-white/3 text-slate-500 opacity-60 pointer-events-none';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={mode === 'Practice' && isVerified}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left font-semibold text-xs transition-all duration-200 cursor-pointer ${styling}`}
                >
                  <span className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                    isCurrent 
                      ? 'bg-brand-primary text-white' 
                      : mode === 'Practice' && isVerified && idx === currentQ.correctOptionIndex
                        ? 'bg-brand-success text-white'
                        : 'bg-brand-border/80 text-slate-400'
                  }`}>
                    {label}
                  </span>
                  <span className="leading-relaxed pt-0.5">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Hint and Marks Info */}
          <div className="flex justify-between items-center text-[10px] text-slate-500 pt-4 border-t border-brand-border/40">
            <span>Marks: +{currentQ.marks || 1} | Negative: -{currentQ.negativeMarks || 0.25}</span>
            {currentQ.hints?.length > 0 && (
              <span className="cursor-help hover:text-white" title={currentQ.hints[0]}>Need a Hint?</span>
            )}
          </div>

          {/* Practice Mode Solutions */}
          {mode === 'Practice' && isVerified && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-xl border ${isCorrect ? 'bg-brand-success/5 border-brand-success/20' : 'bg-brand-error/5 border-brand-error/20'} space-y-4`}
            >
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                <span className="font-extrabold text-sm text-white flex items-center gap-2">
                  {isCorrect ? <CheckCircle className="w-5 h-5 text-brand-success" /> : <XCircle className="w-5 h-5 text-brand-error" />}
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
                <button
                  onClick={() => handleAskAi(currentQ._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary/15 border border-brand-primary/30 text-[10px] font-black text-brand-primary hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                >
                  <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
                  ASK GEMINI TUTOR
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{currentQ.explanation}</p>
            </motion.div>
          )}
        </div>

        {/* Navigations */}
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
                className="px-6 py-2.5 bg-brand-secondary text-white text-xs font-black rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-lg"
              >
                Verify Answer
              </button>
            )}
            <button
              onClick={handleToggleFlag}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                flagged[currentIndex]
                  ? 'bg-brand-warning/15 border-brand-warning text-brand-warning'
                  : 'bg-white/5 border-brand-border/60 hover:border-brand-warning/40 text-slate-400 hover:text-white'
              }`}
            >
              <Flag className="w-4.5 h-4.5" />
            </button>
          </div>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-xs font-bold text-white rounded-xl transition-all shadow-lg cursor-pointer"
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

      {/* Side Tracker */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-brand-border pb-3">
          Question Map
        </h3>

        <div className="grid grid-cols-5 gap-2.5">
          {questions.map((_, idx) => {
            const active = currentIndex === idx;
            const attempted = selectedOptions[idx] !== undefined;
            const flag = flagged[idx];
            const correct = mode === 'Practice' && verifiedAnswers[idx] && selectedOptions[idx] === questions[idx].correctOptionIndex;
            const wrong = mode === 'Practice' && verifiedAnswers[idx] && selectedOptions[idx] !== questions[idx].correctOptionIndex;

            let bubbleColor = 'bg-white/5 border-brand-border/60 text-slate-400 hover:bg-white/10';
            if (active) bubbleColor = 'border-brand-primary bg-brand-primary/10 text-white font-black scale-105';
            else if (flag) bubbleColor = 'border-brand-warning bg-brand-warning/10 text-brand-warning';
            else if (mode === 'Practice' && verifiedAnswers[idx]) {
              bubbleColor = correct 
                ? 'border-brand-success bg-brand-success/15 text-brand-success' 
                : 'border-brand-error bg-brand-error/15 text-brand-error';
            } else if (attempted) {
              bubbleColor = 'border-slate-500 bg-slate-700/30 text-white';
            }

            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold border transition-all cursor-pointer ${bubbleColor}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-xs font-bold text-white rounded-xl shadow-lg transition-all cursor-pointer"
        >
          Submit Test
        </button>
      </div>

      {/* Gemini AI Modal */}
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
              <div className="px-6 py-5 border-b border-brand-border/60 flex items-center justify-between bg-white/3">
                <div className="flex items-center gap-2.5">
                  <BrainCircuit className="w-6 h-6 text-brand-primary animate-pulse" />
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Gemini AI Placement Tutor</h3>
                    <p className="text-[10px] text-slate-400">Step-by-step logic breakdown & tricks</p>
                  </div>
                </div>
                <button onClick={() => setShowAiModal(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {aiLoading ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
                    <Loader className="w-8 h-8 text-brand-primary animate-spin" />
                    <span className="text-xs text-slate-400">Gemini is writing the breakdown...</span>
                  </div>
                ) : aiError ? (
                  <div className="p-4 rounded-xl bg-brand-error/10 text-brand-error text-xs">{aiError}</div>
                ) : aiExplanation ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl space-y-1.5">
                      <h4 className="text-[10px] font-black uppercase text-brand-secondary tracking-widest">Concept</h4>
                      <p className="text-xs text-slate-200 font-semibold">{aiExplanation.concept}</p>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Derivation</h4>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-white/2 border border-brand-border/40 p-4 rounded-xl font-mono">
                        {aiExplanation.explanation || aiExplanation.stepByStep}
                      </p>
                    </div>

                    {aiExplanation.shortcut && (
                      <div className="p-4 bg-brand-success/5 border border-brand-success/20 rounded-xl space-y-1.5">
                        <h4 className="text-[10px] font-black uppercase text-brand-success tracking-widest">Speed Trick</h4>
                        <p className="text-xs text-slate-200 font-semibold italic">{aiExplanation.shortcut}</p>
                      </div>
                    )}

                    {aiExplanation.commonMistake && (
                      <div className="p-4 bg-brand-warning/5 border border-brand-warning/20 rounded-xl space-y-1.5">
                        <h4 className="text-[10px] font-black uppercase text-brand-warning tracking-widest">Common Pitfall</h4>
                        <p className="text-xs text-slate-200">{aiExplanation.commonMistake}</p>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="px-6 py-4 border-t border-brand-border/60 flex justify-end bg-white/2">
                <button onClick={() => setShowAiModal(false)} className="px-5 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg cursor-pointer">
                  Close Tutor
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Submit Confirmation */}
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
                <h3 className="text-base font-bold text-white">Submit entire assessment?</h3>
                <p className="text-xs text-slate-400">
                  You answered {Object.keys(selectedOptions).length} of {questions.length} questions.
                  Are you ready to lock answers and view results?
                </p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setShowSubmitModal(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 border border-brand-border text-xs font-bold text-slate-300 hover:text-white cursor-pointer">
                  Keep Reviewing
                </button>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    submitQuiz();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold cursor-pointer"
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
