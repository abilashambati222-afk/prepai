import React, { useState, useEffect, useRef } from 'react';
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
  XCircle,
  LogOut,
  Shield,
  Loader,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import InterviewWebcam from '../components/InterviewWebcam';
import InterviewWarningModal from '../components/InterviewWarningModal';
import useProctoring from '../hooks/useProctoring';

export default function InterviewSession() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answer, setAnswer] = useState('');
  
  // Timers and evaluation states
  const [timeLeft, setTimeLeft] = useState(120); // 120s limit per question
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState('');

  // Proctoring parameters via custom hook
  const {
    integrityScore,
    setIntegrityScore,
    warningsCount,
    setWarningsCount,
    showWarningModal,
    currentWarningType,
    currentWarningMsg,
    isFullscreen,
    handleProctorWarning,
    handleProctorEvent,
    handleForceFullscreen,
    terminateSession,
    startEvidenceRecorder
  } = useProctoring(id, !loading && !isDone);

  // 1. Initialize session and recover progress if available
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/interview/session/${id}`);
        if (res.data?.success) {
          const s = res.data.data;
          setSession(s);

          // Check for auto-saved recovery checkpoint
          const savedProgress = localStorage.getItem(`prepai_interview_checkpoint_${id}`);
          if (savedProgress) {
            const parsed = JSON.parse(savedProgress);
            setCurrentIdx(parsed.currentIdx);
            setAnswer(parsed.answer);
            setTimeLeft(parsed.timeLeft);
            setIntegrityScore(parsed.integrityScore);
            setWarningsCount(parsed.warningsCount);
          } else {
            // Default to first unanswered question
            const idx = s.questions.findIndex(q => !q.answer || !q.answer.answerText);
            setCurrentIdx(idx >= 0 ? idx : s.questions.length - 1);
            if (idx === -1) {
              setIsDone(true);
            }
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to retrieve interview session.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();

    // Prevent accidental page refreshes
    const preventRefresh = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to quit the interview? Progress will be lost.';
    };
    window.addEventListener('beforeunload', preventRefresh);

    return () => {
      window.removeEventListener('beforeunload', preventRefresh);
      localStorage.removeItem(`prepai_interview_checkpoint_${id}`);
    };
  }, [id]);

  // 2. Auto-save checkpoints to localStorage
  useEffect(() => {
    if (loading || isDone) return;
    const progress = {
      currentIdx,
      answer,
      timeLeft,
      integrityScore,
      warningsCount
    };
    localStorage.setItem(`prepai_interview_checkpoint_${id}`, JSON.stringify(progress));
  }, [currentIdx, answer, timeLeft, integrityScore, warningsCount, loading, isDone]);

  // 3. Countdown timer logic
  useEffect(() => {
    if (loading || submitting || feedback || isDone) return;

    if (timeLeft <= 0) {
      handleSubmitAnswer();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, loading, submitting, feedback, isDone]);

  const handleSubmitAnswer = async () => {
    if (!answer.trim() && timeLeft > 0) return;
    
    setSubmitting(true);
    setError('');
    const timeSpentOnQ = 120 - timeLeft;

    try {
      const response = await api.post('/interview/answer', {
        interviewId: id,
        answerText: answer || '[Time limit exceeded - No answer provided]',
        duration: timeSpentOnQ
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

  const handleNext = async () => {
    setFeedback(null);
    setAnswer('');
    setTimeLeft(120);
    if (isDone) {
      // Exit fullscreen before going to report
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }

      // Attach telemetry health logs
      const healthDataStr = localStorage.getItem('prepai_active_session_health');
      const sessionHealth = healthDataStr ? JSON.parse(healthDataStr) : null;

      try {
        await api.post('/interview/end', {
          interviewId: id,
          status: 'completed',
          sessionHealth
        });
      } catch (err) {
        console.warn('Failed to submit completed health logs:', err);
      }

      localStorage.removeItem(`prepai_interview_checkpoint_${id}`);
      localStorage.removeItem('prepai_active_session_health');
      navigate(`/mock-interviews/report/${id}`);
    } else {
      setCurrentIdx(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
        <Loader className="w-8 h-8 text-brand-primary animate-spin" />
        Configuring proctored test workspace...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center space-y-4">
          <XCircle className="w-12 h-12 text-brand-error mx-auto" />
          <h3 className="font-extrabold text-white text-base">Error Joining Session</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
          <button onClick={() => navigate('/mock-interviews')} className="px-5 py-2.5 bg-brand-primary rounded-xl text-xs font-bold text-white cursor-pointer">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const q = session.questions[currentIdx];
  const progressPercent = ((currentIdx) / session.questions.length) * 100;

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col justify-between p-6 md:p-8 relative">
      
      {/* Dynamic Warn modals */}
      <InterviewWarningModal
        show={showWarningModal}
        warningType={currentWarningType}
        warningMessage={currentWarningMsg}
        count={warningsCount}
      />

      {/* Header bar */}
      <header className="glass-panel p-4 rounded-2xl flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-ping" />
          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            PrepAI Secure Proctor Session
          </span>
        </div>

        {/* Fullscreen restore action if exited */}
        {!isFullscreen && (
          <button
            onClick={handleForceFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-error/20 border border-brand-error text-[10px] font-black text-brand-error hover:bg-brand-error hover:text-white cursor-pointer transition-all animate-bounce"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            RESTORE FULLSCREEN
          </button>
        )}

        <div className="flex items-center gap-5 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-4 h-4 text-brand-secondary" />
            <span>Time Left: {timeLeft}s</span>
          </div>
          <div className="h-4 w-[1px] bg-brand-border/60" />
          <div>
            <span className="text-slate-400">Integrity Score: </span>
            <span className={`font-black ${integrityScore >= 80 ? 'text-brand-success' : 'text-brand-error'}`}>
              {integrityScore}%
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start mb-6">
        
        {/* Left Side: Question Pane */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-6 md:p-8 rounded-3xl space-y-6 relative overflow-hidden bg-brand-card/25 min-h-[400px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                <span>Round: {session.interviewType}</span>
                <span>Question {currentIdx + 1} of {session.questions.length}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-brand-dark rounded-full overflow-hidden">
                <div className="h-full bg-brand-primary transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>

              <div className="space-y-3 pt-4">
                <h2 className="text-base md:text-xl font-extrabold text-white leading-relaxed whitespace-pre-wrap">
                  {q?.questionText}
                </h2>
              </div>
            </div>

            {/* Answer & Feedback display */}
            <div className="space-y-4">
              {!feedback ? (
                <div className="space-y-3">
                  <div className="relative">
                    <textarea
                      value={answer}
                      onChange={e => setAnswer(e.target.value)}
                      disabled={submitting}
                      placeholder="Type your answer here clearly and with technical detail..."
                      className="w-full h-32 p-4 bg-brand-dark/90 rounded-2xl border border-brand-border focus:border-brand-primary text-xs text-slate-200 outline-none resize-none transition-colors"
                    />
                    <button
                      onClick={() => setAnswer("Speech input simulated. Audio verified.")}
                      className="absolute bottom-4 right-4 p-2 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-white rounded-xl transition-all cursor-pointer"
                      title="Simulate Speech Input"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={submitting || !answer.trim()}
                      className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-brand-primary/20 cursor-pointer"
                    >
                      {submitting ? 'Evaluating...' : 'Submit Answer'}
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-white/3 border border-brand-border/60 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-secondary" />
                      AI Proctor Feedback
                    </h4>
                    <span className="text-sm font-black text-brand-success">{feedback.score}/100</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{feedback.explanation}</p>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={handleNext}
                      className="px-5 py-2.5 rounded-lg bg-white/5 border border-brand-border hover:border-brand-primary text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      {isDone ? 'View Results' : 'Next Question'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Proctored Webcam Feed */}
        <div className="space-y-6">
          <InterviewWebcam
            active={!isDone}
            onWarningTriggered={handleProctorWarning}
            onEventLogged={handleProctorEvent}
            onStreamActive={startEvidenceRecorder}
          />

          <div className="glass-panel p-4.5 rounded-2xl space-y-3.5 text-xs bg-brand-card/25 border border-brand-border/60">
            <h4 className="font-extrabold text-white text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-brand-secondary" />
              Proctor Rules
            </h4>
            <div className="space-y-2.5 text-[10px] text-slate-400 leading-relaxed font-semibold">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                <p>Ensure your face is fully lit and visible inside the preview pane.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                <p>Do not switch tabs, switch windows, or exit fullscreen mode.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 shrink-0" />
                <p>Mobile phones, external laptops, or reading materials are prohibited.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info lock */}
      <footer className="text-center text-[10px] text-slate-500 font-bold tracking-widest uppercase">
        Secure proctored workspace powered by PrepAI Integrity Engine
      </footer>
    </div>
  );
}
