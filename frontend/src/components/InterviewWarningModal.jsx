import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export default function InterviewWarningModal({ show, warningType, warningMessage, count, maxWarnings = 5 }) {
  // Gaze and head directions terminate after 3 sustained offscreen events
  const isGazeOrHeadViolation = ['looking_left', 'looking_right', 'looking_down', 'eye_looking_away', 'head_left', 'head_right', 'head_down', 'head_away'].includes(warningType);
  const limit = isGazeOrHeadViolation ? 3 : maxWarnings;
  // Calculate relative count to fit the limit
  const displayCount = Math.min(count, limit);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop lock blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999]"
          />

          {/* Warning Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000]">
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="glass-panel border-2 border-brand-error/60 p-8 rounded-3xl max-w-md w-full text-center space-y-6 bg-brand-card/90 shadow-2xl relative overflow-hidden"
            >
              {/* Warning background light effect */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-error/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-brand-error/10 blur-3xl pointer-events-none" />

              <div className="mx-auto w-16 h-16 rounded-2xl bg-brand-error/15 border border-brand-error/35 flex items-center justify-center text-brand-error relative">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-error px-2 py-0.5 rounded bg-brand-error/10 border border-brand-error/20 inline-block">
                  ⚠️ Proctor Warning
                </span>
                <h3 className="text-lg font-black text-white capitalize leading-tight">
                  {warningType?.replace('_', ' ')} Detected
                </h3>
                <p className="text-xs text-brand-error/90 font-bold">
                  You are repeatedly looking away from the interview screen.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {warningMessage}
                </p>
                <p className="text-xs text-slate-300 font-bold">
                  Please keep your eyes on the screen.
                </p>
              </div>

              <div className="p-4 bg-white/3 border border-brand-border/40 rounded-2xl flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Warning Status</span>
                  <span className="text-sm font-black text-white">Warning {displayCount} of {limit}</span>
                </div>
                <div className="flex gap-1.5">
                  {Array.from({ length: limit }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-5 h-1.5 rounded-full transition-all ${
                        idx < displayCount 
                          ? 'bg-brand-error' 
                          : 'bg-brand-border/80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                Continuing violations will lead to the immediate termination of this interview session.
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
