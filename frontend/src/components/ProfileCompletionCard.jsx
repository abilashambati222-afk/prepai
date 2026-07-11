import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { AlertCircle, ArrowRight, Loader } from 'lucide-react';

export default function ProfileCompletionCard() {
  const { user } = useAuth();
  const [percent, setPercent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const response = await api.get('/profile/completion');
        if (response.data?.success) {
          setPercent(response.data.data.completionPercentage);
        }
      } catch (err) {
        console.error('Failed to load profile completion metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletion();
  }, [user]);

  // Find fields that might be missing to suggest improvements
  const getSuggestions = () => {
    const missing = [];
    if (!user?.phone) missing.push('Phone Number');
    if (!user?.cgpa) missing.push('CGPA');
    if (!user?.preferredCompanies || user.preferredCompanies.length === 0) missing.push(' ड्रीम Companies');
    if (!user?.programmingLanguages || user.programmingLanguages.length === 0) missing.push('Languages/Skills');
    if (!user?.github) missing.push('GitHub Profile');
    if (!user?.linkedin) missing.push('LinkedIn Profile');
    return missing.slice(0, 3);
  };

  const suggestions = getSuggestions();

  if (loading) {
    return (
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-center min-h-[140px]">
        <Loader className="w-6 h-6 text-brand-primary animate-spin" />
      </div>
    );
  }

  // SVG Circular progress configurations
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-brand-secondary/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center gap-4.5 min-w-0 flex-1">
        {/* SVG Circular Progress Circle */}
        <div className="relative shrink-0 w-20 h-20 flex items-center justify-center bg-brand-dark/40 rounded-full border border-brand-border">
          <svg className="w-18 h-18 transform -rotate-90">
            {/* Background circle track */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              className="stroke-brand-border"
              strokeWidth="4"
              fill="transparent"
            />
            {/* Foreground progress circle */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              className="stroke-brand-primary transition-all duration-500 ease-out"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-sm font-black text-white">{percent}%</span>
        </div>

        <div className="space-y-1.5 text-center sm:text-left min-w-0">
          <h3 className="text-sm font-extrabold text-white">Profile Readiness Strength</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {percent === 100 
              ? 'Your profile is fully completed and ready for advanced AI evaluation metrics!' 
              : 'Complete your profile information to unlock full placement simulations.'}
          </p>
          {suggestions.length > 0 && (
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] text-brand-secondary font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Suggested updates: {suggestions.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 w-full sm:w-auto">
        <Link 
          to="/profile/edit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-brand-primary/10 border border-brand-primary/25 hover:bg-brand-primary/20 text-brand-primary text-xs font-bold rounded-xl transition-all group"
        >
          <span>Complete Profile</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
