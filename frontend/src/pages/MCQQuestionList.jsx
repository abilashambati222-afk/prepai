import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Loader,
  ArrowLeft,
  Sliders,
  CheckCircle,
  HelpCircle,
  Play
} from 'lucide-react';
import api from '../lib/api';

export default function MCQQuestionList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [solvedStatus, setSolvedStatus] = useState('');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  const fetchQuestions = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      if (search) params.append('search', search);
      if (subject) params.append('subject', subject);
      if (difficulty) params.append('difficulty', difficulty);
      if (solvedStatus) params.append('solvedStatus', solvedStatus);
      if (bookmarkedOnly) params.append('bookmarkedOnly', 'true');

      const res = await api.get(`/mcq/questions?${params.toString()}`);
      if (res.data?.success) {
        setQuestions(res.data.data.questions || []);
        setTotalQuestions(res.data.data.totalQuestions || 0);
        setTotalPages(res.data.data.totalPages || 1);
        setCurrentPage(res.data.data.currentPage || 1);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(1);
  }, [subject, difficulty, solvedStatus, bookmarkedOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQuestions(1);
  };

  const handleToggleBookmark = async (qId) => {
    try {
      const res = await api.post(`/mcq/bookmark/${qId}`);
      if (res.data?.success) {
        setQuestions(prev => prev.map(q => 
          q._id === qId ? { ...q, isBookmarked: res.data.data.bookmarked } : q
        ));
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleToggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8 w-full">
      {/* Title block */}
      <div className="space-y-2">
        <Link
          to="/mcq-practice"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to MCQ Dashboard
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Questions Repository
        </h1>
        <p className="text-xs text-slate-400">
          Search and practice individual questions from our complete placements database.
        </p>
      </div>

      {/* Filter panel */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
          {/* Search box */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by keywords, formulas, or topics..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-border/60 focus:border-brand-primary bg-[#0f172a] text-slate-200 text-xs transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-brand-primary text-white text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Extended filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Subject Filter */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Subject</span>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-brand-border/60 bg-[#0f172a] text-xs text-slate-300"
            >
              <option value="">All Subjects</option>
              <option value="Aptitude">Aptitude</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Company Prep">Company Prep</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Difficulty</span>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-brand-border/60 bg-[#0f172a] text-xs text-slate-300"
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Solved Status Filter */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Solved Status</span>
            <select
              value={solvedStatus}
              onChange={e => setSolvedStatus(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-brand-border/60 bg-[#0f172a] text-xs text-slate-300"
            >
              <option value="">All Statuses</option>
              <option value="solved">Solved</option>
              <option value="unsolved">Unsolved</option>
            </select>
          </div>

          {/* Bookmarks toggle */}
          <div className="flex items-end pb-1.5">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={bookmarkedOnly}
                onChange={e => setBookmarkedOnly(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-brand-border text-brand-primary accent-brand-primary cursor-pointer"
              />
              <span>Bookmarked Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {loading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader className="w-8 h-8 text-brand-primary animate-spin" />
          </div>
        ) : questions.length === 0 ? (
          <div className="glass-panel p-16 text-center text-slate-400 text-xs">
            No questions match the current filters. Try refining your parameters.
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const isExpanded = expandedId === q._id;
              return (
                <div key={q._id} className="glass-panel rounded-2xl overflow-hidden transition-all duration-300">
                  {/* Summary trigger */}
                  <div
                    onClick={() => handleToggleExpand(q._id)}
                    className="p-5 flex items-start md:items-center justify-between gap-6 cursor-pointer hover:bg-white/3 transition-colors"
                  >
                    <div className="flex items-start md:items-center gap-4 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-brand-border flex items-center justify-center font-bold text-xs text-slate-400 shrink-0">
                        {(currentPage - 1) * 10 + idx + 1}
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
                        onClick={() => handleToggleBookmark(q._id)}
                        className="p-2 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                        title="Bookmark Question"
                      >
                        <Bookmark className={`w-4 h-4 ${q.isBookmarked ? 'fill-brand-secondary text-brand-secondary border-brand-secondary' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleToggleExpand(q._id)}
                        className="p-2 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail */}
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
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Question:</span>
                            <p className="text-sm font-semibold text-slate-200 whitespace-pre-wrap leading-relaxed">
                              {q.question}
                            </p>
                          </div>

                          {/* Options grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map((option, optIdx) => {
                              const optionLabel = String.fromCharCode(65 + optIdx);
                              const isCorrect = q.correctOptionIndex === optIdx;

                              return (
                                <div
                                  key={optIdx}
                                  className={`flex items-start gap-4 p-4 rounded-xl border font-semibold text-xs transition-all ${
                                    isCorrect 
                                      ? 'border-brand-success bg-brand-success/15 text-white' 
                                      : 'border-brand-border/60 bg-white/5 text-slate-400 opacity-60'
                                  }`}
                                >
                                  <span className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                                    isCorrect ? 'bg-brand-success text-white' : 'bg-brand-border/80 text-slate-500'
                                  }`}>
                                    {optionLabel}
                                  </span>
                                  <span className="leading-relaxed pt-0.5">{option}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Quick launcher */}
                          <div className="pt-2 border-t border-brand-border/40 flex justify-end">
                            <button
                              onClick={() => {
                                const params = new URLSearchParams({
                                  subject: q.subject,
                                  topic: q.topic,
                                  mode: 'Practice',
                                  limit: '10'
                                });
                                navigate(`/mcq/question/session?${params.toString()}`);
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              Practice Topic: {q.topic}
                            </button>
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => fetchQuestions(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white/5 border border-brand-border hover:border-brand-primary text-xs font-bold rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            Prev
          </button>
          <span className="text-xs text-slate-400 font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => fetchQuestions(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white/5 border border-brand-border hover:border-brand-primary text-xs font-bold rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
