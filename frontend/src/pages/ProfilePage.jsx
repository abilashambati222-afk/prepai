import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileCompletionCard from '../components/ProfileCompletionCard';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Settings, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Globe, 
  Edit3,
  Calendar,
  Award,
  Building,
  Target
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-brand-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Candidate Profile</h1>
          <p className="text-xs text-slate-400">Review your academic credentials and system configurations.</p>
        </div>
        <Link 
          to="/profile/edit"
          className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:brightness-110 active:scale-98 transition-all"
        >
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      {/* Completion Readiness Indicator Card */}
      <ProfileCompletionCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Summary Card */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white text-3xl font-black shadow-lg border border-brand-border">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{user?.fullName}</h2>
              <span className="text-[10px] bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-wider mt-1.5 inline-block">
                {user?.role}
              </span>
            </div>

            <div className="w-full border-t border-brand-border/40 pt-4 space-y-3 text-left">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{user?.phone || 'No phone number provided'}</span>
              </div>
            </div>
          </div>

          {/* Social Connections */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-secondary">Social Links</h3>
            <div className="space-y-3.5">
              {user?.github ? (
                <a 
                  href={user.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <Github className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <span className="truncate">GitHub Profile</span>
                </a>
              ) : (
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Github className="w-4.5 h-4.5 shrink-0" />
                  <span className="italic">No GitHub linked</span>
                </div>
              )}

              {user?.linkedin ? (
                <a 
                  href={user.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <span className="truncate">LinkedIn Profile</span>
                </a>
              ) : (
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Linkedin className="w-4.5 h-4.5 shrink-0" />
                  <span className="italic">No LinkedIn linked</span>
                </div>
              )}

              {user?.portfolio ? (
                <a 
                  href={user.portfolio} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <Globe className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                  <span className="truncate">Portfolio website</span>
                </a>
              ) : (
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Globe className="w-4.5 h-4.5 shrink-0" />
                  <span className="italic">No portfolio website linked</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Education Section */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
              <GraduationCap className="w-5 h-5 text-brand-primary" />
              <h3 className="text-sm font-bold text-white">Education Details</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">College / University</span>
                <p className="text-sm font-semibold text-slate-200">{user?.college || 'Not set'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Degree</span>
                <p className="text-sm font-semibold text-slate-200">{user?.degree || 'Not set'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Specialization</span>
                <p className="text-sm font-semibold text-slate-200">{user?.branch || 'Not set'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Graduation</span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{user?.graduationYear || 'Not set'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CGPA</span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                    <Award className="w-4 h-4 text-slate-400" />
                    <span>{user?.cgpa ? `${user.cgpa}/10.0` : 'Not set'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Career & Dreaming Companies */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
              <Briefcase className="w-5 h-5 text-brand-primary" />
              <h3 className="text-sm font-bold text-white">Career Profile</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Job Role</span>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                  <Target className="w-4 h-4 text-slate-400" />
                  <span>{user?.targetRole || 'Not set'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Experience Classification</span>
                <p className="text-sm font-semibold text-slate-200">{user?.experienceLevel || 'Not set'}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Target Placements Companies</span>
              <div className="flex flex-wrap gap-2">
                {user?.preferredCompanies?.map((company) => (
                  <span key={company} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold">
                    <Building className="w-3.5 h-3.5 shrink-0" />
                    {company}
                  </span>
                ))}
                {(!user?.preferredCompanies || user.preferredCompanies.length === 0) && (
                  <span className="text-xs text-slate-500 italic">No dream companies configured yet.</span>
                )}
              </div>
            </div>
          </div>

          {/* Skills Directory */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
              <Code className="w-5 h-5 text-brand-primary" />
              <h3 className="text-sm font-bold text-white">Skills Inventory</h3>
            </div>
            
            <div className="space-y-4 pt-2">
              {/* Languages */}
              <div className="space-y-2">
                <span className="text-[10px] text-brand-secondary font-bold uppercase tracking-wider block">Programming Languages</span>
                <div className="flex flex-wrap gap-2">
                  {user?.programmingLanguages?.map((lang) => (
                    <span key={lang} className="px-3 py-1 bg-brand-secondary/10 border border-brand-secondary/20 text-brand-secondary text-xs font-semibold rounded-full">{lang}</span>
                  ))}
                  {(!user?.programmingLanguages || user.programmingLanguages.length === 0) && <span className="text-xs text-slate-500 italic">None added.</span>}
                </div>
              </div>

              {/* Frameworks */}
              <div className="space-y-2">
                <span className="text-[10px] text-brand-accent font-bold uppercase tracking-wider block">Frameworks & Libraries</span>
                <div className="flex flex-wrap gap-2">
                  {user?.frameworks?.map((fw) => (
                    <span key={fw} className="px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-semibold rounded-full">{fw}</span>
                  ))}
                  {(!user?.frameworks || user.frameworks.length === 0) && <span className="text-xs text-slate-500 italic">None added.</span>}
                </div>
              </div>

              {/* Databases & Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Databases</span>
                  <div className="flex flex-wrap gap-2">
                    {user?.databases?.map((db) => (
                      <span key={db} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-full">{db}</span>
                    ))}
                    {(!user?.databases || user.databases.length === 0) && <span className="text-xs text-slate-500 italic">None added.</span>}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">DevOps & Tools</span>
                  <div className="flex flex-wrap gap-2">
                    {user?.tools?.map((tool) => (
                      <span key={tool} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">{tool}</span>
                    ))}
                    {(!user?.tools || user.tools.length === 0) && <span className="text-xs text-slate-500 italic">None added.</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
              <Settings className="w-5 h-5 text-brand-primary" />
              <h3 className="text-sm font-bold text-white">Platform Settings & Goals</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Daily Goal</span>
                <p className="text-sm font-semibold text-slate-200">{user?.dailyGoal} Questions</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Prep Difficulty</span>
                <p className="text-sm font-semibold text-slate-200">{user?.preferredDifficulty}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Notifications</span>
                <p className="text-sm font-semibold text-slate-200">{user?.notificationsEnabled ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
