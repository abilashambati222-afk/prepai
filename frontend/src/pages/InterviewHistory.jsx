import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/api';
import {
  History,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';

export default function InterviewHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/interview/history');
        if (res.data?.success) {
          setHistory(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400 text-xs animate-pulse">
        <History className="w-5 h-5 animate-spin mr-2" />
        Retrieving simulation history...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
          <History className="w-3.5 h-3.5" />
          History Tracker
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Your Past <span className="text-gradient">Simulations logs</span>
        </h1>
        <p className="text-xs text-slate-400">Review scores, feedbacks, and certificates for all completed mock interviews.</p>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((session, idx) => {
              const score = session.analytics?.overallScore || 0;
              const dateText = new Date(session.createdAt).toLocaleDateString();
              const isCompleted = session.status === 'completed';

              return (
                <div
                  key={session._id}
                  className="p-4 rounded-xl border border-brand-border/60 bg-white/2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 hover:border-brand-primary/40 hover:bg-brand-primary/5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        isCompleted 
                          ? 'bg-brand-success/15 border border-brand-success/20 text-brand-success' 
                          : 'bg-brand-warning/15 border border-brand-warning/20 text-brand-warning'
                      }`}>
                        {session.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{session.interviewType}</span>
                    </div>

                    <h4 className="font-extrabold text-sm text-white leading-tight">
                      {session.role || 'Software Engineer'} {session.company ? `at ${session.company}` : ''}
                    </h4>

                    <div className="flex flex-wrap gap-4 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {dateText}</span>
                      <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> {session.difficulty} level</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-brand-border/40 pt-4 sm:pt-0">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-500 block uppercase font-bold">Overall Score</span>
                      <span className="text-lg font-black text-white">{isCompleted ? `${score}%` : 'N/A'}</span>
                    </div>

                    {isCompleted ? (
                      <Link
                        to={`/mock-interviews/report/${session._id}`}
                        className="px-4 py-2 bg-brand-primary/10 border border-brand-primary/35 hover:bg-brand-primary hover:text-white rounded-lg text-xs font-bold text-brand-primary transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        Report Card
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <Link
                        to={`/mock-interviews/session/${session._id}`}
                        className="px-4 py-2 bg-brand-warning/10 border border-brand-warning/35 hover:bg-brand-warning hover:text-white rounded-lg text-xs font-bold text-brand-warning transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        Resume Session
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 text-xs gap-3">
            <History className="w-10 h-10 text-slate-600" />
            <span>You have not completed any mock interviews yet.</span>
            <Link to="/mock-interviews/setup" className="px-5 py-2.5 bg-brand-primary rounded-xl text-white font-bold text-xs mt-2.5 cursor-pointer">
              Launch Setup Panel
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
