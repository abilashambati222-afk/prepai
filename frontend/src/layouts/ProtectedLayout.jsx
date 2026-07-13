import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Video,
  Code,
  BookOpen,
  BarChart3,
  GraduationCap,
  Menu,
  X,
  Bell,
  ChevronRight,
  LogOut,
  Building,
  TrendingUp
} from 'lucide-react';

const MODULES = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: BarChart3,
    path: '/'
  },
  {
    id: 'resume',
    name: 'Resume Analyzer',
    icon: FileText,
    path: '/resume-analyzer'
  },
  {
    id: 'interviews',
    name: 'Mock Interviews',
    icon: Video,
    path: '/mock-interviews'
  },
  {
    id: 'coding',
    name: 'Coding practice',
    icon: Code,
    path: '/coding-practice'
  },
  {
    id: 'mcqs',
    name: 'MCQ placement practice',
    icon: BookOpen,
    path: '/mcq-practice'
  },
  {
    id: 'company',
    name: 'Company-wise Prep',
    icon: Building,
    path: '/company-prep'
  },
  {
    id: 'analytics',
    name: 'System Analytics',
    icon: TrendingUp,
    path: '/analytics'
  }
];

export default function ProtectedLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = MODULES.find(t => 
    location.pathname === t.path || 
    (t.path !== '/' && location.pathname.startsWith(t.path))
  ) || MODULES[0];

  return (
    <div className="min-h-screen flex bg-brand-dark font-sans text-slate-100 overflow-x-hidden w-full">

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-68 border-r border-brand-border/60 bg-brand-card/30 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3.5 px-6 h-22 border-b border-brand-border/50">
          <div className="p-2.5 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
            <GraduationCap className="w-6.5 h-6.5 text-brand-primary" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white">Prep<span className="text-gradient-animate font-black">AI</span></span>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Portal Console</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {MODULES.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative border cursor-pointer ${isActive
                    ? 'bg-brand-primary/10 text-white border-brand-primary/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-brand-primary' : 'text-slate-400'}`} />
                  <span className="font-semibold text-sm">{item.name}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-1.5 h-1.5 rounded-full bg-brand-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Info Footing */}
        <div className="p-4 border-t border-brand-border/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-brand-border/40 justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.fullName || 'Active User'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email || 'student@prepai.com'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-brand-error hover:bg-brand-error/10 rounded-lg transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-68 bg-brand-card border-r border-brand-border z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-6 h-22 border-b border-brand-border">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-primary/10 rounded-xl border border-brand-primary/20 text-brand-primary">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="font-extrabold text-xl tracking-tight text-white">Prep<span className="text-gradient-animate font-black">AI</span></span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              <nav className="px-4 py-6 space-y-1.5 overflow-y-auto flex-1">
                {MODULES.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all border cursor-pointer ${isActive
                          ? 'bg-brand-primary/15 text-white border-brand-primary/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-brand-primary' : 'text-slate-400'}`} />
                        <span className="font-semibold text-sm">{item.name}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-brand-border">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-brand-error/10 hover:bg-brand-error/20 border border-brand-error/20 text-brand-error text-xs font-bold transition-all cursor-pointer"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">

        {/* Navigation Bar */}
        <header className="h-22 border-b border-brand-border/60 px-6 flex items-center justify-between bg-brand-card/10 backdrop-blur-md sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 lg:hidden text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>PrepAI Portal</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-200 font-semibold">{currentTab.name}</span>
          </div>

          <div className="flex items-center gap-4 ml-auto sm:ml-0">
            <button className="p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full" />
            </button>
            <div className="h-7 w-[1px] bg-brand-border/80" />
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-white">{user?.fullName}</p>
                <span className="inline-flex items-center gap-1.5 text-[10px] text-brand-secondary font-medium tracking-wide uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse" />
                  Authenticated
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Route Ingestion */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Footer */}
        <footer className="h-16 border-t border-brand-border/60 px-6 flex items-center justify-between text-[11px] text-slate-500 bg-brand-card/5 mt-auto shrink-0">
          <span>&copy; 2026 PrepAI Platform. Session User: {user?.fullName}</span>
          <span className="hidden sm:inline">Path: <code>C:\Users\abilash\.gemini\antigravity-ide\scratch\prepai</code></span>
        </footer>
      </div>

    </div>
  );
}
