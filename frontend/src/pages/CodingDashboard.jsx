import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code,
  Flame,
  Award,
  TrendingUp,
  ArrowRight,
  Loader,
  Play,
  Bookmark,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function CodingDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [difficultyDist, setDifficultyDist] = useState([]);
  const [categoryDist, setCategoryDist] = useState([]);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/coding/stats');
        setStats(statsRes.data.data.stats);
        setDifficultyDist(statsRes.data.data.difficultyDistribution || []);
        setCategoryDist(statsRes.data.data.categoryDistribution || []);

        const problemsRes = await api.get('/coding/problems');
        setProblems(problemsRes.data.data.problems.slice(0, 4));
      } catch (err) {
        console.error('Failed to load coding dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  const mockChartData = stats?.monthlySubmissions?.length > 0
    ? stats.monthlySubmissions.map(item => ({ name: item.date, count: item.count }))
    : [
        { name: 'Mon', count: 2 },
        { name: 'Tue', count: 4 },
        { name: 'Wed', count: 1 },
        { name: 'Thu', count: 5 },
        { name: 'Fri', count: 3 },
        { name: 'Sat', count: 8 },
        { name: 'Sun', count: 4 }
      ];

  const totalProblemsCount = 35; // Seeded max count
  const solvedCount = stats?.totalSolved || 0;
  const progressPercent = Math.round((solvedCount / totalProblemsCount) * 100);

  return (
    <div className="space-y-8 w-full">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden glass-panel p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent pointer-events-none" />
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
            <Code className="w-3.5 h-3.5" />
            Coding Practice Console
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Level Up Your <span className="text-gradient">Algorithmic Skills</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Practice problems tailored to software engineering interviews, compile your solutions, and evaluate execution performance metrics.
          </p>
        </div>
        <Link
          to="/coding-practice/problems"
          className="relative z-10 flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-sm font-bold text-white transition-all shadow-lg shadow-brand-primary/20 shrink-0"
        >
          View Problem Catalog
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Problems Solved</span>
            <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{solvedCount}</span>
            <span className="text-xs text-slate-500">/ {totalProblemsCount}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-brand-primary h-full rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Streak</span>
            <div className="p-2.5 bg-brand-warning/10 text-brand-warning rounded-xl">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats?.dailyStreak || 0}</span>
            <span className="text-xs text-slate-500">days</span>
          </div>
          <p className="text-xs text-slate-400">Keep practicing daily to build consistency.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Success Rate</span>
            <div className="p-2.5 bg-brand-success/10 text-brand-success rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats?.successRate || 0}%</span>
          </div>
          <p className="text-xs text-slate-400">Percent of correct solutions compiled.</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Main Language</span>
            <div className="p-2.5 bg-brand-secondary/10 text-brand-secondary rounded-xl">
              <Code className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white uppercase">
              {stats?.languagesUsed?.length > 0 ? stats.languagesUsed[0].language : 'JavaScript'}
            </span>
          </div>
          <p className="text-xs text-slate-400">Your most frequently used compile language.</p>
        </div>
      </div>

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Submission History Heatmap</h3>
            <p className="text-xs text-slate-400">Your coding activity volume trends over time.</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Difficulty Distribution</h3>
            <p className="text-xs text-slate-400">Breakdown of solved questions by difficulty.</p>
          </div>
          <div className="space-y-4 py-4">
            {difficultyDist.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{item.name}</span>
                  <span className="text-white font-bold">{item.count} solved</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: item.color,
                      width: `${solvedCount > 0 ? (item.count / solvedCount) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-brand-border/40 pt-4 flex justify-between items-center text-xs text-slate-400">
            <span>Overall completion rate</span>
            <span className="font-bold text-white">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Recommended Problems */}
      <div className="glass-panel p-6 rounded-2xl shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-brand-border/40 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recommended Problems</h3>
            <p className="text-xs text-slate-400">Curated algorithm questions based on your profile.</p>
          </div>
          <Link to="/coding-practice/problems" className="text-xs text-brand-primary font-bold hover:underline flex items-center gap-1">
            See all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problems.map((prob) => (
            <Link
              key={prob._id}
              to={`/coding-practice/problem/${prob.slug}`}
              className="p-4 rounded-xl bg-white/5 border border-brand-border/60 hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all duration-300 flex items-center justify-between"
            >
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white">{prob.title}</h4>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    prob.difficulty === 'Easy' ? 'bg-brand-success/15 text-brand-success' :
                    prob.difficulty === 'Medium' ? 'bg-brand-warning/15 text-brand-warning' :
                    'bg-brand-danger/15 text-brand-danger'
                  }`}>
                    {prob.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-400">{prob.category}</span>
                </div>
              </div>
              <Play className="w-5 h-5 text-slate-500 group-hover:text-brand-primary" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
