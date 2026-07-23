import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Award,
  Clock,
  ChevronRight,
  TrendingUp,
  Bookmark,
  Sparkles,
  Loader,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import api from '../services/api'; // Wait! Let's check where the api client is in frontend. It's either in '../services/api' or '../lib/api'.
// In CodingDashboard.jsx it was: import api from '../lib/api'; Let's use '../lib/api'.
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';

export default function MCQDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [topicsData, setTopicsData] = useState([]);
  const [stats, setStats] = useState(null);
  const [bookmarksCount, setBookmarksCount] = useState(0);

  // Quiz configuration modal state
  const [selectedTopic, setSelectedTopic] = useState(null); // { subject, topic }
  const [quizMode, setQuizMode] = useState('Practice'); // Practice or Test
  const [quizLength, setQuizLength] = useState(10); // 5, 10, 15
  const [difficulty, setDifficulty] = useState(''); // Empty means 'All'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [topicsRes, statsRes] = await Promise.all([
          api.get('/mcq/topics'),
          api.get('/mcq/stats')
        ]);

        if (topicsRes.data?.success) {
          setTopicsData(topicsRes.data.data.subjects || []);
          setBookmarksCount(topicsRes.data.data.bookmarksCount || 0);
        }

        if (statsRes.data?.success) {
          setStats(statsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load MCQ Dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStartQuiz = () => {
    if (!selectedTopic) return;
    const queryParams = new URLSearchParams({
      subject: selectedTopic.subject,
      topic: selectedTopic.topic,
      mode: quizMode,
      limit: quizLength.toString(),
      difficulty: difficulty
    });
    navigate(`/mcq/question/session?${queryParams.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  // Format data for Recharts
  const trendData = stats?.recentPerformance?.length > 0
    ? stats.recentPerformance
    : [
        { date: 'Quiz 1', accuracy: 60 },
        { date: 'Quiz 2', accuracy: 70 },
        { date: 'Quiz 3', accuracy: 60 },
        { date: 'Quiz 4', accuracy: 80 },
        { date: 'Quiz 5', accuracy: 90 }
      ];

  const subjectData = stats?.subjectPerformance?.length > 0
    ? stats.subjectPerformance
    : [
        { subject: 'Aptitude', accuracy: 75 },
        { subject: 'Computer Science', accuracy: 65 },
        { subject: 'Company Prep', accuracy: 80 }
      ];

  // Subject icon mapping
  const getSubjectIcon = (name) => {
    switch (name) {
      case 'Aptitude':
        return Clock;
      case 'Computer Science':
        return BookOpen;
      case 'Company Prep':
        return Award;
      default:
        return HelpCircle;
    }
  };

  const getSubjectColors = (name) => {
    switch (name) {
      case 'Aptitude':
        return 'from-cyan-500/20 to-blue-500/5 border-cyan-500/30 text-cyan-400';
      case 'Computer Science':
        return 'from-brand-primary/20 to-brand-accent/5 border-brand-primary/30 text-brand-primary';
      case 'Company Prep':
        return 'from-emerald-500/20 to-teal-500/5 border-emerald-500/30 text-emerald-400';
      default:
        return 'from-slate-500/20 to-slate-500/5 border-slate-500/30 text-slate-400';
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden glass-panel p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-brand-secondary/5 to-transparent pointer-events-none" />
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" />
            MCQ Placement practice
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Master Technical & <span className="text-gradient">Aptitude Assessments</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Practice conceptual questions covering quantitative aptitude, Core CS (OS, DBMS, Networks, OOPS), and leading tech firm assessment templates.
          </p>
        </div>
        <div className="flex flex-wrap gap-3.5 relative z-10 shrink-0">
          <Link
            to="/mcq/bookmarks"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-brand-border hover:border-brand-primary/50 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-inner"
          >
            <Bookmark className="w-4 h-4 text-brand-secondary" />
            Vault ({bookmarksCount})
          </Link>
          <Link
            to="/mcq/history"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-brand-border hover:border-brand-primary/50 text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            History
          </Link>
          <Link
            to="/mcq/leaderboard"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-brand-border hover:border-brand-primary/50 text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            Leaderboard
          </Link>
          <Link
            to="/mcq/analytics"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-brand-primary/20"
          >
            Analytics
          </Link>
        </div>
      </div>

      {/* Statistics Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-brand-primary/5 blur-2xl pointer-events-none" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Completed Quizzes</span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-white">{stats?.totalQuizzes || 0}</h2>
            <span className="text-xs text-slate-500">sessions</span>
          </div>
          <p className="text-[10px] text-slate-500">Consistently track conceptual readiness.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Average Accuracy</span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-emerald-400">{stats?.averageAccuracy || 0}%</h2>
            <span className="text-xs text-slate-500">correct rate</span>
          </div>
          <p className="text-[10px] text-slate-500">Target a minimum of 80% accuracy for premium placement readiness.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Questions Solved</span>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-black text-cyan-400">{stats?.totalQuestionsSolved || 0}</h2>
            <span className="text-xs text-slate-500">questions</span>
          </div>
          <p className="text-[10px] text-slate-500">Diverse MCQ coverage builds analytical depth.</p>
        </div>
      </div>

      {/* Analytics Charts */}
      {stats?.totalQuizzes > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Accuracy Trend Chart */}
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-brand-primary" />
                Accuracy Trend
              </h3>
              <p className="text-[11px] text-slate-400">Your accuracy percentage over the last 7 sessions</p>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0e1326',
                      borderColor: '#1e294b',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '11px'
                    }}
                  />
                  <Area type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#accuracyGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Performance Bar Chart */}
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-secondary" />
                Subject Performance
              </h3>
              <p className="text-[11px] text-slate-400">Accuracy comparison across practice areas</p>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="subject" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0e1326',
                      borderColor: '#1e294b',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="accuracy" name="Accuracy %" radius={[6, 6, 0, 0]} maxBarSize={45}>
                    {subjectData.map((entry, index) => {
                      const colors = ['#06b6d4', '#6366f1', '#10b981'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Main Subjects Grid */}
      <div className="space-y-6">
        <div className="border-b border-brand-border/60 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Assessment Catalogs</h2>
            <p className="text-xs text-slate-400">Select a subject and configure a practice session.</p>
          </div>
        </div>

        {topicsData.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-400 text-sm border-dashed">
            No MCQ categories found in the database. Please run the seed script to populate.
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {topicsData.map((subj) => {
              const Icon = getSubjectIcon(subj.name);
              const cardColors = getSubjectColors(subj.name);

              return (
                <div key={subj.name} className="glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-5">
                    {/* Subject Header */}
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-tr border shadow-inner ${cardColors.split(' ').slice(0, 3).join(' ')}`}>
                        <Icon className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-white">{subj.name}</h3>
                        <p className="text-[10px] text-slate-400 font-semibold">{subj.totalQuestions} questions available</p>
                      </div>
                    </div>

                    {/* Topics List */}
                    <div className="space-y-2.5 pt-2">
                      {subj.topics.map((tp) => (
                        <button
                          key={tp.name}
                          onClick={() => setSelectedTopic({ subject: subj.name, topic: tp.name })}
                          className="w-full flex items-center justify-between p-3 rounded-xl border border-brand-border/40 hover:border-brand-primary/40 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer group"
                        >
                          <span className="truncate pr-4">{tp.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-border text-slate-400 group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-all">
                              {tp.totalQuestions} Qs
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-slate-500 group-hover:text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quiz Configuration Modal/Overlay */}
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
                    Configure Quiz
                  </div>
                  <h3 className="text-lg font-black text-white">{selectedTopic.topic}</h3>
                  <p className="text-xs text-slate-400">Customize parameters for your session.</p>
                </div>
              </div>

              {/* Configurations */}
              <div className="space-y-5 flex-1">
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
                      <Clock className="w-4 h-4 text-brand-warning animate-pulse" />
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
                  onClick={handleStartQuiz}
                  className="flex-1 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/95 text-xs font-bold text-white transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Launch Quiz
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
