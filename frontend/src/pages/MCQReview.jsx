import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Bookmark,
  CheckCircle,
  XCircle,
  X,
  Loader
} from 'lucide-react';
import api from '../lib/api';

export default function MCQReview() {
  const location = useLocation();
  const navigate = useNavigate();

  const testDetails = location.state?.testDetails;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState({});
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiError, setAiError] = useState('');

  if (!testDetails || !testDetails.answers || testDetails.answers.length === 0) {
    return (
      <div className="glass-panel p-8 text-center max-w-md mx-auto my-12">
        <h3 className="text-lg font-bold text-white">No Review Data Found</h3>
        <button onClick={() => navigate('/mcq-practice')} className="mt-4 px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg cursor-pointer">
          Go Back
        </button>
      </div>
    );
  }

  const currentAns = testDetails.answers[currentIndex];
  const q = currentAns.questionId;

  const handleToggleBookmark = async (qId) => {
    try {
      const active = bookmarked[qId];
      let res;
      if (active) {
        res = await api.delete(`/mcq/bookmark/${qId}`);
      } else {
        res = await api.post('/mcq/bookmark', { questionId: qId });
      }
      if (res.data?.success) {
        setBookmarked(prev => ({ ...prev, [qId]: !active }));
      }
    } catch (err) {
      console.error(err);
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
        setAiError('Failed to retrieve AI review feedback.');
      }
    } catch (err) {
      console.error(err);
      setAiError('Gemini is busy. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
        <div>
          <Link to="/mcq/history" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Attempt History
          </Link>
          <h1 className="text-xl font-bold text-white">Review Solutions</h1>
          <p className="text-xs text-slate-400">Step-by-step logic and correct answers for this session.</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block font-bold">Accuracy</span>
          <span className="text-lg font-black text-brand-primary">{testDetails.accuracy}%</span>
        </div>
      </div>

      {q ? (
        <div className="space-y-6">
          {/* Question Card */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl space-y-6 relative">
            <div className="absolute top-0 left-0 bg-brand-primary/20 text-brand-primary text-[10px] font-bold px-3 py-1.5 rounded-br-xl">
              Question {currentIndex + 1} of {testDetails.answers.length}
            </div>

            <div className="flex items-start justify-between gap-6 pt-4">
              <h2 className="text-base md:text-lg font-semibold text-white leading-relaxed whitespace-pre-wrap">{q.question}</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAskAi(q._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-[9px] font-black text-brand-primary hover:bg-brand-primary hover:text-white cursor-pointer transition-all"
                >
                  <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
                  ASK GEMINI
                </button>
                <button onClick={() => handleToggleBookmark(q._id)} className="p-2 border border-brand-border/60 rounded-xl text-slate-400 hover:text-white cursor-pointer">
                  <Bookmark className={`w-4 h-4 ${bookmarked[q._id] ? 'fill-brand-secondary text-brand-secondary border-brand-secondary' : ''}`} />
                </button>
              </div>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {q.options?.map((option, idx) => {
                const label = String.fromCharCode(65 + idx);
                const isSelected = currentAns.selectedOptionIndex === idx;
                const isCorrect = q.correctOptionIndex === idx;

                let styling = 'border-brand-border/40 bg-white/3 text-slate-500 opacity-60';
                if (isCorrect) styling = 'border-brand-success bg-brand-success/15 text-white';
                else if (isSelected) styling = 'border-brand-error bg-brand-error/15 text-white';

                return (
                  <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl border text-left font-semibold text-xs transition-all ${styling}`}>
                    <span className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                      isCorrect ? 'bg-brand-success text-white' : isSelected ? 'bg-brand-error text-white' : 'bg-brand-border/80 text-slate-500'
                    }`}>
                      {label}
                    </span>
                    <span className="leading-relaxed pt-0.5">{option}</span>
                  </div>
                );
              })}
            </div>

            {/* Explanations */}
            {q.explanation && (
              <div className="p-4 bg-white/5 border border-brand-border/60 rounded-xl space-y-1.5">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Solution explanation:</h5>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
              </div>
            )}
          </div>

          {/* Navigations */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-brand-border hover:border-brand-primary text-xs font-bold rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Solution
            </button>
            <span className="text-xs text-slate-400 font-bold">
              {currentIndex + 1} / {testDetails.answers.length}
            </span>
            <button
              onClick={() => setCurrentIndex(prev => Math.min(testDetails.answers.length - 1, prev + 1))}
              disabled={currentIndex === testDetails.answers.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-brand-border hover:border-brand-primary text-xs font-bold rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              Next Solution
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 text-xs">Failed to populate question details for index {currentIndex + 1}.</div>
      )}

      {/* Gemini tutor modal */}
      <AnimatePresence>
        {showAiModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={() => setShowAiModal(false)} className="fixed inset-0 bg-black z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-y-12 right-0 left-0 m-auto w-[92%] max-w-2xl h-[85vh] bg-brand-card border border-brand-border rounded-2xl flex flex-col z-50 overflow-hidden shadow-2xl">
              <div className="px-6 py-5 border-b border-brand-border/60 flex items-center justify-between bg-white/3">
                <div className="flex items-center gap-2.5">
                  <BrainCircuit className="w-6 h-6 text-brand-primary animate-pulse" />
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Gemini AI Tutor</h3>
                    <p className="text-[10px] text-slate-400">Step-by-step math derivation & theory guide</p>
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
                    <span className="text-xs text-slate-400">Gemini is generating solution steps...</span>
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
