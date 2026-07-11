import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, AlertTriangle, Eye, EyeOff, Loader } from 'lucide-react';

export default function RegisterPage() {
  const { register: registerUser, error: authError, setError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    const result = await registerUser(data.fullName, data.email, data.password);
    setIsSubmitting(false);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-brand-dark overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-85 h-85 rounded-full bg-brand-primary/10 blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-85 h-85 rounded-full bg-brand-secondary/10 blur-[100px] pointer-events-none animate-pulse" />

      {/* Glassmorphic Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-panel w-full max-w-md rounded-2xl p-8 relative z-10 shadow-2xl border-brand-border/40"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3.5 mb-8 text-center">
          <div className="p-3 bg-brand-primary/10 rounded-2xl border border-brand-primary/20">
            <GraduationCap className="w-8 h-8 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Create your account on <span className="text-gradient">PrepAI</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">Practice Smarter. Interview Better.</p>
          </div>
        </div>

        {/* Dynamic validation error display */}
        {(authError || errors.fullName || errors.email || errors.password || errors.confirmPassword) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-brand-error/10 border border-brand-error/20 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-brand-error shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 font-medium">
              {authError || 
               errors.fullName?.message || 
               errors.email?.message || 
               errors.password?.message || 
               errors.confirmPassword?.message || 
               'Form inputs are invalid.'}
            </div>
          </motion.div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Full Name field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                placeholder="Jane Doe"
                {...register('fullName', {
                  required: 'Full name is required',
                  maxLength: {
                    value: 100,
                    message: 'Full name cannot exceed 100 characters'
                  }
                })}
                className="w-full bg-[#0d1222]/80 border border-brand-border/80 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <input
                type="email"
                placeholder="name@company.com"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                className="w-full bg-[#0d1222]/80 border border-brand-border/80 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters long'
                  }
                })}
                className="w-full bg-[#0d1222]/80 border border-brand-border/80 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-3 pl-11 pr-11 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === passwordVal || 'Passwords do not match'
                })}
                className="w-full bg-[#0d1222]/80 border border-brand-border/80 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary hover:brightness-110 active:brightness-95 py-3.5 mt-2 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4.5 h-4.5 animate-spin" />
                <span>Registering account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </motion.button>
        </form>

        {/* Card Footer redirect */}
        <div className="mt-8 pt-6 border-t border-brand-border/40 text-center">
          <p className="text-xs text-slate-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-primary hover:text-brand-secondary font-bold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
