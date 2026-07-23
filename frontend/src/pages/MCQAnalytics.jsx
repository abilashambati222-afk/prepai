import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  Clock,
  Loader,
  ArrowLeft,
  Calendar,
  Zap,
  ShieldAlert
} from 'lucide-react';
import api from '../lib/api';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';

export default function MCQAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/mcq/stats');
        if (res.data?.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  if (!stats || stats.totalQuizzes === 0) {
    return (
      <div className="glass-panel p-16 text-center max-w-md mx-auto my-12 space-y-4">
        <ShieldAlert className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Analytics Data Yet</h3>
        <p className="text-xs text-slate-400">Complete practice sessions to visualize historical statistics.</p>
        <Link to="/mcq/categories" className="inline-flex px-5 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-xl cursor-pointer">
          Solve Quiz
        </Link>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 w-full">
      {/* Title */}
      <div className="space-y-2">
        <Link
          to="/mcq-practice"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to MCQ Dashboard
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-brand-secondary" />
          Advanced MCQ Analytics
        </h1>
        <p className="text-xs text-slate-400">
          Visualize accuracy trends, category strengths, solving speed, and placements readiness.
        </p>
      </div>

      {/* Stats summary rows */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-5 rounded-2xl space-y-2 relative overflow-hidden">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Solved Count</span>
          <h2 className="text-2xl font-black text-white">{stats.totalQuestionsSolved}</h2>
          <p className="text-[9px] text-slate-500">Total answered questions</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl space-y-2 relative overflow-hidden">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Average Accuracy</span>
          <h2 className="text-2xl font-black text-brand-success">{stats.averageAccuracy}%</h2>
          <p className="text-[9px] text-slate-500">Correct solution ratio</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl space-y-2 relative overflow-hidden">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Quizzes Logged</span>
          <h2 className="text-2xl font-black text-brand-secondary">{stats.totalQuizzes}</h2>
          <p className="text-[9px] text-slate-500">Completed test sessions</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl space-y-2 relative overflow-hidden">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Solve Speed</span>
          <h2 className="text-2xl font-black text-cyan-400">54s</h2>
          <p className="text-[9px] text-slate-500">Average time per question</p>
        </div>
      </div>

      {/* Recharts grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Area chart: Accuracy trend */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-brand-primary" />
            Accuracy Trend Over Time
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.recentPerformance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0e1326', borderColor: '#1e294b', borderRadius: '12px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#6366f1" strokeWidth={2.5} fill="url(#accGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart: Subject performance */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-brand-secondary" />
            Subject Wise Performance
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.subjectPerformance} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="subject" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0e1326', borderColor: '#1e294b', fontSize: '10px' }} />
                <Bar dataKey="accuracy" name="Accuracy %" radius={[6, 6, 0, 0]} maxBarSize={45}>
                  {stats.subjectPerformance?.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart: Difficulty Spread */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Correct Answers by Difficulty
          </h3>
          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.difficultyPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="difficulty"
                >
                  {stats.difficultyPerformance?.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0e1326', borderColor: '#1e294b', fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-[10px] text-slate-400 font-semibold pb-2">
            {stats.difficultyPerformance?.map((entry, idx) => (
              <div key={entry.difficulty} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span>{entry.difficulty} ({entry.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar chart: Daily solving timeline */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-brand-success" />
            Daily Questions Solved
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyProgress} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0e1326', borderColor: '#1e294b', fontSize: '10px' }} />
                <Bar dataKey="count" name="Questions Solved" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
