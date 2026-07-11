import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ProtectedLayout from './layouts/ProtectedLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import DashboardPage from './pages/DashboardPage';
import ResumePage from './pages/ResumePage';
import { 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  ChevronRight, 
  GraduationCap, 
  BarChart3, 
  FileText, 
  Video, 
  Code, 
  BookOpen, 
  Building, 
  TrendingUp 
} from 'lucide-react';

const MODULES = [
  { 
    id: 'dashboard', 
    name: 'Dashboard', 
    icon: BarChart3, 
    path: '/',
    phase: 'Phase 1 (Active)', 
    description: 'Central console displaying interview readiness, average score metrics, and conceptual strengths.' 
  },
  { 
    id: 'resume', 
    name: 'Resume Analyzer', 
    icon: FileText, 
    path: '/resume-analyzer',
    phase: 'Phase 3 (Upcoming)', 
    description: 'ATS resume score parsing and semantic suggestions powered by Google Gemini AI.' 
  },
  { 
    id: 'interviews', 
    name: 'Mock Interviews', 
    icon: Video, 
    path: '/mock-interviews',
    phase: 'Phase 4 (Upcoming)', 
    description: 'Automated interactive placements simulation with real-time video/text feedback and AI assessment.' 
  },
  { 
    id: 'coding', 
    name: 'Coding practice', 
    icon: Code, 
    path: '/coding-practice',
    phase: 'Phase 4 (Upcoming)', 
    description: 'Algorithm practices in an interactive code compiler sandboxed runtime environment.' 
  },
  { 
    id: 'mcqs', 
    name: 'MCQ placement practice', 
    icon: BookOpen, 
    path: '/mcq-practice',
    phase: 'Phase 4 (Upcoming)', 
    description: 'Conceptual placements multiple-choice questionnaire assessments with instantaneous reviews.' 
  },
  { 
    id: 'company', 
    name: 'Company-wise Prep', 
    icon: Building, 
    path: '/company-prep',
    phase: 'Phase 4 (Upcoming)', 
    description: 'Targeted preparation tracks configured for leading tech firms (Google, Microsoft, Amazon, etc.).' 
  },
  { 
    id: 'analytics', 
    name: 'System Analytics', 
    icon: TrendingUp, 
    path: '/analytics',
    phase: 'Phase 5 (Upcoming)', 
    description: 'Advanced student performance analytics, tracking skill levels and weaknesses.' 
  }
];

function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 w-full">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden glass-panel p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent pointer-events-none" />
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Active Session Enabled
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Logged in as <span className="text-gradient">{user?.fullName}</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Your credentials are authenticated using cryptographically signed JWT. Welcome to the dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-3.5 shrink-0 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-xs text-slate-200 font-semibold shadow-inner">
            <Cpu className="w-4 h-4 text-brand-secondary" />
            stateless JWT Token
          </span>
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-xs text-slate-200 font-semibold shadow-inner">
            <ShieldCheck className="w-4 h-4 text-brand-success" />
            Role: {user?.role}
          </span>
        </div>
      </div>

      {/* Grid of future modules */}
      <div className="space-y-6">
        <div className="border-b border-brand-border/60 pb-3">
          <h2 className="text-lg font-bold text-white">System Architecture & Future Modules</h2>
          <p className="text-xs text-slate-400">Review the modular layout of PrepAI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link 
                key={mod.id}
                to={mod.path}
                className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-brand-primary/10 border border-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      mod.id === 'dashboard' 
                        ? 'bg-brand-success/10 border border-brand-success/20 text-brand-success' 
                        : 'bg-brand-warning/10 border border-brand-warning/20 text-brand-warning'
                    }`}>
                      {mod.phase}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-base text-white group-hover:text-brand-primary transition-colors">{mod.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{mod.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-brand-border/40 text-xs text-slate-400 group-hover:text-white transition-colors">
                  <span>Explore roadmap layout</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlaceholderModule({ title, desc }) {
  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-brand-border/60 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-brand-primary/15 border border-brand-primary/20 text-brand-primary rounded-2xl">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white">{title}</h2>
            <p className="text-sm text-slate-400">{desc}</p>
          </div>
        </div>
        <span className="px-4 py-1.5 bg-brand-warning/10 border border-brand-warning/20 text-brand-warning text-xs font-bold uppercase tracking-wider rounded-full">
          Upcoming Phase
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-secondary mb-2">Technical Implementation Plan</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              This module represents core platform functionalities scheduled for the next development sprint. It will fetch endpoints via standardized Axios calls and map model datasets inside MongoDB Atlas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-brand-border/60 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Anticipated Design Parameters:</h4>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>Stateless JWT authentication check constraints.</li>
              <li>Lightweight request body validation filters.</li>
              <li>Dynamic visual reports using Recharts graphs.</li>
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="px-5 py-2.5 bg-white/5 border border-brand-border hover:border-brand-primary/50 hover:bg-brand-primary/10 rounded-xl text-xs font-semibold text-white transition-all"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute allowIncompleteProfile={true}>
                  <OnboardingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <ProtectedLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="profile/edit" element={<EditProfilePage />} />
              <Route path="resume-analyzer" element={<ResumePage />} />
              <Route path="mock-interviews" element={<PlaceholderModule title="Mock Interviews" desc="Interactive interview simulation and scoring." />} />
              <Route path="coding-practice" element={<PlaceholderModule title="Coding practice" desc="Algorithmic practice sandbox." />} />
              <Route path="mcq-practice" element={<PlaceholderModule title="MCQ placement practice" desc="Subject-based conceptual quizzes." />} />
              <Route path="company-prep" element={<PlaceholderModule title="Company-wise Prep" desc="Placement tracks for top tech firms." />} />
              <Route path="analytics" element={<PlaceholderModule title="System Analytics" desc="Advanced student progression curves." />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
