import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';

/**
 * Route protection wrapper component
 * Forces incomplete profiles to complete onboarding unless explicitly bypassed.
 */
const ProtectedRoute = ({ children, allowIncompleteProfile = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-dark">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-brand-primary/10 border-t-brand-primary animate-spin" />
          <div className="absolute top-4">
            <GraduationCap className="w-8 h-8 text-brand-primary animate-pulse" />
          </div>
          <span className="text-xs text-slate-400 font-semibold tracking-wider uppercase animate-pulse">
            Verifying Session...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Force users to complete their onboarding profile
  if (!allowIncompleteProfile && !user.profileCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
