import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import {
  Sparkles,
  Cpu,
  Code,
  ArrowRight,
  TrendingUp,
  Building,
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Layers,
  FileText,
  Activity,
  Award,
  BookOpen,
  Calendar,
  DollarSign,
  Compass,
  ArrowUpRight,
  Plus
} from 'lucide-react';

function ProgressRing({ radius, stroke, progress, colorClass = "text-brand-primary", sizeText = "text-sm" }) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="rgba(30, 41, 75, 0.2)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={`${colorClass} transition-all duration-300`}
        />
      </svg>
      <div className={`absolute font-black text-white ${sizeText}`}>
        {progress}%
      </div>
    </div>
  );
}

export default function CareerPage() {
  const [careerData, setCareerData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [selectedJdId, setSelectedJdId] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState('readiness'); // 'readiness' | 'skillgap' | 'roadmap' | 'recommendations'
  const [activeCompanyFilter, setActiveCompanyFilter] = useState('all'); // 'all' | 'ready' | 'almost' | 'improve'
  const [expandedCompany, setExpandedCompany] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [careerRes, jdRes, historyRes, profileRes] = await Promise.all([
        api.get('/career'),
        api.get('/job-descriptions'),
        api.get('/career/history'),
        api.get('/profile')
      ]);

      if (careerRes.data?.success) {
        setCareerData(careerRes.data.data.career);
      }
      if (jdRes.data?.success) {
        setJobDescriptions(jdRes.data.data.jobDescriptions || []);
        if (jdRes.data.data.jobDescriptions?.length > 0) {
          setSelectedJdId(jdRes.data.data.jobDescriptions[0]._id);
        }
      }
      if (historyRes.data?.success) {
        setHistoryData(historyRes.data.data);
      }
      if (profileRes.data?.success) {
        setUser(profileRes.data.data.user);
      }
    } catch (err) {
      console.error('Failed to load career intelligence data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    try {
      setAnalyzing(true);
      const payload = {};
      if (selectedJdId) {
        payload.jobDescriptionId = selectedJdId;
      }

      const res = await api.post('/career/analyze', payload);
      if (res.data?.success) {
        setCareerData(res.data.data.career);
        // Refresh history snapshots
        const histRes = await api.get('/career/history');
        if (histRes.data?.success) {
          setHistoryData(histRes.data.data);
        }
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse w-full">
        <div className="h-44 bg-white/5 border border-brand-border/60 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-white/5 border border-brand-border/60 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <div className="h-96 bg-white/5 border border-brand-border/60 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const {
    careerScore = 0,
    overallCareerScore = 0,
    targetCompanyReadiness = 0,
    companyRank = 0,
    careerScoreFactors = {},
    companyReadiness = [],
    companyRecommendations = { ready: [], almostReady: [], needImprovement: [], explanation: '' },
    recommendedRoles = [],
    skillGaps = [],
    roadmap = { weeklyGoals: [], monthlyGoals: [], estimatedCompletionTime: '' },
    resources = [],
    richResources = [],
    projects = [],
    certifications = [],
    salaryPrediction = { currentSalaryMin: 0, currentSalaryMax: 0, expectedSalaryMin: 0, expectedSalaryMax: 0, currency: 'LPA (INR)', explanation: '' },
    timeline = { threeMonths: '', sixMonths: '', nineMonths: '', twelveMonths: '', studyHoursPerWeek: 15 },
    motivationalSummary = ''
  } = careerData || {};

  const currentSkillGap = skillGaps.find(gap => gap.jobDescriptionId.toString() === selectedJdId);

  // Group company cards by active filter
  const filteredCompanies = companyReadiness.filter(c => {
    if (activeCompanyFilter === 'ready') return c.readinessPercent >= 75;
    if (activeCompanyFilter === 'almost') return c.readinessPercent >= 50 && c.readinessPercent < 75;
    if (activeCompanyFilter === 'improve') return c.readinessPercent < 50;
    return true;
  });

  const getReadinessLevelBadge = (level) => {
    switch (level) {
      case 'Ready': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'High': return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
      case 'Medium': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      default: return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
    }
  };

  const getProgressColor = (percent) => {
    if (percent >= 90) return 'text-emerald-400';
    if (percent >= 75) return 'text-indigo-400';
    if (percent >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  // Salary Prediction Chart Data
  const salaryChartData = [
    {
      name: 'Current Profile',
      Min: salaryPrediction.currentSalaryMin,
      Max: salaryPrediction.currentSalaryMax
    },
    {
      name: 'Post-Roadmap',
      Min: salaryPrediction.expectedSalaryMin,
      Max: salaryPrediction.expectedSalaryMax
    }
  ];

  return (
    <div className="space-y-8 w-full pb-16">
      
      {/* 1. Header Banner & Mentor Intro */}
      <div className="relative rounded-2xl overflow-hidden glass-panel p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent pointer-events-none" />
        <div className="space-y-3 relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Phase 8: Hybrid AI Career Mentor
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            AI Career <span className="text-gradient">Intelligence</span> Dashboard
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            "{motivationalSummary}"
          </p>
        </div>
        <div className="flex flex-wrap gap-3.5 shrink-0 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-xs text-slate-200 font-semibold shadow-inner">
            <Cpu className="w-4 h-4 text-brand-secondary animate-pulse" />
            Hybrid Engine Active
          </span>
        </div>
      </div>

      {/* Career Goal Planner Card */}
      {user && user.targetCompany && user.targetRole && (
        <div className="glass-panel p-6 rounded-2xl border-brand-border/40 relative overflow-hidden bg-gradient-to-r from-brand-primary/5 via-brand-secondary/5 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-brand-accent/5 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-brand-primary font-bold uppercase tracking-wider">
                <Target className="w-3.5 h-3.5 animate-pulse" /> Active Career Target
              </div>
              <h3 className="text-sm font-black text-white">
                Preparing for <span className="text-brand-secondary">{user.targetCompany}</span> as a <span className="text-brand-secondary">{user.targetRole}</span>
              </h3>
              <p className="text-[10px] text-slate-400 font-bold">Target Timeline: {user.targetTimeline || '2028'}</p>
            </div>
            
            <div className="flex items-center gap-4 flex-1 max-w-sm w-full">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                  <span>Current: {careerScore}%</span>
                  <span>Goal: 100%</span>
                </div>
                <div className="w-full bg-[#030712]/80 h-2 rounded-full overflow-hidden p-[1px] border border-brand-border/40">
                  <div className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full rounded-full" style={{ width: `${careerScore}%` }} />
                </div>
              </div>
              <div className="text-center font-black text-white bg-white/5 border border-brand-border px-3 py-1.5 rounded-xl text-xs whitespace-nowrap">
                {100 - careerScore}% Left
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Target Job Selector & Global Sync Controls */}
      <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-primary" />
              Target Job & Placement Alignment
            </h3>
            <p className="text-[11px] text-slate-400">Choose a saved job description to sync your detailed skill gaps and study roadmaps.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {jobDescriptions.length > 0 ? (
              <select
                value={selectedJdId}
                onChange={(e) => setSelectedJdId(e.target.value)}
                className="bg-brand-dark/80 border border-brand-border/80 text-xs text-slate-200 px-3 py-2 rounded-xl focus-ring min-w-[200px] h-10 shadow-inner"
              >
                {jobDescriptions.map(jd => (
                  <option key={jd._id} value={jd._id}>
                    {jd.company} - {jd.title}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-[11px] text-brand-warning bg-brand-warning/10 border border-brand-warning/20 px-3 py-2 rounded-xl font-bold uppercase">
                No Job Descriptions Found
              </span>
            )}
            <button
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                analyzing 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-brand-primary hover:bg-brand-primary/95 text-white active:scale-95'
              }`}
            >
              <Activity className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
              {analyzing ? 'Analyzing Profile...' : 'Sync Career Guidance'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Navigation Tabs */}
      <div className="flex border-b border-brand-border/60 pb-px gap-1 overflow-x-auto">
        {[
          { id: 'readiness', name: 'Placement Readiness', icon: Building },
          { id: 'skillgap', name: 'Skill Gap Analysis', icon: Layers },
          { id: 'roadmap', name: 'Learning Roadmap', icon: Calendar },
          { id: 'recommendations', name: 'Mentorship recommendations', icon: Compass }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMainTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-brand-primary text-white bg-brand-primary/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* 4. Active Tab Content Panels */}
      <div className="space-y-8">
        
        {/* TAB 1: PLACEMENT READINESS */}
        {activeMainTab === 'readiness' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Career Score & Company Readiness Cards */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Overall Career Score Card */}
              <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-6 relative overflow-hidden">
                <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-brand-primary/5 blur-2xl pointer-events-none" />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-3 max-w-md text-center sm:text-left">
                    <span className="text-[10px] font-extrabold uppercase bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-3 py-1 rounded-full">
                      Overall Evaluation
                    </span>
                    <h3 className="text-lg font-extrabold text-white">Your Overall Employability Score</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This score represents your overall employability, technical skills breadth, resume quality, and project strength independent of specific company criteria.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-col sm:flex-row shrink-0">
                    <ProgressRing radius={52} stroke={6} progress={overallCareerScore} colorClass={getProgressColor(overallCareerScore)} sizeText="text-lg" />
                    <div className="text-center sm:text-left">
                      <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Employability Rank</span>
                      <span className="text-xs font-black text-white bg-white/5 border border-brand-border px-3 py-1 rounded-lg block mt-1">
                        {overallCareerScore >= 75 ? 'Tier-1 Candidate' : overallCareerScore >= 50 ? 'Intermediate Candidate' : 'Emerging Candidate'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Why This Score? Breakdown Section */}
                {careerScoreFactors && Object.keys(careerScoreFactors).length > 0 && (
                  <div className="border-t border-brand-border/40 pt-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">"Why This Score?" Score Breakdown</h4>
                      <span className="text-[9px] text-slate-400 font-bold">Sum of category points</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(careerScoreFactors).filter(([key]) => key !== 'resumeQuality').map(([key, val]) => {
                        const displayName = key === 'resume' ? 'Resume' : key.charAt(0).toUpperCase() + key.slice(1);
                        return (
                          <div key={key} className="p-3 rounded-xl bg-white/2 border border-brand-border/40 space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-bold">
                              <span className="text-slate-300">{displayName}</span>
                              <span className="text-white font-extrabold">{val.points || 0} / {val.max || 10}</span>
                            </div>
                            <div className="w-full bg-[#030712]/80 h-1.5 rounded-full overflow-hidden p-[1px] border border-brand-border/40">
                              <div
                                className="bg-brand-primary h-full rounded-full transition-all duration-500"
                                style={{ width: `${((val.points || 0) / (val.max || 10)) * 100}%` }}
                              />
                            </div>
                            {val.reasons && val.reasons.length > 0 && (
                              <p className="text-[8px] text-slate-400 truncate leading-relaxed">
                                {val.reasons[0]}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Target Company Readiness Card */}
              {user && user.targetCompany && (
                <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-4 bg-gradient-to-br from-brand-secondary/5 via-white/0 to-white/0">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-3 max-w-md text-center sm:text-left">
                      <span className="text-[10px] font-extrabold uppercase bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary px-3 py-1 rounded-full">
                        Target Placement Match
                      </span>
                      <h3 className="text-lg font-extrabold text-white">{user.targetCompany} Readiness</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Your technical compatibility score specifically tailored for {user.targetCompany}'s candidate requirements.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 flex-col sm:flex-row shrink-0">
                      <ProgressRing radius={52} stroke={6} progress={targetCompanyReadiness} colorClass={getProgressColor(targetCompanyReadiness)} sizeText="text-lg" />
                      <div className="text-center sm:text-left">
                        <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Placement Rank</span>
                        <span className="text-xs font-black text-white bg-white/5 border border-brand-border px-3 py-1 rounded-lg block mt-1">
                          Rank {companyRank || 15} / 15
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Resume Evolution & Progress Summary */}
              {historyData && historyData.previousCareerScore > 0 && (
                <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-5 bg-gradient-to-br from-brand-primary/5 via-white/0 to-white/0">
                  <div>
                    <h3 className="text-xs font-extrabold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-brand-primary animate-pulse" />
                      Resume Evolution Tracker
                    </h3>
                    <p className="text-[10px] text-slate-400">Compare your progress across uploaded resume iterations.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {/* Added Skills */}
                    <div className="space-y-2 bg-[#030712]/50 p-3.5 rounded-xl border border-brand-border/40">
                      <span className="font-black uppercase text-[10px] tracking-wider text-brand-primary block">Added Skills</span>
                      {historyData.newSkills && historyData.newSkills.length > 0 ? (
                        <ul className="space-y-1.5 pt-1">
                          {historyData.newSkills.map(s => (
                            <li key={s} className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                              <span className="text-[10px] text-emerald-400 font-extrabold">+</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-500 italic text-[10px] block pt-1">No new skills detected</span>
                      )}
                    </div>

                    {/* Projects Added */}
                    <div className="space-y-2 bg-[#030712]/50 p-3.5 rounded-xl border border-brand-border/40">
                      <span className="font-black uppercase text-[10px] tracking-wider text-brand-secondary block">Projects Added</span>
                      {historyData.projectsAdded && historyData.projectsAdded.length > 0 ? (
                        <ul className="space-y-1.5 pt-1">
                          {historyData.projectsAdded.map(p => (
                            <li key={p} className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                              <span className="text-[10px] text-brand-secondary font-extrabold">+</span>
                              <span className="truncate max-w-[110px]">{p}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-500 italic text-[10px] block pt-1">No new projects listed</span>
                      )}
                    </div>

                    {/* Unlocked Companies */}
                    <div className="space-y-2 bg-[#030712]/50 p-3.5 rounded-xl border border-brand-border/40">
                      <span className="font-black uppercase text-[10px] tracking-wider text-brand-accent block">Unlocked Companies</span>
                      {historyData.companiesUnlocked && historyData.companiesUnlocked.length > 0 ? (
                        <ul className="space-y-1.5 pt-1">
                          {historyData.companiesUnlocked.map(c => (
                            <li key={c} className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                              <span className="text-[10px] text-brand-accent font-extrabold">+</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-500 italic text-[10px] block pt-1">Target matches unchanged</span>
                      )}
                    </div>

                    {/* Career Score Trend */}
                    <div className="space-y-2 bg-[#030712]/50 p-3.5 rounded-xl border border-brand-border/40 flex flex-col justify-between items-center text-center">
                      <span className="font-black uppercase text-[10px] tracking-wider text-white block w-full">Career Score</span>
                      <div className="flex flex-col items-center justify-center py-2">
                        <span className="text-slate-400 font-extrabold text-sm">{historyData.previousCareerScore}%</span>
                        <div className="text-brand-primary font-black text-xs my-0.5">↓</div>
                        <span className="text-white font-black text-lg">{historyData.currentCareerScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Readiness Filtered list */}
              <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-brand-border/40 pb-4 gap-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Building className="w-4.5 h-4.5 text-brand-secondary" />
                      Company Eligibility & Rationale
                    </h3>
                    <p className="text-xs text-slate-400">Placement eligibility evaluation for 15 target tech firms.</p>
                  </div>

                  {/* Filter switches */}
                  <div className="flex flex-wrap gap-1 bg-brand-dark p-1 border border-brand-border rounded-xl">
                    {['all', 'ready', 'almost', 'improve'].map((filt) => (
                      <button
                        key={filt}
                        onClick={() => setActiveCompanyFilter(filt)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          activeCompanyFilter === filt
                            ? 'bg-brand-primary text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {filt}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-brand-secondary/40 pl-3">
                  "{companyRecommendations.explanation}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCompanies.map((c, index) => {
                    const isExpanded = expandedCompany === c.companyName;
                    return (
                      <div
                        key={c.companyName}
                        className="p-4 rounded-xl bg-brand-card/45 border border-brand-border hover:border-brand-primary/45 transition-all group flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <ProgressRing radius={28} stroke={4} progress={c.readinessPercent} colorClass={getProgressColor(c.readinessPercent)} sizeText="text-xs" />
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-xs font-bold text-white group-hover:text-brand-primary transition-colors">{c.companyName}</h4>
                                <span className="text-[8px] bg-white/5 text-slate-400 px-1.5 py-0.5 rounded font-black border border-brand-border/40">
                                  Rank {c.rank || 15} / 15
                                </span>
                              </div>
                              <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded text-[8px] font-extrabold uppercase border ${getReadinessLevelBadge(c.readinessLevel)}`}>
                                {c.readinessLevel}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-brand-border/40">
                          <button
                            onClick={() => setExpandedCompany(isExpanded ? null : c.companyName)}
                            className="w-full flex items-center justify-between text-[10px] text-slate-400 hover:text-white font-bold cursor-pointer"
                          >
                            <span>{isExpanded ? 'Hide Rationale' : 'View AI Rationale'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mt-3 space-y-4 pt-2 border-t border-brand-border/20"
                              >
                                <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">{c.explanation}</p>
                                
                                <div className="grid grid-cols-2 gap-3 pt-1">
                                  {/* Strengths */}
                                  <div className="space-y-1.5 p-2 rounded bg-white/2 border border-brand-border/30">
                                    <span className="text-[8px] font-extrabold uppercase tracking-wide text-brand-primary block">✓ Strengths</span>
                                    {c.strengths && c.strengths.length > 0 ? (
                                      <div className="flex flex-wrap gap-1">
                                        {c.strengths.map(s => (
                                          <span key={s} className="px-1.5 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20 text-[8px] text-brand-primary font-semibold">{s}</span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-[9px] text-slate-500 block italic">None identified</span>
                                    )}
                                  </div>

                                  {/* Gaps / Missing */}
                                  <div className="space-y-1.5 p-2 rounded bg-white/2 border border-brand-border/30">
                                    <span className="text-[8px] font-extrabold uppercase tracking-wide text-rose-400 block">✗ Gaps</span>
                                    {c.missing && c.missing.length > 0 ? (
                                      <div className="flex flex-wrap gap-1">
                                        {c.missing.map(m => (
                                          <span key={m} className="px-1.5 py-0.5 rounded bg-rose-400/10 border border-rose-400/20 text-[8px] text-rose-400 font-semibold">{m}</span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-[9px] text-brand-primary block italic">No gaps!</span>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  {/* Projects Required */}
                                  <div className="p-2.5 rounded bg-white/2 border border-brand-border/30 text-[9px]">
                                    <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-wider">Projects Check</span>
                                    <span className="text-white font-extrabold block mt-0.5">{c.projectsRequired || 'None'}</span>
                                  </div>

                                  {/* Prep Time */}
                                  <div className="p-2.5 rounded bg-white/2 border border-brand-border/30 text-[9px]">
                                    <span className="text-[8px] text-slate-500 block uppercase font-bold tracking-wider">Prep Time</span>
                                    <span className="text-brand-secondary font-extrabold block mt-0.5">{c.estimatedPrepTime || 'Ready'}</span>
                                  </div>
                                </div>

                                <div className="space-y-1.5 pt-1">
                                  <span className="text-[8px] text-brand-secondary font-bold uppercase tracking-wider block">Recommended Improvements:</span>
                                  <ul className="space-y-1">
                                    {c.improvementSuggestions.map((suggestion, sIdx) => (
                                      <li key={sIdx} className="text-[9px] text-slate-400 flex items-start gap-1">
                                        <span className="text-brand-secondary font-bold">•</span>
                                        <span>{suggestion}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Col: Progression Graph, Recommended Roles, Salary prediction */}
            <div className="space-y-6">
              
              {/* Salary Prediction card */}
              <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">Estimated Package Predictor</h4>
                    <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-wider">Salary Range Growth</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {salaryPrediction.explanation}
                </p>

                {/* Predictor Transparency Factors */}
                <div className="grid grid-cols-2 gap-2 bg-brand-dark/50 p-3 rounded-xl border border-brand-border/60 text-[9px] relative overflow-hidden">
                  <div className="flex justify-between items-center pr-2 border-r border-brand-border/30 font-medium">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">Experience</span>
                    <span className="text-slate-200 font-semibold">{salaryPrediction.factors?.experience || 'Fresher'}</span>
                  </div>
                  <div className="flex justify-between items-center pl-2 font-medium">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">Projects</span>
                    <span className="text-slate-200 font-semibold">{salaryPrediction.factors?.projects || 0}</span>
                  </div>
                  <div className="flex justify-between items-center pr-2 border-r border-brand-border/30 pt-1 font-medium">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">Career Score</span>
                    <span className="text-slate-200 font-semibold">{salaryPrediction.factors?.careerScore || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center pl-2 pt-1 font-medium">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">Confidence</span>
                    <span className={`font-semibold ${salaryPrediction.factors?.confidence === 'High' ? 'text-emerald-400' : salaryPrediction.factors?.confidence === 'Medium' ? 'text-brand-secondary' : 'text-slate-400'}`}>
                      {salaryPrediction.factors?.confidence || 'Medium'}
                    </span>
                  </div>
                  {salaryPrediction.factors?.confidenceReasons && salaryPrediction.factors.confidenceReasons.length > 0 && (
                    <div className="col-span-2 border-t border-brand-border/30 mt-1.5 pt-1.5 space-y-1">
                      <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px] block">Confidence Rationale</span>
                      <div className="flex flex-wrap gap-1">
                        {salaryPrediction.factors.confidenceReasons.map((r, rIdx) => (
                          <span key={rIdx} className="px-1.5 py-0.5 rounded bg-white/5 border border-brand-border/30 text-[8px] text-slate-300 font-semibold block">{r}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="col-span-2 border-t border-brand-border/30 mt-1.5 pt-1.5 flex justify-between items-center text-[8px] font-medium">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">Parameters</span>
                    <span className="text-slate-400">Location: {salaryPrediction.factors?.location || 'India'} | Role: {salaryPrediction.factors?.targetCompany || 'Software Engineer'}</span>
                  </div>
                </div>

                <div className="h-44 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salaryChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,75,0.3)" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                      <YAxis stroke="#94a3b8" fontSize={9} label={{ value: 'LPA (INR)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 9 }} />
                      <Tooltip contentStyle={{ backgroundColor: '#0e1326', borderColor: '#1e294b', fontSize: 10 }} />
                      <Bar dataKey="Min" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Max" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Roles fits */}
              <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-4">
                <div>
                  <h4 className="text-xs font-black text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-brand-secondary" />
                    Top Job Recommendations
                  </h4>
                  <p className="text-[10px] text-slate-400">Match score based on skills, education & experience.</p>
                </div>

                <div className="space-y-4">
                  {recommendedRoles.map((rec, index) => (
                    <div key={rec.role} className="p-3 bg-white/2 border border-brand-border/50 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-black text-white">
                        <span>{index + 1}. {rec.role}</span>
                        <span className="text-brand-secondary">{rec.matchPercentage}% fit</span>
                      </div>
                      <div className="w-full bg-brand-dark/80 h-2 rounded-full overflow-hidden p-[1px] border border-brand-border/60">
                        <div
                          className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full rounded-full transition-all duration-500"
                          style={{ width: `${rec.matchPercentage}%` }}
                        />
                      </div>
                      <ul className="text-[9px] text-slate-400 space-y-1 pl-1.5">
                        {rec.reasons.map((r, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1">
                            <span className="text-brand-secondary font-bold">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* History progression chart */}
              {historyData && historyData.historyList?.length > 1 && (
                <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-brand-primary" />
                      Resume Progress Tracker
                    </h4>
                    <p className="text-[10px] text-slate-400">Career score progression chart across uploads.</p>
                  </div>
                  <div className="h-36 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historyData.historyList}>
                        <defs>
                          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,75,0.2)" />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} />
                        <YAxis stroke="#94a3b8" fontSize={9} domain={[0, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: '#0e1326', borderColor: '#1e294b', fontSize: 10 }} />
                        <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#scoreGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] pt-1">
                    <div className="bg-white/2 border border-brand-border/50 p-2 rounded-xl">
                      <span className="text-slate-500 uppercase tracking-wider block font-bold">Growth</span>
                      <span className={`text-xs font-black ${historyData.improvementPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {historyData.improvementPercent >= 0 ? '+' : ''}{historyData.improvementPercent}%
                      </span>
                    </div>
                    <div className="bg-white/2 border border-brand-border/50 p-2 rounded-xl">
                      <span className="text-slate-500 uppercase tracking-wider block font-bold">Skills Gained</span>
                      <span className="text-xs font-black text-brand-secondary">
                        +{historyData.skillGrowth} Skills
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: SKILL GAP ANALYSIS */}
        {activeMainTab === 'skillgap' && (
          <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Layers className="w-4.5 h-4.5 text-brand-accent" />
                Granular Skill Gap Analysis
              </h3>
              <p className="text-xs text-slate-400">Comparison of your parsed resume against targeted job qualifications.</p>
            </div>

            {currentSkillGap ? (
              <div className="space-y-6">
                <div className="p-3.5 rounded-xl bg-brand-primary/5 border border-brand-primary/10 flex justify-between items-center gap-4 flex-wrap">
                  <div className="text-xs text-slate-200">
                    Aligned with job description: <span className="text-white font-bold">{currentSkillGap.jobTitle}</span> at <span className="text-brand-secondary font-bold">{currentSkillGap.company}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">Analyzed: {new Date(currentSkillGap.analyzedAt).toLocaleDateString()}</span>
                </div>

                <div className="space-y-6">
                  {Object.keys(currentSkillGap.existingSkills).map(category => {
                    const existing = currentSkillGap.existingSkills[category] || [];
                    const missing = currentSkillGap.missingSkills[category] || [];
                    const isCritical = ['Programming', 'Frameworks', 'Databases', 'Cloud'].includes(category);

                    if (existing.length === 0 && missing.length === 0) return null;

                    return (
                      <div key={category} className="space-y-3 p-4 rounded-xl bg-white/2 border border-brand-border/50">
                        <div className="flex items-center justify-between border-b border-brand-border/40 pb-2">
                          <h4 className="text-xs font-bold text-white">{category}</h4>
                          <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isCritical 
                              ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400' 
                              : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400'
                          }`}>
                            {isCritical ? 'Critical Category' : 'Optional Category'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          <div className="space-y-2">
                            <span className="text-[10px] text-emerald-400 font-bold block">Matched ({existing.length})</span>
                            <div className="flex flex-wrap gap-1.5">
                              {existing.length > 0 ? (
                                existing.map(skill => (
                                  <span key={skill} className="px-2.5 py-1 rounded bg-emerald-500/5 border border-emerald-500/25 text-[10px] text-emerald-300 font-semibold shadow-inner">
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-slate-500 italic">No skills matched in this category.</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] text-rose-400 font-bold block">Missing ({missing.length})</span>
                            <div className="flex flex-wrap gap-1.5">
                              {missing.length > 0 ? (
                                missing.map(skill => (
                                  <span key={skill} className="px-2.5 py-1 rounded bg-rose-500/5 border border-rose-500/25 text-[10px] text-rose-300 font-semibold shadow-inner">
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[10px] text-emerald-400 italic">Fully covered! No gaps here.</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white/2 border border-brand-border/40 rounded-xl space-y-3">
                <AlertCircle className="w-10 h-10 text-brand-warning mx-auto animate-bounce" />
                <p className="text-xs text-slate-300 font-semibold">Select a Job Description above and click "Sync Career Guidance" to view your skill gap report.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LEARNING ROADMAP */}
        {activeMainTab === 'roadmap' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Weekly/Monthly Timelines */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-brand-primary" />
                    Customized Learning Roadmap
                  </h3>
                  <p className="text-xs text-slate-400">Weekly goals and study checklist recommended by AI mentor.</p>
                </div>

                <div className="p-3 bg-brand-secondary/5 border border-brand-secondary/15 rounded-xl text-xs text-slate-200">
                  Estimated Completion Duration: <span className="text-white font-bold">{roadmap.estimatedCompletionTime || '6 Months'}</span>
                </div>

                {/* Vertical Timeline */}
                <div className="space-y-6 pt-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-brand-border/60">
                  {roadmap.weeklyGoals.map((wk, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="relative pl-8 space-y-2"
                    >
                      <div className="absolute left-[7px] top-[4px] w-2.5 h-2.5 rounded-full bg-brand-primary border-2 border-brand-dark shadow" />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase text-brand-primary">Week {wk.week}</span>
                        {wk.milestone && (
                          <span className="text-[9px] font-extrabold bg-brand-success/15 border border-brand-success/20 text-brand-success px-2 py-0.5 rounded-full">
                            Milestone: {wk.milestone}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-black text-white">{wk.goal}</h4>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {wk.topics.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded bg-white/2 border border-brand-border/60 text-[9px] text-slate-400">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Practice checklist & progress bar */}
                      <div className="pt-2.5 pl-3.5 border-l border-brand-border/40 space-y-2 max-w-lg">
                        {wk.practiceTasks && wk.practiceTasks.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Weekly Worksheet & Practice</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {wk.practiceTasks.map((task, tIdx) => (
                                <div key={tIdx} className="flex items-center gap-2 text-[9px] text-slate-300 font-medium">
                                  <input type="checkbox" readOnly checked className="accent-brand-primary w-3.5 h-3.5 rounded border-brand-border" />
                                  <span className="truncate">{task}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3">
                          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Expected Progress:</span>
                          <div className="flex-1 bg-brand-dark/85 h-2 rounded-full overflow-hidden p-[1px] border border-brand-border/60 max-w-[120px]">
                            <div className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full rounded-full" style={{ width: `${wk.expectedProgress || 0}%` }} />
                          </div>
                          <span className="text-[9px] font-extrabold text-brand-primary">{wk.expectedProgress || 0}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Monthly Goals */}
              <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-4">
                <h3 className="text-sm font-extrabold text-white">Monthly Milestones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roadmap.monthlyGoals.map((mn, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/2 border border-brand-border/50 space-y-2">
                      <span className="text-[10px] font-black text-brand-secondary uppercase block">Month {mn.month}</span>
                      <h4 className="text-xs font-bold text-white leading-relaxed">{mn.goal}</h4>
                      <ul className="text-[10px] text-slate-400 space-y-1 pt-1.5">
                        {mn.milestones.map((m, mIdx) => (
                          <li key={mIdx} className="flex items-start gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col: Timeline selector targets */}
            <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Activity className="w-4.5 h-4.5 text-brand-accent" />
                  Roadmap Milestone Focus
                </h3>
                <p className="text-xs text-slate-400">Target expectations over major checkpoint intervals.</p>
              </div>

              <div className="space-y-4 pt-2">
                {[
                  { title: '3 Months Target', text: timeline.threeMonths },
                  { title: '6 Months Target', text: timeline.sixMonths },
                  { title: '9 Months Target', text: timeline.nineMonths },
                  { title: '12 Months Target', text: timeline.twelveMonths }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white/2 border border-brand-border/50 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-black text-brand-accent uppercase block">{item.title}</span>
                    <p className="text-[10px] text-slate-300 leading-relaxed">{item.text || 'Prepare foundational placements checkmarks.'}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-brand-border/40 flex justify-between items-center text-[10px] text-slate-400">
                <span>Study intensity:</span>
                <span className="text-white font-bold">{timeline.studyHoursPerWeek} Hours / Week</span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: RECOMMENDATIONS */}
        {activeMainTab === 'recommendations' && (
          <div className="space-y-8">
            
            {/* Recommended Projects */}
            <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Code className="w-4.5 h-4.5 text-brand-primary" />
                  Target Project Recommendations
                </h3>
                <p className="text-xs text-slate-400">Build these projects to showcase capabilities for your target role and organizations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-brand-card/45 border border-brand-border hover:border-brand-primary/40 transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-xs font-black text-white">{proj.title}</h4>
                        <span className="text-[9px] font-extrabold bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-2.5 py-0.5 rounded">
                          {proj.difficulty}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed">{proj.learningOutcome}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.techStack.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded bg-white/2 border border-brand-border/50 text-[9px] text-slate-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-brand-border/40 flex justify-between items-center text-[9px] text-slate-500 font-semibold">
                      <span>Duration: {proj.duration}</span>
                      <span className="text-brand-secondary flex items-center gap-0.5 cursor-pointer hover:underline">
                        Build Guide <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rich Learning Tracks */}
            {richResources && richResources.length > 0 && (
              <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-brand-primary" />
                    Structured Learning Tracks
                  </h3>
                  <p className="text-xs text-slate-400">Curated, structured curricula to systematically target your remaining technical gaps.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {richResources.map((track, idx) => (
                    <div key={idx} className="p-5 rounded-xl bg-brand-card/45 border border-brand-border hover:border-brand-primary/40 transition-colors flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <h4 className="text-xs font-black text-white">{track.subject}</h4>
                          <span className="text-[9px] font-extrabold bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-2.5 py-0.5 rounded">
                            {track.estimatedTime}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2 pt-2 border-t border-brand-border/30">
                          <div className="text-[10px] flex justify-between gap-4 font-medium">
                            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Primary Course</span>
                            <span className="text-slate-200 text-right">{track.primary || 'N/A'}</span>
                          </div>
                          <div className="text-[10px] flex justify-between gap-4 font-medium">
                            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Practice</span>
                            <span className="text-slate-200 text-right">{track.practice || 'N/A'}</span>
                          </div>
                          <div className="text-[10px] flex justify-between gap-4 font-medium">
                            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Reference Book</span>
                            <span className="text-slate-200 text-right">{track.reference || 'N/A'}</span>
                          </div>
                          <div className="text-[10px] flex justify-between gap-4 font-medium">
                            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Videos</span>
                            <span className="text-slate-200 text-right">{track.videos || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Certifications & Learning Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Certifications recommendations */}
              <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Award className="w-4.5 h-4.5 text-brand-accent" />
                    Recommended Industry Certifications
                  </h3>
                  <p className="text-xs text-slate-400">Professional credentials to boost resume weight.</p>
                </div>

                <div className="space-y-4">
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/2 border border-brand-border/50 space-y-2">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-xs font-black text-white">{cert.name}</span>
                        <span className="text-[9px] font-extrabold bg-brand-accent/10 border border-brand-accent/20 text-brand-accent px-2 py-0.5 rounded">
                          {cert.provider}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        <span className="text-slate-200 font-bold">Why take it:</span> {cert.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Resource Links */}
              <div className="glass-panel p-6 rounded-2xl border-brand-border/40 space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-brand-secondary" />
                    Curated Learning Resources
                  </h3>
                  <p className="text-xs text-slate-400">Curated online learning links tailored to your skill gaps.</p>
                </div>

                <div className="space-y-3.5">
                  {resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white/2 border border-brand-border/50 flex justify-between items-center hover:border-brand-secondary/40 transition-colors group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-brand-secondary transition-colors">{res.name}</span>
                        <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">{res.category}</span>
                      </div>
                      <span className="text-[9px] font-extrabold bg-white/5 border border-brand-border text-slate-400 px-2.5 py-1 rounded-lg">
                        {res.type}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
