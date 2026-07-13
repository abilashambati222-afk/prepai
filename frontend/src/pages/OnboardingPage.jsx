import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { useToast } from '../components/Toast';
import { 
  GraduationCap, 
  User, 
  Briefcase, 
  Code, 
  Settings, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Loader, 
  Plus, 
  X,
  Phone,
  Link as LinkIcon
} from 'lucide-react';

const STEPS = [
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'career', name: 'Career Focus', icon: Briefcase },
  { id: 'skills', name: 'Skills Inventory', icon: Code },
  { id: 'preferences', name: 'Preferences', icon: Settings }
];

export default function OnboardingPage() {
  const { user, login } = useAuth(); // User state context
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Skills tag lists state
  const [skills, setSkills] = useState({
    programmingLanguages: [],
    frameworks: [],
    databases: [],
    tools: []
  });

  const [preferredCompanies, setPreferredCompanies] = useState([]);

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
      targetCompany: user?.targetCompany || '',
      targetTimeline: user?.targetTimeline || '',
      experienceLevel: user?.experienceLevel || 'Student',
      github: user?.github || '',
      linkedin: user?.linkedin || '',
      portfolio: user?.portfolio || '',
      dailyGoal: user?.dailyGoal || 5,
      preferredDifficulty: user?.preferredDifficulty || 'Medium'
    }
  });

  // Redirect if profile is already complete
  if (user?.profileCompleted) {
    return <Navigate to="/" replace />;
  }

  const handleAddTag = (category, valueKey, inputKey) => {
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
        showToast('Onboarding complete! Welcome to your PrepAI Dashboard.', 'success');
        // Refresh local user session
        window.location.reload();
      }
    } catch (err) {
      showToast(err.message || 'Failed to complete onboarding.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-primary/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-secondary/10 blur-[120px] pointer-events-none animate-pulse" />

      {/* Onboarding Header */}
      <div className="text-center mb-8 max-w-md relative z-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Let's personalize <span className="text-gradient-animate">PrepAI</span>
        </h1>
        <p className="text-xs text-slate-400 mt-2 font-medium">
          Tell us about your background, career targets, and skills to tailor your placement roadmap.
        </p>
      </div>

      {/* Progress Wizard tracker */}
      <div className="w-full max-w-3xl mb-8 relative z-10 flex items-center justify-between px-6">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = currentStep > idx;
          const isActive = currentStep === idx;
          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <div className={`flex-1 h-[2px] mx-4 transition-all duration-300 ${
                  isCompleted ? 'bg-brand-primary' : 'bg-brand-border/60'
                }`} />
              )}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-brand-primary border-brand-primary text-white' 
                    : isActive 
                      ? 'bg-brand-primary/15 border-brand-primary text-brand-primary shadow-lg shadow-brand-primary/10'
                      : 'bg-brand-card/50 border-brand-border text-slate-400'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  isActive ? 'text-brand-primary' : 'text-slate-500'
                }`}>
                  {step.name}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Container Card */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-3xl glass-panel p-6 md:p-8 rounded-2xl relative z-10 shadow-2xl space-y-6">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Step 1: Education details */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-white border-b border-brand-border/40 pb-2">Academic & Personal Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Full Name</label>
                    <input 
                      type="text"
                      {...register('fullName', { required: 'Full name is required.' })}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
                    />
                    {errors.fullName && <p className="text-[10px] text-brand-error mt-0.5">{errors.fullName.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Phone Number (Optional)</label>
                    <input 
                      type="text"
                      placeholder="+919876543210"
                      {...register('phone', {
                        pattern: {
                          value: /^\+?[1-9]\d{1,14}$/,
                          message: 'Please enter a valid phone number (10-15 digits).'
                        }
                      })}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
                    />
                    {errors.phone && <p className="text-[10px] text-brand-error mt-0.5">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">College / University</label>
                    <input 
                      type="text"
                      placeholder="Indian Institute of Technology"
                      {...register('college', { required: 'College is required.' })}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
                    />
                    {errors.college && <p className="text-[10px] text-brand-error mt-0.5">{errors.college.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Degree Program</label>
                    <input 
                      type="text"
                      placeholder="B.Tech / B.E / MCA"
                      {...register('degree', { required: 'Degree is required.' })}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
                    />
                    {errors.degree && <p className="text-[10px] text-brand-error mt-0.5">{errors.degree.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Branch / Specialization</label>
                    <input 
                      type="text"
                      placeholder="Computer Science"
                      {...register('branch', { required: 'Branch is required.' })}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
                    />
                    {errors.branch && <p className="text-[10px] text-brand-error mt-0.5">{errors.branch.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Graduation Year</label>
                    <input 
                      type="number"
                      placeholder="2027"
                      {...register('graduationYear', { 
                        required: 'Graduation year is required.',
                        min: { value: 1980, message: 'Invalid year (1980-2040).' },
                        max: { value: 2040, message: 'Invalid year (1980-2040).' }
                      })}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
                    />
                    {errors.graduationYear && <p className="text-[10px] text-brand-error mt-0.5">{errors.graduationYear.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">CGPA / Percentage (Optional)</label>
                    <input 
                      type="text"
                      placeholder="9.2"
                      {...register('cgpa', {
                        validate: val => !val || (Number(val) >= 0 && Number(val) <= 10) || 'CGPA must be between 0.0 and 10.0'
                      })}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
                    />
                    {errors.cgpa && <p className="text-[10px] text-brand-error mt-0.5">{errors.cgpa.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Career focus & preferred companies */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-white border-b border-brand-border/40 pb-2">Career Targets</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Target Role</label>
                    <input 
                      type="text"
                      placeholder="Software Development Engineer (SDE)"
                      {...register('targetRole', { required: 'Target role is required.' })}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none transition-all"
                    />
                    {errors.targetRole && <p className="text-[10px] text-brand-error mt-0.5">{errors.targetRole.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Experience Level</label>
                    <select
                      {...register('experienceLevel')}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white outline-none transition-all"
                    >
                      <option value="Student">Student</option>
                      <option value="Fresher">Fresher (Graduate)</option>
                      <option value="Experienced">Experienced Professional</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Target Dream Company</label>
                    <select
                      {...register('targetCompany')}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white outline-none transition-all"
                    >
                      <option value="">Select Dream Company</option>
                      <option value="Google">Google</option>
                      <option value="Amazon">Amazon</option>
                      <option value="Microsoft">Microsoft</option>
                      <option value="Meta">Meta</option>
                      <option value="Adobe">Adobe</option>
                      <option value="Oracle">Oracle</option>
                      <option value="Salesforce">Salesforce</option>
                      <option value="Capgemini">Capgemini</option>
                      <option value="Cognizant">Cognizant</option>
                      <option value="Deloitte">Deloitte</option>
                      <option value="TCS">TCS</option>
                      <option value="Infosys">Infosys</option>
                      <option value="Wipro">Wipro</option>
                      <option value="Tech Mahindra">Tech Mahindra</option>
                      <option value="Accenture">Accenture</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Target Year</label>
                    <select
                      {...register('targetTimeline')}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white outline-none transition-all"
                    >
                      <option value="">Select Target Year</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                      <option value="2028">2028</option>
                      <option value="2029">2029</option>
                      <option value="2030">2030</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Preferred Dream Companies</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Google, Microsoft, Amazon"
                      value={inputVal.companies}
                      onChange={(e) => setInputVal(prev => ({ ...prev, companies: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('companies', null, 'companies'); } }}
                      className="flex-1 bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white outline-none transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => handleAddTag('companies', null, 'companies')}
                      className="px-4 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {preferredCompanies.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold">
                        {c}
                        <button type="button" onClick={() => handleRemoveTag('companies', c)} className="hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {preferredCompanies.length === 0 && <span className="text-[10px] text-slate-500 italic">No companies added yet.</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Skill Sets */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-base font-bold text-white border-b border-brand-border/40 pb-2">Skills Inventory</h2>
                
                {/* Languages */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Programming Languages</label>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="JavaScript, Python, C++, Java"
                      value={inputVal.languages}
                      onChange={(e) => setInputVal(prev => ({ ...prev, languages: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('programmingLanguages', null, 'languages'); } }}
                      className="flex-1 bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                    />
                    <button type="button" onClick={() => handleAddTag('programmingLanguages', null, 'languages')} className="px-4 py-2.5 bg-brand-primary rounded-xl text-xs font-bold text-white cursor-pointer"><Plus className="w-4 h-4" /></button>
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
                      placeholder="React, Express, Node.js, Spring Boot"
                      value={inputVal.frameworks}
                      onChange={(e) => setInputVal(prev => ({ ...prev, frameworks: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('frameworks', null, 'frameworks'); } }}
                      className="flex-1 bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                    />
                    <button type="button" onClick={() => handleAddTag('frameworks', null, 'frameworks')} className="px-4 py-2.5 bg-brand-primary rounded-xl text-xs font-bold text-white cursor-pointer"><Plus className="w-4 h-4" /></button>
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
                      placeholder="MongoDB, PostgreSQL, MySQL"
                      value={inputVal.databases}
                      onChange={(e) => setInputVal(prev => ({ ...prev, databases: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('databases', null, 'databases'); } }}
                      className="flex-1 bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                    />
                    <button type="button" onClick={() => handleAddTag('databases', null, 'databases')} className="px-4 py-2.5 bg-brand-primary rounded-xl text-xs font-bold text-white cursor-pointer"><Plus className="w-4 h-4" /></button>
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
                      placeholder="Git, Docker, AWS, Postman"
                      value={inputVal.tools}
                      onChange={(e) => setInputVal(prev => ({ ...prev, tools: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('tools', null, 'tools'); } }}
                      className="flex-1 bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                    />
                    <button type="button" onClick={() => handleAddTag('tools', null, 'tools')} className="px-4 py-2.5 bg-brand-primary rounded-xl text-xs font-bold text-white cursor-pointer"><Plus className="w-4 h-4" /></button>
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

            {/* Step 4: Social links & settings */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-white border-b border-brand-border/40 pb-2">Links & Practice Options</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">GitHub Profile URL</label>
                    <input 
                      type="text"
                      placeholder="https://github.com/username"
                      {...register('github', {
                        validate: val => !val || (val.startsWith('http') && val.includes('github.com')) || 'Must be a valid GitHub URL (e.g. https://github.com/username)'
                      })}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none"
                    />
                    {errors.github && <p className="text-[10px] text-brand-error mt-0.5">{errors.github.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">LinkedIn Profile URL</label>
                    <input 
                      type="text"
                      placeholder="https://linkedin.com/in/username"
                      {...register('linkedin', {
                        validate: val => !val || (val.startsWith('http') && val.includes('linkedin.com')) || 'Must be a valid LinkedIn URL (e.g. https://linkedin.com/in/username)'
                      })}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none"
                    />
                    {errors.linkedin && <p className="text-[10px] text-brand-error mt-0.5">{errors.linkedin.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Portfolio URL (Optional)</label>
                  <input 
                    type="text"
                    placeholder="https://myportfolio.com"
                    {...register('portfolio', {
                      validate: val => !val || val.startsWith('http') || 'Must be a valid URL (starting with http/https)'
                    })}
                    className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-500 outline-none"
                  />
                  {errors.portfolio && <p className="text-[10px] text-brand-error mt-0.5">{errors.portfolio.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Daily Placement Prep Goal (Questions)</label>
                    <input 
                      type="number"
                      {...register('dailyGoal', { min: { value: 1, message: 'Minimum 1 question' } })}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                    />
                    {errors.dailyGoal && <p className="text-[10px] text-brand-error mt-0.5">{errors.dailyGoal.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Preferred Prep Difficulty</label>
                    <select
                      {...register('preferredDifficulty')}
                      className="w-full bg-[#0d1222]/80 border border-brand-border focus-ring rounded-xl py-2.5 px-4 text-xs text-white outline-none"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Wizard Controls */}
        <div className="flex items-center justify-between border-t border-brand-border/40 pt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-brand-border hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent text-xs font-bold text-white transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
            Back
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:brightness-110 active:scale-98 transition-all cursor-pointer"
            >
              Continue
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-xl text-xs font-extrabold hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4.5 h-4.5 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  Complete Setup
                  <Check className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
