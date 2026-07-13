import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Sparkles, 
  FolderGit2, 
  X,
  Plus,
  Award,
  Briefcase,
  GraduationCap,
  Link2,
  FileCheck2
} from 'lucide-react';
import api from '../lib/api';

export default function ResumeCompare({ onClose }) {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const response = await api.get('/resume/compare');
        if (response.data?.success) {
          setComparison(response.data.data);
        } else {
          setError('Failed to load version comparison.');
        }
      } catch (err) {
        setError(err.message || 'Error fetching resume comparison data.');
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, []);

  if (loading) {
    return (
      <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center min-h-[300px] text-slate-300">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Calculating delta matrices...</span>
      </div>
    );
  }

  if (error || !comparison || !comparison.hasComparison) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-4 min-h-[220px] flex flex-col items-center justify-center">
        <div className="text-brand-warning text-3xl font-black">!</div>
        <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
          {error || comparison?.message || 'Upload a new resume version to see an evolution comparison overlay.'}
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold rounded-lg cursor-pointer hover:bg-brand-primary/20 transition-all"
        >
          Close Panel
        </button>
      </div>
    );
  }

  const {
    currentVersion,
    previousVersion,
    atsDiff,
    atsScoreCurrent,
    atsScorePrevious,
    newSkills,
    removedSkills,
    newProjects,
    newCertifications = [],
    removedCertifications = [],
    newExperience = [],
    newEducation = [],
    newLinks = [],
    formattingImprovements = [],
    keywordDiff,
    healthCurrent,
    healthPrevious,
    qualityCurrent,
    qualityPrevious
  } = comparison;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="glass-panel p-6 rounded-2xl border-brand-primary/25 bg-[#090d16]/95 backdrop-blur-xl relative overflow-hidden space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-border/40 pb-4">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-brand-primary animate-pulse" />
            Resume Version Evolution (v{previousVersion} → v{currentVersion})
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">Comparing differences in skills, projects, ATS compliance, and score metrics</p>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Delta Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* ATS Score Change */}
        <div className="p-4 bg-[#05080e]/60 border border-brand-border/60 rounded-xl flex flex-col justify-between space-y-2">
          <span className="text-[9px] text-slate-500 font-extrabold uppercase">ATS Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{atsScoreCurrent}%</span>
            {atsDiff > 0 ? (
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +{atsDiff}%
              </span>
            ) : atsDiff < 0 ? (
              <span className="text-[10px] text-red-400 font-bold flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" /> {atsDiff}%
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium flex items-center">
                <Minus className="w-3 h-3" /> 0%
              </span>
            )}
          </div>
          <span className="text-[8px] text-slate-400">Previous: {atsScorePrevious}%</span>
        </div>

        {/* Quality Score Change */}
        <div className="p-4 bg-[#05080e]/60 border border-brand-border/60 rounded-xl flex flex-col justify-between space-y-2">
          <span className="text-[9px] text-slate-500 font-extrabold uppercase">Resume Quality</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{qualityCurrent}%</span>
            {qualityCurrent - qualityPrevious > 0 ? (
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +{qualityCurrent - qualityPrevious}%
              </span>
            ) : qualityCurrent - qualityPrevious < 0 ? (
              <span className="text-[10px] text-red-400 font-bold flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" /> {qualityCurrent - qualityPrevious}%
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium flex items-center">
                <Minus className="w-3 h-3" /> 0%
              </span>
            )}
          </div>
          <span className="text-[8px] text-slate-400">Previous: {qualityPrevious}%</span>
        </div>

        {/* Keyword Match Change */}
        <div className="p-4 bg-[#05080e]/60 border border-brand-border/60 rounded-xl flex flex-col justify-between space-y-2">
          <span className="text-[9px] text-slate-500 font-extrabold uppercase">Keyword Coverage</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{atsScoreCurrent}%</span>
            {keywordDiff > 0 ? (
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +{keywordDiff}%
              </span>
            ) : keywordDiff < 0 ? (
              <span className="text-[10px] text-red-400 font-bold flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" /> {keywordDiff}%
              </span>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium flex items-center">
                <Minus className="w-3 h-3" /> 0%
              </span>
            )}
          </div>
          <span className="text-[8px] text-slate-400">Previous: {atsScorePrevious}%</span>
        </div>

        {/* Health Meter Change */}
        <div className="p-4 bg-[#05080e]/60 border border-brand-border/60 rounded-xl flex flex-col justify-between space-y-2">
          <span className="text-[9px] text-slate-500 font-extrabold uppercase">Health Rating</span>
          <div className="text-sm font-black text-white py-1">{healthCurrent}</div>
          <span className="text-[8px] text-slate-400">Previous: {healthPrevious}</span>
        </div>
      </div>

      {/* Structural Diffs Grid (Skills, Experience, Certifications, etc) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
        
        {/* New Skills Added */}
        <div className="space-y-3 bg-[#0d1321]/40 border border-brand-border/40 p-4 rounded-xl">
          <div className="flex items-center gap-1.5 border-b border-brand-border/40 pb-2 text-white font-bold">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>New Skills Added</span>
          </div>
          {newSkills.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic py-2">No new skills identified.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {newSkills.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold rounded-md">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Skills Removed */}
        <div className="space-y-3 bg-[#0d1321]/40 border border-brand-border/40 p-4 rounded-xl">
          <div className="flex items-center gap-1.5 border-b border-brand-border/40 pb-2 text-white font-bold">
            <X className="w-4 h-4 text-red-400" />
            <span>Skills Removed</span>
          </div>
          {removedSkills.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic py-2">No skills removed.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {removedSkills.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-semibold rounded-md">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* New Projects Identified */}
        <div className="space-y-3 bg-[#0d1321]/40 border border-brand-border/40 p-4 rounded-xl">
          <div className="flex items-center gap-1.5 border-b border-brand-border/40 pb-2 text-white font-bold">
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
            <span>New Projects Identified</span>
          </div>
          {newProjects.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic py-2">No new projects detected.</p>
          ) : (
            <ul className="space-y-2">
              {newProjects.map((p, idx) => (
                <li key={idx} className="text-[10px] font-medium text-slate-300 pl-3.5 relative before:absolute before:left-1 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-indigo-400">
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* New Experience (Roles) */}
        <div className="space-y-3 bg-[#0d1321]/40 border border-brand-border/40 p-4 rounded-xl">
          <div className="flex items-center gap-1.5 border-b border-brand-border/40 pb-2 text-white font-bold">
            <Briefcase className="w-4 h-4 text-sky-400" />
            <span>New Roles Identified</span>
          </div>
          {newExperience.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic py-2">No new experience blocks detected.</p>
          ) : (
            <ul className="space-y-2">
              {newExperience.map((r, idx) => (
                <li key={idx} className="text-[10px] font-medium text-slate-300 pl-3.5 relative before:absolute before:left-1 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-sky-400">
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* New Education */}
        <div className="space-y-3 bg-[#0d1321]/40 border border-brand-border/40 p-4 rounded-xl">
          <div className="flex items-center gap-1.5 border-b border-brand-border/40 pb-2 text-white font-bold">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>New Education Identified</span>
          </div>
          {newEducation.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic py-2">No new education blocks detected.</p>
          ) : (
            <ul className="space-y-2">
              {newEducation.map((e, idx) => (
                <li key={idx} className="text-[10px] font-medium text-slate-300 pl-3.5 relative before:absolute before:left-1 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-emerald-400">
                  {e}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* New Links Found */}
        <div className="space-y-3 bg-[#0d1321]/40 border border-brand-border/40 p-4 rounded-xl">
          <div className="flex items-center gap-1.5 border-b border-brand-border/40 pb-2 text-white font-bold">
            <Link2 className="w-4 h-4 text-pink-400" />
            <span>New Links Added</span>
          </div>
          {newLinks.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic py-2">No new links detected.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {newLinks.map((l, idx) => (
                <a key={idx} href={l.url} target="_blank" rel="noreferrer" className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-semibold rounded-md hover:bg-pink-500/20 transition-all">
                  {l.platform}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Added Certifications */}
        <div className="space-y-3 bg-[#0d1321]/40 border border-brand-border/40 p-4 rounded-xl">
          <div className="flex items-center gap-1.5 border-b border-brand-border/40 pb-2 text-white font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Added Certifications</span>
          </div>
          {newCertifications.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic py-2">No new certifications added.</p>
          ) : (
            <ul className="space-y-2">
              {newCertifications.map((c, idx) => (
                <li key={idx} className="text-[10px] font-medium text-slate-300 pl-3.5 relative before:absolute before:left-1 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-amber-400">
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Removed Certifications */}
        <div className="space-y-3 bg-[#0d1321]/40 border border-brand-border/40 p-4 rounded-xl">
          <div className="flex items-center gap-1.5 border-b border-brand-border/40 pb-2 text-white font-bold">
            <Award className="w-4 h-4 text-red-400" />
            <span>Removed Certifications</span>
          </div>
          {removedCertifications.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic py-2">No certifications removed.</p>
          ) : (
            <ul className="space-y-2">
              {removedCertifications.map((c, idx) => (
                <li key={idx} className="text-[10px] font-medium text-slate-300 pl-3.5 relative before:absolute before:left-1 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-red-400">
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Formatting Improvements */}
        <div className="space-y-3 bg-[#0d1321]/40 border border-brand-border/40 p-4 rounded-xl">
          <div className="flex items-center gap-1.5 border-b border-brand-border/40 pb-2 text-white font-bold">
            <FileCheck2 className="w-4 h-4 text-brand-success" />
            <span>Formatting Evolution</span>
          </div>
          {formattingImprovements.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic py-2">Structure/layout unchanged.</p>
          ) : (
            <ul className="space-y-2">
              {formattingImprovements.map((imp, idx) => (
                <li key={idx} className="text-[10px] font-medium text-slate-300 pl-3.5 relative before:absolute before:left-1 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-brand-success">
                  {imp}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </motion.div>
  );
}
