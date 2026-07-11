import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import ProfileCompletionCard from '../components/ProfileCompletionCard';
import {
  Sparkles,
  Flame,
  Code,
  Building,
  BellRing,
  ChevronRight,
  FileText,
  Video,
  BookOpen,
  BarChart3,
  User,
  Cpu,
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        if (response.data?.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error('Failed to retrieve dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-44 bg-white/5 border border-brand-border/60 rounded-2xl" />

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white/5 border border-brand-border/60 rounded-2xl" />
          ))}
        </div>

        {/* Content Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-white/5 border border-brand-border/60 rounded-2xl" />
            <div className="h-48 bg-white/5 border border-brand-border/60 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <div className="h-60 bg-white/5 border border-brand-border/60 rounded-2xl" />
            <div className="h-56 bg-white/5 border border-brand-border/60 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const { user, streak, todaysGoal, quickStats, quickActions } = stats;

  const resumeStatus = stats.resumeStatus || {
    uploaded: false,
    originalFileName: '',
    version: 1,
    status: 'Not Uploaded',
    parsingConfidence: 0,
    lastParsed: null,
    fileSize: 0,
  };

  return (
    <div className="space-y-8 w-full">

      {/* 1. Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden glass-panel p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent pointer-events-none" />
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Candidate Dashboard
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="text-gradient">{user.fullName}</span>!
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
            Let's prepare for your upcoming placements. Target Role: <span className="text-brand-secondary font-bold">{user.targetRole || 'Not Set'}</span> ({user.experienceLevel}).
          </p>
        </div>
        <div className="flex flex-wrap gap-3.5 shrink-0 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-xs text-slate-200 font-semibold shadow-inner">
            <Cpu className="w-4 h-4 text-brand-secondary" />
            Active Session
          </span>
          <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-xs text-slate-200 font-semibold shadow-inner">
            <ShieldCheck className="w-4 h-4 text-brand-success" />
            Auth Verified
          </span>
        </div>
      </div>

      {/* 2. SVG Circular completion widget */}
      <ProfileCompletionCard />

      {/* 3. Quick Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Streak */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-brand-border/40">
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl">
            <Flame className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Prep Streak</span>
            <p className="text-lg font-black text-white">{streak} Day{streak > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Skills count */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-brand-border/40">
          <div className="p-3 bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary rounded-xl">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Skills Inventory</span>
            <p className="text-lg font-black text-white">{quickStats.skillsCount} Skill{quickStats.skillsCount !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Target companies */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-brand-border/40">
          <div className="p-3 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent rounded-xl">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dream Companies</span>
            <p className="text-lg font-black text-white">{quickStats.companiesCount} Target{quickStats.companiesCount !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-brand-border/40">
          <div className="p-3 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Daily Alerts</span>
            <p className="text-lg font-black text-white">{quickStats.notificationsStatus}</p>
          </div>
        </div>

      </div>

      {/* 4. Multi column dashboard panels layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Columns: Goals and Quick Actions */}
        <div className="lg:col-span-2 space-y-6">

          {/* Quick Actions widget */}
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <div>
              <h3 className="text-sm font-extrabold text-white">Console Quick Actions</h3>
              <p className="text-xs text-slate-400">Navigate or trigger key platform components.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map(act => (
                <button
                  key={act.id}
                  onClick={() => {
                    if (act.available) {
                      navigate(act.action);
                    }
                  }}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-300 relative overflow-hidden group cursor-pointer ${act.available
                      ? 'bg-brand-primary/5 hover:bg-brand-primary/10 border-brand-primary/25 hover:border-brand-primary/40 text-white'
                      : 'bg-white/2 border-brand-border/30 text-slate-400 cursor-not-allowed'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-xs text-slate-200 group-hover:text-white transition-colors">{act.name}</span>
                  </div>
                  {act.available ? (
                    <ChevronRight className="w-4 h-4 text-brand-primary transition-transform group-hover:translate-x-0.5" />
                  ) : (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-warning/10 border border-brand-warning/20 text-brand-warning px-2 py-0.5 rounded-full shrink-0">
                      Coming Soon
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Today's Goal Progress */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Daily Practice Goals</h3>
                <p className="text-xs text-slate-400">Your practice targets for today.</p>
              </div>
              <span className="text-xs font-bold text-brand-secondary">{todaysGoal.completed} / {todaysGoal.target} solved</span>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="w-full bg-brand-dark/60 rounded-full h-3 border border-brand-border/80 overflow-hidden p-[2px]">
                <div
                  className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(todaysGoal.completed / todaysGoal.target) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>0% done</span>
                <span>Goal: {todaysGoal.target} questions ({user.preferredDifficulty} mode)</span>
              </div>
            </div>
          </div>

          {/* Activity Timeline Placeholder */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
              <h3 className="text-sm font-bold text-white">Activity Timeline</h3>
              <span className="text-[10px] text-slate-500 font-medium">Logged updates</span>
            </div>

            <div className="space-y-4 pt-2 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-brand-border/60">

              <div className="relative pl-6 space-y-1">
                <div className="absolute left-[5px] top-[6px] w-[7px] h-[7px] rounded-full bg-brand-success border border-brand-dark shadow" />
                <p className="text-xs font-bold text-slate-200">Account session authenticated</p>
                <p className="text-[10px] text-slate-400">Decoded JWT secure token</p>
              </div>

              <div className="relative pl-6 space-y-1">
                <div className="absolute left-[5px] top-[6px] w-[7px] h-[7px] rounded-full bg-brand-primary border border-brand-dark shadow" />
                <p className="text-xs font-bold text-slate-200">Profile onboarding setup verified</p>
                <p className="text-[10px] text-slate-400">Onboarding checklist completed</p>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Roadmap Progression Cards */}
        <div className="space-y-6">

          {/* Resume status widget */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-brand-primary/5 blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl">
                <FileText className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Resume Analysis</h4>
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-primary">Phase 5 (Active)</span>
              </div>
            </div>
            <div className="space-y-2 pt-1 text-xs">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Analyze your resume against ATS benchmarks using Gemini AI insights.
              </p>
              {resumeStatus.uploaded ? (
                <div className="space-y-1.5 p-3 rounded-xl bg-brand-success/5 border border-brand-success/20">
                  <div className="text-[10px] text-brand-success font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[150px]">{resumeStatus.originalFileName}</span>
                  </div>
                  <div className="text-[9px] text-slate-400 flex flex-col gap-1.5 pt-1 border-t border-brand-border/40 mt-1.5">
                    <div className="flex justify-between"><span>Resume Uploaded:</span><span className="text-white font-bold">Yes</span></div>
                    <div className="flex justify-between"><span>Version:</span><span className="text-white font-bold">{resumeStatus.version}</span></div>
                    <div className="flex justify-between"><span>Status:</span><span className="text-white font-bold">{resumeStatus.status}</span></div>
                    <div className="flex justify-between"><span>Parsing Confidence:</span><span className="text-brand-primary font-bold">{resumeStatus.parsingConfidence}%</span></div>
                    <div className="flex justify-between"><span>Last Parsed:</span><span className="text-white font-bold">{resumeStatus.lastParsed ? new Date(resumeStatus.lastParsed).toLocaleDateString() : 'N/A'}</span></div>
                    <div className="flex justify-between"><span>File Size:</span><span className="text-white font-bold">{parseFloat((resumeStatus.fileSize / (1024 * 1024)).toFixed(2))} MB</span></div>
                  </div>
                </div>
              ) : (
                <div className="text-[10px] text-brand-error font-semibold flex items-center gap-1">
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span>No Resume Uploaded</span>
                </div>
              )}
            </div>
            <div className="pt-2">
              <Link
                to="/resume-analyzer"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-brand-primary/10 border border-brand-primary/25 hover:bg-brand-primary/20 text-brand-primary rounded-xl text-xs font-bold transition-all text-center"
              >
                {resumeStatus.uploaded ? 'Manage Resume' : 'Upload Resume'}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Mock interview progress */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-brand-secondary/5 blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary rounded-xl">
                <Video className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Mock Interviews</h4>
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-warning">Phase 4</span>
              </div>
            </div>
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Simulate placements rounds using custom generated questions.
              </p>
              <div className="text-[10px] text-slate-400 font-semibold italic">
                0 Simulations completed
              </div>
            </div>
            <div className="pt-3 border-t border-brand-border/40">
              <button disabled className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-brand-border/40 text-[10px] text-slate-500 font-bold cursor-not-allowed">
                Simulate Interview (Coming Soon)
              </button>
            </div>
          </div>

          {/* Coding compiler progress */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                <Code className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">Coding practice</h4>
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-warning">Phase 4</span>
              </div>
            </div>
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Practice algorithms in a sandboxed compiler runtime.
              </p>
              <div className="text-[10px] text-slate-400 font-semibold italic">
                0 Algorithmic problems solved
              </div>
            </div>
            <div className="pt-3 border-t border-brand-border/40">
              <button disabled className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-brand-border/40 text-[10px] text-slate-500 font-bold cursor-not-allowed">
                Open Sandbox (Coming Soon)
              </button>
            </div>
          </div>

          {/* MCQ test progress */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                <BookOpen className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-white">MCQ Practice</h4>
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-warning">Phase 4</span>
              </div>
            </div>
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Test placement topics like OS, DBMS, Networks, and OOPS.
              </p>
              <div className="text-[10px] text-slate-400 font-semibold italic">
                0 Quizzes completed
              </div>
            </div>
            <div className="pt-3 border-t border-brand-border/40">
              <button disabled className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/5 border border-brand-border/40 text-[10px] text-slate-500 font-bold cursor-not-allowed">
                Start Quizzes (Coming Soon)
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
