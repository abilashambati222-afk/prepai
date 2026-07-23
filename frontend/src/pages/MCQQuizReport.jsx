import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Bookmark,
  BrainCircuit,
  Loader,
  X,
  Plus
} from 'lucide-react';
import api from '../lib/api';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function MCQQuizReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [bookmarked, setBookmarked] = useState({}); // { questionId: true }

  // AI Helper Modal State
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const historyRes = await api.get('/mcq/history');
        if (historyRes.data?.success) {
          const list = historyRes.data.data.history || [];
          const found = list.find(r => r._id === id);
          if (found) {
            setReport(found);

            // Fetch current bookmarks to show correct saved state
            const bookmarksRes = await api.get('/mcq/bookmarks');
            if (bookmarksRes.data?.success) {
              const bookmarkedMap = {};
              bookmarksRes.data.data.bookmarks.forEach(b => {
                bookmarkedMap[b.question._id] = true;
              });
              setBookmarked(bookmarkedMap);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load quiz report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

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

  if (!report) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-brand-error mx-auto" />
        <h3 className="text-lg font-bold text-white">Report Not Found</h3>
        <p className="text-xs text-slate-400">The requested quiz session statistics could not be loaded.</p>
        <button onClick={() => navigate('/mcq-practice')} className="px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all">
          Back to Catalog
        </button>
      </div>
    );
  }

  // Format time (seconds to MM:SS)
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Recharts Chart Data
  const chartData = [
    { name: 'Correct', value: report.correctAnswers },
    { name: 'Incorrect', value: report.wrongAnswers },
    { name: 'Unattempted', value: report.totalQuestions - (report.correctAnswers + report.wrongAnswers) }
  ].filter(c => c.value > 0);

  const COLORS = ['#10b981', '#ef4444', '#475569'];

  return (
    <div className="space-y-8 w-full">
      {/* Back to dashboard */}
      <div>
        <Link
          to="/mcq-practice"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to MCQ Practice Dashboard
        </Link>
      </div>

      {/* Main Stats Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Visual score card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden lg:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-brand-secondary/5 to-transparent pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              Assessment Complete
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">{report.subject} &bull; {report.topic}</span>
              <h1 className="text-2xl font-black text-white">
                Score Summary: <span className="text-gradient font-black">{report.score} / {report.totalQuestions}</span>
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                You attempted this quiz in <strong>{report.quizMode} Mode</strong> on {new Date(report.completedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-brand-border/40">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Accuracy</span>
                <span className={`text-xl font-black ${report.accuracy >= 75 ? 'text-brand-success' : 'text-brand-warning'}`}>{report.accuracy}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Time Spent</span>
                <span className="text-xl font-black text-white">{formatTime(report.timeSpent)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Mode</span>
                <span className="text-xl font-black text-brand-secondary">{report.quizMode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown Recharts Pie Chart */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider text-center mb-2">Answers Distribution</h3>
          
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
              <span className="text-xs text-slate-400 font-bold uppercase block leading-none">Accuracy</span>
              <span className="text-lg font-black text-white">{report.accuracy}%</span>
            </div>
          </div>

          <div className="flex gap-4 text-[10px] text-slate-400 pt-2 font-semibold">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-success" />
              <span>Correct ({report.correctAnswers})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-error" />
              <span>Wrong ({report.wrongAnswers})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Questions Panel */}
      <div className="space-y-6">
        <div className="border-b border-brand-border/60 pb-3">
          <h2 className="text-base font-bold text-white">Review Solution Key</h2>
          <p className="text-xs text-slate-400">Detailed overview of correct vs incorrect choices.</p>
        </div>

        <div className="space-y-6">
          {report.answers.map((ans, idx) => {
            const questionObj = ans.questionId;
            if (!questionObj) return null;

            const isCorrect = ans.isCorrect;
            const isUnattempted = ans.selectedOptionIndex === -1;

            return (
              <div
                key={questionObj._id}
                className="glass-panel p-6 rounded-2xl space-y-6 relative overflow-hidden"
              >
                {/* Question Status Tag */}
                <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Question {idx + 1}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                      isCorrect 
                        ? 'bg-brand-success/15 border border-brand-success/20 text-brand-success' 
                        : isUnattempted 
                          ? 'bg-slate-700/10 border border-slate-700/20 text-slate-400' 
                          : 'bg-brand-error/15 border border-brand-error/20 text-brand-error'
                    }`}>
                      {isCorrect ? 'Correct' : isUnattempted ? 'Skipped' : 'Incorrect'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Gemini AI explanation helper */}
                    <button
                      onClick={() => handleAskAi(questionObj._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary/20 hover:border-brand-primary/40 text-[9px] font-black text-brand-primary cursor-pointer transition-all"
                    >
                      <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
                      ASK GEMINI AI EXPERT
                    </button>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => handleToggleBookmark(questionObj._id)}
                      className="p-1.5 rounded-lg border border-brand-border/60 hover:border-brand-primary/40 bg-white/5 text-slate-400 hover:text-white cursor-pointer transition-all"
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarked[questionObj._id] ? 'fill-brand-secondary text-brand-secondary border-brand-secondary' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Question text */}
                <p className="text-sm font-bold text-white whitespace-pre-wrap leading-relaxed">{questionObj.question}</p>

                {/* Options Review Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questionObj.options.map((option, optIdx) => {
                    const optionLabel = String.fromCharCode(65 + optIdx);
                    
                    const isSelected = ans.selectedOptionIndex === optIdx;
                    const isCorrectOption = questionObj.correctOptionIndex === optIdx;

                    let optionClass = 'border-brand-border/40 bg-white/3 text-slate-500 opacity-60';

                    if (isCorrectOption) {
                      optionClass = 'border-brand-success bg-brand-success/15 text-white';
                    } else if (isSelected && !isCorrectOption) {
                      optionClass = 'border-brand-error bg-brand-error/15 text-white';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`flex items-start gap-4 p-4 rounded-xl border text-left font-semibold text-xs transition-all ${optionClass}`}
                      >
                        <span className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                          isCorrectOption
                            ? 'bg-brand-success text-white'
                            : isSelected
                              ? 'bg-brand-error text-white'
                              : 'bg-brand-border/80 text-slate-500'
                        }`}>
                          {optionLabel}
                        </span>
                        <span className="leading-relaxed pt-0.5">{option}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Standard Explanation */}
                {questionObj.explanation && (
                  <div className="p-4 bg-white/5 border border-brand-border/80 rounded-xl space-y-1.5">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Solution explanation:</h5>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{questionObj.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
    </div>
  );
}
