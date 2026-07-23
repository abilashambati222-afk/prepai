import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Trash2,
  ArrowLeft,
  Loader,
  X,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import api from '../lib/api';

export default function MCQBookmarks() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // AI Advisor
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiError, setAiError] = useState('');

  const fetchBookmarks = async () => {
    try {
      const res = await api.get('/mcq/bookmarks');
      if (res.data?.success) {
        setBookmarks(res.data.data.bookmarks || []);
      }
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleToggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleRemoveBookmark = async (qId) => {
    try {
      const res = await api.delete(`/mcq/bookmark/${qId}`);
      if (res.data?.success) {
        setBookmarks(prev => prev.filter(b => b.question._id !== qId));
        if (expandedId === qId) setExpandedId(null);
      }
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
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
        setAiError('Failed to fetch AI feedback.');
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

  return (
    <div className="space-y-8 w-full">
      {/* Back button and title */}
      <div className="space-y-2">
        <Link
          to="/mcq-practice"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Bookmark className="w-7 h-7 text-brand-secondary fill-brand-secondary/10" />
          Saved Question Vault
        </h1>
        <p className="text-xs text-slate-400">
          Review your bookmarked placement questions and study with Gemini AI tutor support.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl text-center space-y-4 max-w-lg mx-auto">
          <Bookmark className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">Your Vault is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Save questions while taking quizzes to store them here for review and revision.
          </p>
          <Link
            to="/mcq/categories"
            className="inline-flex px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all shadow-lg"
          >
            Start Practice Quizzes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bm, index) => {
            const q = bm.question;
            if (!q) return null;
            const isExpanded = expandedId === q._id;

            return (
              <div key={bm._id} className="glass-panel rounded-2xl overflow-hidden transition-all duration-300">
                {/* Header block / accordion trigger */}
                <div
                  onClick={() => handleToggleExpand(q._id)}
                  className="p-5 flex items-start md:items-center justify-between gap-6 cursor-pointer hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-start md:items-center gap-4 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-brand-border flex items-center justify-center font-bold text-xs text-slate-400 shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0 space-y-1">
                      <p className="text-xs font-bold text-white truncate pr-4 leading-relaxed">
                        {q.question}
                      </p>
                      <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider">
                        <span className="text-brand-secondary">{q.subject}</span>
                        <span className="text-slate-500">&bull;</span>
                        <span className="text-slate-400">{q.topic}</span>
                        <span className="text-slate-500">&bull;</span>
                        <span className={`px-1.5 py-0.5 rounded ${
                          q.difficulty === 'Easy' 
                            ? 'bg-brand-success/10 text-brand-success' 
                            : q.difficulty === 'Medium' 
                              ? 'bg-brand-warning/10 text-brand-warning' 
                              : 'bg-brand-error/10 text-brand-error'
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleRemoveBookmark(q._id)}
                      className="p-2 text-slate-400 hover:text-brand-error hover:bg-brand-error/10 rounded-xl transition-all cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleToggleExpand(q._id)} className="p-2 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Body details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden border-t border-brand-border/40"
                    >
                      <div className="p-6 bg-brand-card/30 space-y-6">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Full Question:</span>
                          <p className="text-sm font-semibold text-slate-200 whitespace-pre-wrap leading-relaxed">{q.question}</p>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {q.options.map((opt, idx) => {
                            const label = String.fromCharCode(65 + idx);
                            const correct = q.correctOptionIndex === idx;

                            return (
                              <div
                                key={idx}
                                className={`flex items-start gap-4 p-4 rounded-xl border font-semibold text-xs transition-all ${
                                  correct 
                                    ? 'border-brand-success bg-brand-success/15 text-white' 
                                    : 'border-brand-border/60 bg-white/5 text-slate-400 opacity-60'
                                }`}
                              >
                                <span className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                                  correct ? 'bg-brand-success text-white' : 'bg-brand-border/80 text-slate-500'
                                }`}>
                                  {label}
                                </span>
                                <span className="leading-relaxed pt-0.5">{opt}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Solutions & AI tutor helper */}
                        <div className="flex flex-col md:flex-row gap-6 items-stretch pt-2">
                          <div className="flex-1 p-4 bg-white/5 border border-brand-border/60 rounded-xl space-y-1.5">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Solution explanation:</h5>
                            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
                          </div>
                          <div className="md:w-60 flex flex-col justify-center items-center p-4 border border-dashed border-brand-border rounded-xl bg-white/3 gap-3 text-center">
                            <BrainCircuit className="w-8 h-8 text-brand-primary animate-pulse" />
                            <h5 className="text-xs font-bold text-white">Ask Gemini AI</h5>
                            <button
                              onClick={() => handleAskAi(q._id)}
                              className="w-full py-2 bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary text-brand-primary hover:text-white text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <BrainCircuit className="w-3.5 h-3.5" />
                              Invoke Tutor
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* AI tutor modal */}
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
                    <p className="text-[10px] text-slate-400">Personalized derivation guide</p>
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
                    <span className="text-xs text-slate-400">Gemini is generating hints and solutions...</span>
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
