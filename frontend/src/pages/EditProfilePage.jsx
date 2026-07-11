import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { useToast } from '../components/Toast';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Settings, 
  Save, 
  Loader, 
  ArrowLeft, 
  Plus, 
  X 
} from 'lucide-react';

const TABS = [
  { id: 'education', name: 'Personal & Education', icon: GraduationCap },
  { id: 'career', name: 'Career & Targets', icon: Briefcase },
  { id: 'skills', name: 'Skills Directory', icon: Code },
  { id: 'settings', name: 'Settings & Links', icon: Settings }
];

export default function EditProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('education');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Skills tag lists state
  const [skills, setSkills] = useState({
    programmingLanguages: user?.programmingLanguages || [],
    frameworks: user?.frameworks || [],
    databases: user?.databases || [],
    tools: user?.tools || []
  });

  const [preferredCompanies, setPreferredCompanies] = useState(user?.preferredCompanies || []);

  // Tag inputs state helpers
  const [inputVal, setInputVal] = useState({
    languages: '',
    frameworks: '',
    databases: '',
    tools: '',
    companies: ''
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      college: user?.college || '',
      degree: user?.degree || '',
      branch: user?.branch || '',
      graduationYear: user?.graduationYear || '',
      cgpa: user?.cgpa || '',
      targetRole: user?.targetRole || '',
      experienceLevel: user?.experienceLevel || 'Student',
      github: user?.github || '',
      linkedin: user?.linkedin || '',
      portfolio: user?.portfolio || '',
      dailyGoal: user?.dailyGoal || 5,
      preferredDifficulty: user?.preferredDifficulty || 'Medium',
      notificationsEnabled: user?.notificationsEnabled !== false
    }
  });

  const handleAddTag = (category, inputKey) => {
    const val = inputVal[inputKey].trim();
    if (!val) return;
    
    if (category === 'companies') {
      if (!preferredCompanies.includes(val)) {
        setPreferredCompanies(prev => [...prev, val]);
      }
    } else {
      if (!skills[category].includes(val)) {
        setSkills(prev => ({
          ...prev,
          [category]: [...prev[category], val]
        }));
      }
    }
    setInputVal(prev => ({ ...prev, [inputKey]: '' }));
  };

  const handleRemoveTag = (category, val) => {
    if (category === 'companies') {
      setPreferredCompanies(prev => prev.filter(c => c !== val));
    } else {
      setSkills(prev => ({
        ...prev,
        [category]: prev[category].filter(item => item !== val)
      }));
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        preferredCompanies,
        programmingLanguages: skills.programmingLanguages,
        frameworks: skills.frameworks,
        databases: skills.databases,
        tools: skills.tools,
        graduationYear: data.graduationYear ? Number(data.graduationYear) : null,
        cgpa: data.cgpa ? Number(data.cgpa) : null,
        dailyGoal: Number(data.dailyGoal)
      };

      const response = await api.put('/profile', payload);
      if (response.data?.success) {
        showToast('Profile updated successfully!', 'success');
        // Refresh local session user profile
        window.location.reload();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-4 border-b border-brand-border/60 pb-5">
        <Link 
          to="/profile"
          className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Edit Profile</h1>
          <p className="text-xs text-slate-400">Modify your academic qualifications and developer credentials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Left Side: Navigation Tabs */}
        <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 border-b md:border-b-0 border-brand-border/40">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-brand-primary/10 border-brand-primary/30 text-white' 
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab Form Panel */}
        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-3 glass-panel p-6 md:p-8 rounded-2xl space-y-6">
          
          {/* Tab 1: Personal & Education */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-brand-border/40 pb-2">Academic Profile</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input 
                    type="text"
                    {...register('fullName', { required: 'Full name is required.' })}
                    className="w-full bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                  <input 
                    type="text"
                    {...register('phone', {
                      pattern: {
                        value: /^\+?[1-9]\d{1,14}$/,
                        message: 'Invalid phone number format.'
                      }
                    })}
                    className="w-full bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">College / University</label>
                  <input 
                    type="text"
                    {...register('college', { required: 'College is required.' })}
                    className="w-full bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Degree</label>
                  <input 
                    type="text"
                    {...register('degree', { required: 'Degree is required.' })}
                    className="w-full bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Branch / Specialization</label>
                  <input 
                    type="text"
                    {...register('branch', { required: 'Branch is required.' })}
                    className="w-full bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Graduation Year</label>
                  <input 
                    type="number"
                    {...register('graduationYear', { 
                      required: 'Graduation year is required.',
                      min: { value: 1980, message: 'Invalid year.' },
                      max: { value: 2040, message: 'Invalid year.' }
                    })}
                    className="w-full bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">CGPA / 10.0</label>
                  <input 
                    type="text"
                    {...register('cgpa', {
                      validate: val => !val || (Number(val) >= 0 && Number(val) <= 10) || 'Must be between 0.0 and 10.0'
                    })}
                    className="w-full bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Career Targets */}
          {activeTab === 'career' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-brand-border/40 pb-2">Career Focus</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Target Role</label>
                  <input 
                    type="text"
                    {...register('targetRole', { required: 'Target role is required.' })}
                    className="w-full bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Experience Level</label>
                  <select
                    {...register('experienceLevel')}
                    className="w-full bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                  >
                    <option value="Student">Student</option>
                    <option value="Fresher">Fresher (Graduate)</option>
                    <option value="Experienced">Experienced Professional</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Preferred Dream Companies</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={inputVal.companies}
                    onChange={(e) => setInputVal(prev => ({ ...prev, companies: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('companies', 'companies'); } }}
                    className="flex-1 bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                  />
                  <button type="button" onClick={() => handleAddTag('companies', 'companies')} className="px-4 py-2.5 bg-brand-primary rounded-xl text-xs font-bold text-white cursor-pointer"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {preferredCompanies.map(c => (
                    <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold">
                      {c} <button type="button" onClick={() => handleRemoveTag('companies', c)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Skills Inventory */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white border-b border-brand-border/40 pb-2">Skills Directory</h3>
              
              {/* Programming Languages */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Programming Languages</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={inputVal.languages}
                    onChange={(e) => setInputVal(prev => ({ ...prev, languages: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('programmingLanguages', 'languages'); } }}
                    className="flex-1 bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                  />
                  <button type="button" onClick={() => handleAddTag('programmingLanguages', 'languages')} className="px-4 py-2.5 bg-brand-primary rounded-xl text-xs font-bold text-white cursor-pointer"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.programmingLanguages.map(l => (
                    <span key={l} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary/15 border border-brand-secondary/30 text-brand-secondary text-xs font-semibold">
                      {l} <button type="button" onClick={() => handleRemoveTag('programmingLanguages', l)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Frameworks */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Frameworks / Libraries</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={inputVal.frameworks}
                    onChange={(e) => setInputVal(prev => ({ ...prev, frameworks: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('frameworks', 'frameworks'); } }}
                    className="flex-1 bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                  />
                  <button type="button" onClick={() => handleAddTag('frameworks', 'frameworks')} className="px-4 py-2.5 bg-brand-primary rounded-xl text-xs font-bold text-white cursor-pointer"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.frameworks.map(f => (
                    <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-accent/15 border border-brand-accent/30 text-brand-accent text-xs font-semibold">
                      {f} <button type="button" onClick={() => handleRemoveTag('frameworks', f)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Databases */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Databases</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={inputVal.databases}
                    onChange={(e) => setInputVal(prev => ({ ...prev, databases: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('databases', 'databases'); } }}
                    className="flex-1 bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                  />
                  <button type="button" onClick={() => handleAddTag('databases', 'databases')} className="px-4 py-2.5 bg-brand-primary rounded-xl text-xs font-bold text-white cursor-pointer"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.databases.map(d => (
                    <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                      {d} <button type="button" onClick={() => handleRemoveTag('databases', d)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">DevOps & Tools</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={inputVal.tools}
                    onChange={(e) => setInputVal(prev => ({ ...prev, tools: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('tools', 'tools'); } }}
                    className="flex-1 bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                  />
                  <button type="button" onClick={() => handleAddTag('tools', 'tools')} className="px-4 py-2.5 bg-brand-primary rounded-xl text-xs font-bold text-white cursor-pointer"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.tools.map(t => (
                    <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                      {t} <button type="button" onClick={() => handleRemoveTag('tools', t)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Settings & Links */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-brand-border/40 pb-2">Links & Settings</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">GitHub Profile URL</label>
                  <input 
                    type="text"
                    {...register('github', {
                      validate: val => !val || (val.startsWith('http') && val.includes('github.com')) || 'Must be a valid GitHub URL'
                    })}
                    className="w-full bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                  />
                  {errors.github && <p className="text-[10px] text-brand-error mt-0.5">{errors.github.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">LinkedIn Profile URL</label>
                  <input 
                    type="text"
                    {...register('linkedin', {
                      validate: val => !val || (val.startsWith('http') && val.includes('linkedin.com')) || 'Must be a valid LinkedIn URL'
                    })}
                    className="w-full bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                  />
                  {errors.linkedin && <p className="text-[10px] text-brand-error mt-0.5">{errors.linkedin.message}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Portfolio Website URL</label>
                <input 
                  type="text"
                  {...register('portfolio', {
                    validate: val => !val || val.startsWith('http') || 'Must be a valid URL'
                  })}
                  className="w-full bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                />
                {errors.portfolio && <p className="text-[10px] text-brand-error mt-0.5">{errors.portfolio.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Daily Prep Goal (Questions)</label>
                  <input 
                    type="number"
                    {...register('dailyGoal')}
                    className="w-full bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Preferred Difficulty</label>
                  <select
                    {...register('preferredDifficulty')}
                    className="w-full bg-[#0d1222]/80 border border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox"
                  id="notificationsEnabled"
                  {...register('notificationsEnabled')}
                  className="rounded border-brand-border text-brand-primary focus:ring-brand-primary/20 w-4 h-4 bg-brand-dark cursor-pointer"
                />
                <label htmlFor="notificationsEnabled" className="text-xs font-semibold text-slate-300 cursor-pointer select-none">
                  Enable Daily Prep Notifications & Recommendations
                </label>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-brand-border/40 pt-6">
            <Link 
              to="/profile"
              className="px-5 py-2.5 border border-brand-border hover:bg-white/5 rounded-xl text-xs font-bold text-white transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-extrabold hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving updates...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
