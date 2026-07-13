import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import {
  Sparkles,
  Play,
  Briefcase,
  Building2,
  Sliders,
  HelpCircle,
  Video,
  ChevronRight,
  BookOpen,
  FolderDot
} from 'lucide-react';

const INTERVIEW_TYPES = [
  { id: 'Technical Interview', name: 'Technical Interview', desc: 'Assess coding logic, networks, databases, system design.', icon: Sliders },
  { id: 'HR Interview', name: 'HR Interview', desc: 'Assess behavioral traits, company fit, strengths, goals.', icon: HelpCircle },
  { id: 'Behavioral Interview', name: 'Behavioral Interview', desc: 'Situational prompts checking conflict, leadership under STAR.', icon: Video },
  { id: 'Coding Interview', name: 'Coding Interview', desc: 'Solve algorithmic challenges with test cases and complexity rules.', icon: Play },
  { id: 'Resume Based Interview', name: 'Resume Based Interview', desc: 'Deep dive validation of resume achievements & skills.', icon: BookOpen },
  { id: 'Project Based Interview', name: 'Project Deep Dive', desc: 'In-depth architecture, db, security, and hosting review.', icon: FolderDot }
];

const COMPANIES = [
  'General Tech', 'Google', 'Amazon', 'Microsoft', 'Meta', 'Adobe', 'Oracle',
  'Salesforce', 'Netflix', 'Uber', 'Apple', 'TCS', 'Infosys', 'Accenture',
  'Capgemini', 'Cognizant', 'Wipro', 'Tech Mahindra', 'Deloitte', 'EY', 'KPMG', 'PwC'
];

const ROLES = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Java Developer',
  'MERN Developer', 'Python Developer', 'AI Engineer', 'Machine Learning Engineer',
  'Cloud Engineer', 'DevOps Engineer', 'Cyber Security', 'Data Analyst', 'Data Scientist'
];

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [type, setType] = useState('Technical Interview');
  const [company, setCompany] = useState('General Tech');
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/interview/start', {
        interviewType: type,
        company: company === 'General Tech' ? '' : company,
        role,
        difficulty
      });

      if (response.data?.success) {
        const session = response.data.data;
        navigate(`/mock-interviews/session/${session._id}`);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error?.message || 'Failed to start interview session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Settings Panel
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Configure Your <span className="text-gradient">Mock Simulation</span>
        </h1>
        <p className="text-xs text-slate-400">Select parameters to generate personalized questions.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-brand-error/10 border border-brand-error/25 text-brand-error text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Options Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Interview Type Selection */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
              1. Choose Interview Round Type
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INTERVIEW_TYPES.map(item => {
                const Icon = item.icon;
                const isSelected = type === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setType(item.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-300 relative group cursor-pointer ${
                      isSelected
                        ? 'bg-brand-primary/10 border-brand-primary/50 text-white'
                        : 'bg-white/2 border-brand-border/40 text-slate-400 hover:border-brand-border/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg border transition-colors ${
                        isSelected 
                          ? 'bg-brand-primary/20 border-brand-primary/30 text-brand-primary' 
                          : 'bg-brand-dark border-brand-border text-slate-400 group-hover:text-slate-200'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-xs text-white">{item.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-2.5">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Target Company & Role Selection */}
          <div className="glass-panel p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-brand-secondary" />
                Target Company
              </label>
              <select
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full p-3 bg-brand-dark/80 rounded-xl border border-brand-border/60 text-xs text-white focus-ring transition-all"
              >
                {COMPANIES.map(c => (
                  <option key={c} value={c} className="bg-brand-card">{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 uppercase font-black tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-brand-accent" />
                Target Role
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full p-3 bg-brand-dark/80 rounded-xl border border-brand-border/60 text-xs text-white focus-ring transition-all"
              >
                {ROLES.map(r => (
                  <option key={r} value={r} className="bg-brand-card">{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="space-y-6">
          {/* Difficulty */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
              3. Difficulty Level
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {['Easy', 'Medium', 'Hard'].map(diff => {
                const isSelected = difficulty === diff;
                return (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-2 px-3 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-white/2 border-brand-border/50 text-slate-400 hover:bg-white/5'
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guidelines */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 text-xs text-slate-400">
            <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
              Simulation Rules
            </h4>
            <ul className="space-y-2 list-disc list-inside leading-relaxed">
              <li>Each simulation consists of exactly <strong>5 questions</strong>.</li>
              <li>You can type your answer in the box provided.</li>
              <li>Calculated scores are based on technical accuracy, keywords, completeness, and grammar.</li>
              <li>If you score <strong>&ge; 70%</strong>, you will receive an official completions certificate.</li>
            </ul>
          </div>

          {/* Trigger button */}
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-sm transition-all shadow-lg hover:shadow-brand-primary/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            {loading ? 'Generating Interview...' : 'Initialize Simulation'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
