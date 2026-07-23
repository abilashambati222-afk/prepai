import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  Loader,
  Play,
  Sliders,
  Clock,
  Sparkles,
  Award,
  BookMarked,
  ArrowLeft,
  FileCode,
  Building,
  Target
} from 'lucide-react';
import api from '../lib/api';

export default function MCQCategories() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  // Modal configuration state
  const [selectedTopic, setSelectedTopic] = useState(null); // { subject, topic }
  const [quizMode, setQuizMode] = useState('Practice');
  const [quizLength, setQuizLength] = useState(10);
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/mcq/categories');
        if (res.data?.success) {
          setSubjects(res.data.data.subjects || []);
          setBookmarksCount(res.data.data.bookmarksCount || 0);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleStartQuiz = () => {
    if (!selectedTopic) return;
    const queryParams = new URLSearchParams({
      subject: selectedTopic.subject,
      topic: selectedTopic.topic,
      mode: quizMode,
      limit: quizLength.toString(),
      difficulty
    });
    navigate(`/mcq/question/session?${queryParams.toString()}`); // Will map this in MCQQuiz launcher
  };

  const getSubjectIcon = (name) => {
    switch (name) {
      case 'Aptitude': return Target;
      case 'Computer Science': return FileCode;
      case 'Company Prep': return Building;
      default: return BookOpen;
    }
  };

  const getSubjectColors = (name) => {
    switch (name) {
      case 'Aptitude': return 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30 text-cyan-400';
      case 'Computer Science': return 'from-brand-primary/20 to-brand-accent/5 border-brand-primary/30 text-brand-primary';
      case 'Company Prep': return 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-400';
      default: return 'from-slate-500/20 to-slate-500/5 border-slate-500/30 text-slate-400';
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
      {/* Navigation and Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link
            to="/mcq-practice"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to MCQ Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookMarked className="w-7 h-7 text-brand-primary" />
            Assessment Catalog
          </h1>
          <p className="text-xs text-slate-400">
            Browse through placement topics and test your skills.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/mcq/bookmarks"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-brand-border hover:border-brand-primary/50 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-inner"
          >
            Saved Vault ({bookmarksCount})
          </Link>
          <Link
            to="/mcq/questions"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-brand-primary/20"
          >
            View All Questions
          </Link>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {subjects.map((subj) => {
          const Icon = getSubjectIcon(subj.name);
          const colors = getSubjectColors(subj.name);

          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              key={subj.name}
              className="glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-5">
                {/* Subject Header */}
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-tr border shadow-inner ${colors.split(' ').slice(0, 3).join(' ')}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{subj.name}</h3>
                    <p className="text-[10px] text-slate-400 font-semibold">{subj.totalQuestions} questions available</p>
                  </div>
                </div>

                {/* Topics Accordion/List */}
                <div className="space-y-2.5 pt-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                  {subj.topics.map((tp) => (
                    <div
                      key={tp.name}
                      onClick={() => setSelectedTopic({ subject: subj.name, topic: tp.name })}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-brand-border/40 hover:border-brand-primary/40 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer group"
                    >
                      <span className="truncate pr-4">{tp.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-border text-slate-400 group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-all">
                          {tp.totalQuestions} Qs
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-slate-500 group-hover:text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quiz Configuration Modal */}
      <AnimatePresence>
        {selectedTopic && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTopic(null)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 m-auto w-[90%] max-w-md h-fit glass-panel rounded-2xl p-6 md:p-8 z-50 shadow-2xl flex flex-col gap-6"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-brand-border/60 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1 text-[10px] text-brand-secondary font-bold uppercase tracking-wider mb-1">
                    <Sliders className="w-3.5 h-3.5" />
                    Configure Assessment
                  </div>
                  <h3 className="text-lg font-black text-white">{selectedTopic.topic}</h3>
                  <p className="text-xs text-slate-400">Set parameters for this session.</p>
                </div>
              </div>

              {/* Configurations */}
              <div className="space-y-5">
                {/* Mode Select */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Practice Mode</label>
                  <div className="grid grid-cols-2 gap-3.5">
                    <button
                      onClick={() => setQuizMode('Practice')}
                      className={`py-3 rounded-xl border font-bold text-xs transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        quizMode === 'Practice'
                          ? 'bg-brand-primary/10 border-brand-primary text-white shadow-lg'
                          : 'bg-white/5 border-brand-border/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-brand-secondary" />
                      <span>Untimed Practice</span>
                      <span className="text-[8px] font-normal text-slate-400">Instant explanations</span>
                    </button>
                    <button
                      onClick={() => setQuizMode('Test')}
                      className={`py-3 rounded-xl border font-bold text-xs transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        quizMode === 'Test'
                          ? 'bg-brand-primary/10 border-brand-primary text-white shadow-lg'
                          : 'bg-white/5 border-brand-border/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Clock className="w-4 h-4 text-brand-warning" />
                      <span>Timed Test</span>
                      <span className="text-[8px] font-normal text-slate-400">60s per question</span>
                    </button>
                  </div>
                </div>

                {/* Length Select */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Question Count</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[5, 10, 15].map((cnt) => (
                      <button
                        key={cnt}
                        onClick={() => setQuizLength(cnt)}
                        className={`py-2 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                          quizLength === cnt
                            ? 'bg-brand-primary border-brand-primary text-white shadow-md'
                            : 'bg-white/5 border-brand-border/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cnt} Questions
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Select */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Difficulty Level</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['', 'Easy', 'Medium', 'Hard'].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        className={`py-2 rounded-lg border font-bold text-xs transition-all cursor-pointer ${
                          difficulty === diff
                            ? 'bg-brand-primary border-brand-primary text-white shadow-md'
                            : 'bg-white/5 border-brand-border/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {diff || 'All'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-brand-border/60">
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-brand-border text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const queryParams = new URLSearchParams({
                      subject: selectedTopic.subject,
                      topic: selectedTopic.topic,
                      mode: quizMode,
                      limit: quizLength.toString(),
                      difficulty
                    });
                    navigate(`/mcq/question/session?${queryParams.toString()}`);
                  }}
                  className="flex-1 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/95 text-xs font-bold text-white transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Launch Test
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
