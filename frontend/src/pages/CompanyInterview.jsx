import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import {
  Building2,
  Sliders,
  Award,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

const COMPANIES = [
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Adobe', 'Oracle', 'Salesforce',
  'Netflix', 'Uber', 'Apple', 'TCS', 'Infosys', 'Accenture', 'Capgemini',
  'Cognizant', 'Wipro', 'Tech Mahindra', 'Deloitte', 'EY', 'KPMG', 'PwC'
];

export default function CompanyInterview() {
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState('');
  const [pattern, setPattern] = useState(null);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);

  const fetchPattern = async (companyName) => {
    setSelectedCompany(companyName);
    setLoading(true);
    setPattern(null);
    try {
      const res = await api.post('/interview/generate', { company: companyName });
      if (res.data?.success) {
        setPattern(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCompanyInterview = async () => {
    if (!selectedCompany) return;
    setStarting(true);
    try {
      const res = await api.post('/interview/start', {
        interviewType: 'Technical Interview',
        company: selectedCompany,
        difficulty: pattern?.difficulty || 'Medium'
      });

      if (res.data?.success) {
        const session = res.data.data;
        navigate(`/mock-interviews/session/${session._id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
          <Building2 className="w-3.5 h-3.5" />
          Company tracks
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Targeted <span className="text-gradient">Company Preparation</span>
        </h1>
        <p className="text-xs text-slate-400">Review recruitment pipelines and launch customized simulation loops.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left list of companies */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 h-fit">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
            Select Company
          </h3>
          <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-96 pr-2">
            {COMPANIES.map(comp => {
              const isSelected = selectedCompany === comp;
              return (
                <button
                  key={comp}
                  onClick={() => fetchPattern(comp)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all truncate cursor-pointer ${
                    isSelected
                      ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                      : 'bg-white/2 border-brand-border/50 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  {comp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Info Details panel */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="glass-panel p-12 rounded-2xl text-center text-xs text-slate-500 animate-pulse">
              Retrieving recruitment patterns...
            </div>
          ) : pattern ? (
            <div className="glass-panel p-6 rounded-2xl space-y-6 border-brand-border/40 bg-gradient-to-tr from-brand-primary/5 via-brand-secondary/5 to-transparent">
              <div className="flex justify-between items-center border-b border-brand-border/40 pb-3">
                <h3 className="text-sm font-black text-white">{pattern.company} Hiring Pipeline</h3>
                <span className="text-[10px] text-brand-secondary font-black uppercase tracking-wider">
                  Difficulty: {pattern.difficulty}
                </span>
              </div>

              {/* Rounds */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-300">Expected Recruitment Rounds</h4>
                <div className="flex flex-wrap gap-2">
                  {pattern.expectedRounds.map((round, i) => (
                    <span key={i} className="text-[10px] bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-3 py-1 rounded-full font-bold">
                      {round}
                    </span>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-300">Frequently Asked Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {pattern.frequentlyAskedTopics.map((topic, i) => (
                    <span key={i} className="text-[10px] bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary px-3 py-1 rounded-full font-bold">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Prep */}
              <div className="p-4 bg-brand-dark/80 border border-brand-border/60 rounded-xl space-y-1.5 text-xs text-slate-400">
                <span className="font-extrabold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                  Recommended Preparation:
                </span>
                <p className="leading-relaxed">{pattern.recommendedPreparation}</p>
              </div>

              {/* Start button */}
              <button
                onClick={handleStartCompanyInterview}
                disabled={starting}
                className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-lg hover:shadow-brand-primary/20 disabled:opacity-50"
              >
                {starting ? 'Starting Session...' : `Launch Mock Placements for ${pattern.company}`}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2 border-brand-border/40">
              <Building2 className="w-10 h-10 text-slate-600 animate-pulse" />
              <span>Select a company from the left panel to review hiring pipelines.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
