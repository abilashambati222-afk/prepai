import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import {
  Sparkles,
  Play,
  History,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  BookOpen,
  Building,
  Target
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function InterviewDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/interview/analytics');
        if (res.data?.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch interview analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-44 bg-white/5 border border-brand-border/60 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white/5 border border-brand-border/60 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const {
    overallInterviewScore = 0,
    technicalScore = 0,
    hrScore = 0,
    communicationScore = 0,
    confidenceScore = 0,
    behaviorScore = 0,
    codingScore = 0,
    completedInterviewsCount = 0,
    weakAreas = [],
    strongAreas = [],
    progressHistory = []
  } = stats || {};

  return (
    <div className="space-y-8 w-full">
      {/* 1. Header Banner */}
      <div className="relative rounded-2xl overflow-hidden glass-panel p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent pointer-events-none" />
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Interview Intelligence
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Mock <span className="text-gradient">Interview Console</span>
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
            Practice mock rounds simulating top company hiring patterns. Verify if you are interview ready and track improvements over time.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10 shrink-0">
          <Link
            to="/mock-interviews/setup"
            className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg hover:shadow-brand-primary/20 active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            Start Mock Interview
          </Link>
          <Link
            to="/mock-interviews/history"
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-brand-border hover:bg-white/10 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <History className="w-4 h-4" />
            View History
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Readiness */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-brand-border/40">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Interview Readiness</span>
            <p className="text-2xl font-black text-white">{overallInterviewScore}%</p>
          </div>
          {/* Progress Ring */}
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="23" stroke="#1e294b" strokeWidth="4" fill="transparent" />
              <circle
                cx="28" cy="28" r="23"
                stroke="var(--color-brand-primary)" strokeWidth="4" fill="transparent"
                strokeDasharray={144.5}
                strokeDashoffset={144.5 - (144.5 * overallInterviewScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-300">
              {overallInterviewScore}%
            </span>
          </div>
        </div>

        {/* Total Sessions */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-brand-border/40">
          <div className="p-3 bg-brand-secondary/15 border border-brand-secondary/20 text-brand-secondary rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Simulations Run</span>
            <p className="text-2xl font-black text-white">{completedInterviewsCount}</p>
          </div>
        </div>

        {/* Average Scores */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-brand-border/40">
          <div className="p-3 bg-brand-success/15 border border-brand-success/20 text-brand-success rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Technical Avg</span>
            <p className="text-2xl font-black text-white">{technicalScore}%</p>
          </div>
        </div>

        {/* HR Score */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-brand-border/40">
          <div className="p-3 bg-brand-accent/15 border border-brand-accent/20 text-brand-accent rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">HR Avg</span>
            <p className="text-2xl font-black text-white">{hrScore}%</p>
          </div>
        </div>
      </div>

      {/* 3. Detailed Dimensions & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Progress History Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
            <h3 className="text-sm font-extrabold text-white">Interview Progression Curve</h3>
            <span className="text-[10px] text-slate-400 uppercase font-black">Score History</span>
          </div>
          
          <div className="h-64 w-full pt-4">
            {progressHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressHistory}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-brand-primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0e1326', borderColor: '#1e294b', color: '#fff' }} />
                  <Area type="monotone" dataKey="score" stroke="var(--color-brand-primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
                <TrendingUp className="w-8 h-8 text-slate-600" />
                No simulation data points logged yet. Start an interview to see progression curves.
              </div>
            )}
          </div>
        </div>

        {/* Right: Dimension Scores */}
        <div className="glass-panel p-6 rounded-2xl space-y-5">
          <h3 className="text-sm font-extrabold text-white border-b border-brand-border/40 pb-3">
            Hiring Dimension Scores
          </h3>

          <div className="space-y-4">
            {/* Communication */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-300">
                <span>Communication Fluency</span>
                <span>{communicationScore}%</span>
              </div>
              <div className="w-full bg-brand-dark rounded-full h-2 overflow-hidden border border-brand-border">
                <div className="bg-brand-primary h-full" style={{ width: `${communicationScore}%` }} />
              </div>
            </div>

            {/* Confidence */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-300">
                <span>Speech Confidence</span>
                <span>{confidenceScore}%</span>
              </div>
              <div className="w-full bg-brand-dark rounded-full h-2 overflow-hidden border border-brand-border">
                <div className="bg-brand-secondary h-full" style={{ width: `${confidenceScore}%` }} />
              </div>
            </div>

            {/* Behavior */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-300">
                <span>Behavioral (STAR alignment)</span>
                <span>{behaviorScore}%</span>
              </div>
              <div className="w-full bg-brand-dark rounded-full h-2 overflow-hidden border border-brand-border">
                <div className="bg-brand-accent h-full" style={{ width: `${behaviorScore}%` }} />
              </div>
            </div>

            {/* Coding */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-300">
                <span>Algorithmic Coding</span>
                <span>{codingScore}%</span>
              </div>
              <div className="w-full bg-brand-dark rounded-full h-2 overflow-hidden border border-brand-border">
                <div className="bg-brand-success h-full" style={{ width: `${codingScore}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Strengths, Weaknesses, and Platform Tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Topic Breakdown */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
            <Target className="w-4.5 h-4.5 text-brand-primary" />
            Conceptual Evaluation
          </h3>

          <div className="grid grid-cols-2 gap-4 pt-1">
            {/* Weak Areas */}
            <div className="space-y-3">
              <span className="text-[10px] text-brand-error font-black uppercase tracking-wider block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Focus Areas (Weak)
              </span>
              <ul className="space-y-2">
                {weakAreas.length > 0 ? (
                  weakAreas.map((topic, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-center gap-2 bg-brand-error/5 border border-brand-error/10 p-2 rounded-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-error shrink-0" />
                      <span className="truncate">{topic}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-500 italic">No critical gaps detected.</li>
                )}
              </ul>
            </div>

            {/* Strong Areas */}
            <div className="space-y-3">
              <span className="text-[10px] text-brand-success font-black uppercase tracking-wider block flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Strong Concepts
              </span>
              <ul className="space-y-2">
                {strongAreas.length > 0 ? (
                  strongAreas.map((topic, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-center gap-2 bg-brand-success/5 border border-brand-success/10 p-2 rounded-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-success shrink-0" />
                      <span className="truncate">{topic}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-500 italic">Complete interviews to list strengths.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Preparation tracks shortcuts */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-white border-b border-brand-border/40 pb-3 flex items-center gap-2">
            <Building className="w-4.5 h-4.5 text-brand-secondary" />
            Specialized Placements Tracks
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <Link
              to="/mock-interviews/company"
              className="p-4 rounded-xl border border-brand-border/60 bg-white/2 hover:bg-brand-primary/5 hover:border-brand-primary/40 transition-all duration-300 group block"
            >
              <h4 className="text-xs font-black text-white group-hover:text-brand-primary transition-colors">Company tracks</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">Google, Amazon, Microsoft style simulations.</p>
              <div className="flex items-center justify-between text-[9px] text-brand-secondary font-bold mt-4 pt-2 border-t border-brand-border/45">
                <span>Explore Company Loops</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>

            <Link
              to="/mock-interviews/role"
              className="p-4 rounded-xl border border-brand-border/60 bg-white/2 hover:bg-brand-secondary/5 hover:border-brand-secondary/40 transition-all duration-300 group block"
            >
              <h4 className="text-xs font-black text-white group-hover:text-brand-secondary transition-colors">Role Specifics</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">Frontend, Backend, AI, and Cloud tracks.</p>
              <div className="flex items-center justify-between text-[9px] text-brand-secondary font-bold mt-4 pt-2 border-t border-brand-border/45">
                <span>Explore Roles</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
