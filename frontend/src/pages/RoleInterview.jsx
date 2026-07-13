import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import {
  Briefcase,
  Sliders,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles,
  Award
} from 'lucide-react';

const ROLES_INFO = [
  { role: 'Software Engineer', difficulty: 'Hard', desc: 'Focuses on DS, Algorithms, OOD, System Design, Operating Systems, Networks.' },
  { role: 'Frontend Developer', difficulty: 'Medium', desc: 'Focuses on JavaScript (ES6+), React, CSS layout (Flexbox/Grid), Web performance, hydration, HTML.' },
  { role: 'Backend Developer', difficulty: 'Medium-Hard', desc: 'Focuses on API Design, Node/Express, SQL/NoSQL DBs, Caching, security (JWT), Kafka/Redis.' },
  { role: 'MERN Developer', difficulty: 'Medium', desc: 'Focuses on MongoDB Schemas, Express Routing, React Hook state, Node server loop, full-stack JWT validation.' },
  { role: 'AI Engineer', difficulty: 'Hard', desc: 'Focuses on Machine learning models, LLMs, prompt validation engineering, Vector DBs, PyTorch/Python.' }
];

export default function RoleInterview() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [starting, setStarting] = useState(false);

  const handleStartRoleInterview = async () => {
    if (!selectedRole) return;
    setStarting(true);
    try {
      const res = await api.post('/interview/start', {
        interviewType: 'Technical Interview',
        role: selectedRole.role,
        difficulty: selectedRole.difficulty.includes('Hard') ? 'Hard' : 'Medium'
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
          <Briefcase className="w-3.5 h-3.5" />
          Role Tracks
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Targeted <span className="text-gradient">Role Specific Training</span>
        </h1>
        <p className="text-xs text-slate-400">Launch standard developer mock assessments specific to role competencies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ROLES_INFO.map(item => {
          const isSelected = selectedRole?.role === item.role;
          return (
            <button
              key={item.role}
              onClick={() => setSelectedRole(item)}
              className={`p-6 rounded-2xl border text-left transition-all duration-300 relative group cursor-pointer ${
                isSelected
                  ? 'bg-brand-primary/10 border-brand-primary/50 text-white'
                  : 'bg-white/2 border-brand-border/60 text-slate-400 hover:border-brand-border/80'
              }`}
            >
              <div className="flex justify-between items-center border-b border-brand-border/40 pb-2">
                <h4 className="font-extrabold text-sm text-white group-hover:text-brand-primary transition-colors">{item.role}</h4>
                <span className="text-[10px] text-brand-secondary font-black uppercase">
                  Level: {item.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mt-3">{item.desc}</p>
              
              {isSelected && (
                <div className="mt-4 pt-3 border-t border-brand-border/40 flex justify-end">
                  <button
                    onClick={handleStartRoleInterview}
                    disabled={starting}
                    className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow cursor-pointer active:scale-95 transition-all"
                  >
                    {starting ? 'Initializing...' : 'Start Assessment'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
