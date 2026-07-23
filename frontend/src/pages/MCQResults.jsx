import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Bookmark,
  BrainCircuit,
  Loader,
  X
} from 'lucide-react';
import api from '../lib/api';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function MCQResults() {
  const location = useLocation();
  const navigate = useNavigate();

  const testDetails = location.state?.testDetails;
  const answersMap = location.state?.answersMap || {};

  const [bookmarked, setBookmarked] = useState({});
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    if (!testDetails) return;
    
    // Fetch user bookmarks to sync status
    const fetchBookmarks = async () => {
      try {
        const res = await api.get('/mcq/bookmarks');
        if (res.data?.success) {
          const map = {};
          res.data.data.bookmarks.forEach(b => {
            if (b.question) map[b.question._id] = true;
          });
          setBookmarked(map);
        }
      } catch (err) {
        console.error('Failed to retrieve bookmarks:', err);
      }
    };
    fetchBookmarks();
  }, [testDetails]);

  if (!testDetails) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-md mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-brand-error mx-auto" />
        <h3 className="text-lg font-bold text-white">No Results Found</h3>
        <p className="text-xs text-slate-400">Launch a practice quiz first to get results here.</p>
        <button onClick={() => navigate('/mcq-practice')} className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl cursor-pointer">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleToggleBookmark = async (qId) => {
    try {
      const currentlyBookmarked = bookmarked[qId];
      let res;
      if (currentlyBookmarked) {
        res = await api.delete(`/mcq/bookmark/${qId}`);
      } else {
        res = await api.post('/mcq/bookmark', { questionId: qId });
      }

      if (res.data?.success) {
        setBookmarked(prev => ({
          ...prev,
          [qId]: !currentlyBookmarked
        }));
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
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
        setAiError('Failed to retrieve AI tutor feedback.');
      }
    } catch (err) {
      console.error('Gemini AI execution failure:', err);
      setAiError('Gemini API is busy. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // Recharts config
  const chartData = [
    { name: 'Correct', value: testDetails.correctAnswers },
    { name: 'Incorrect', value: testDetails.wrongAnswers },
    { name: 'Unattempted', value: testDetails.totalQuestions - (testDetails.correctAnswers + testDetails.wrongAnswers) }
  ].filter(item => item.value > 0);

  const COLORS = ['#10b981', '#ef4444', '#475569'];

  return (
    <div className="space-y-8 w-full">
      <div>
        <Link
          to="/mcq-practice"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to MCQ Practice
        </Link>
      </div>

      {/* Results Header Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden lg:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-brand-secondary/5 to-transparent pointer-events-none" />
          <div className="space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              Practice Test Summary
            </span>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                {testDetails.subject} &bull; {testDetails.topic}
              </span>
              <h1 className="text-2xl font-black text-white">
                Final Score: <span className="text-gradient font-black">{testDetails.score} / {testDetails.totalQuestions}</span>
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                You completed this session in <strong>{testDetails.quizMode} Mode</strong>. Negative marking applied: {testDetails.negativeMarksAccumulated} marks.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-brand-border/40">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Accuracy</span>
                <span className={`text-xl font-black ${testDetails.accuracy >= 80 ? 'text-brand-success' : 'text-brand-warning'}`}>
                  {testDetails.accuracy}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Time Spent</span>
                <span className="text-xl font-black text-white">{formatTime(testDetails.timeSpent)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Correct</span>
                <span className="text-xl font-black text-brand-success">{testDetails.correctAnswers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Chart Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider text-center mb-2">
            Answers Distribution
          </h3>
          
          <div className="h-44 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e1326',
                    borderColor: '#1e294b',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '10px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-xs text-slate-400 font-bold block leading-none">Accuracy</span>
              <span className="text-lg font-black text-white">{testDetails.accuracy}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Key */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-white border-b border-brand-border/60 pb-3">
          Review Solutions & AI Assistance
        </h2>

        <div className="space-y-6">
          {testDetails.answers?.map((ans, idx) => {
            const isCorrect = ans.isCorrect;
            const isSkipped = ans.selectedOptionIndex === -1;
            
            return (
              <div key={idx} className="glass-panel p-6 rounded-2xl space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      isCorrect 
                        ? 'bg-brand-success/10 border border-brand-success/20 text-brand-success' 
                        : isSkipped 
                          ? 'bg-slate-700/10 border border-slate-700/20 text-slate-400' 
                          : 'bg-brand-error/10 border border-brand-error/20 text-brand-error'
                    }`}>
                      {isCorrect ? 'Correct' : isSkipped ? 'Skipped' : 'Incorrect'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAskAi(ans.questionId)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary text-brand-primary hover:text-white text-[9px] font-black cursor-pointer transition-all"
                    >
                      <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
                      ASK GEMINI AI TUTOR
                    </button>
                    <button
                      onClick={() => handleToggleBookmark(ans.questionId)}
                      className="p-1.5 rounded-lg border border-brand-border/60 hover:border-brand-primary/40 bg-white/5 text-slate-400 hover:text-white cursor-pointer transition-all"
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarked[ans.questionId] ? 'fill-brand-secondary text-brand-secondary border-brand-secondary' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Question body and Options review */}
                <p className="text-xs text-slate-400">Loading full question contents...</p>
              </div>
            );
          })}
        </div>
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
                    <h3 className="font-extrabold text-sm text-white">Gemini AI Tutor</h3>
                    <p className="text-[10px] text-slate-400">Interactive placements tutorial</p>
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
                    <span className="text-xs text-slate-400">Gemini is writing the explanation...</span>
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
    </div>
  );
}
