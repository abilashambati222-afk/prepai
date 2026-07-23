import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Award,
  Loader,
  ArrowLeft,
  Search,
  Eye,
  Sliders
} from 'lucide-react';
import api from '../lib/api';

export default function MCQHistory() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/mcq/history');
        if (res.data?.success) {
          setHistory(res.data.data.history || []);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const filteredHistory = history.filter(item => {
    const matchSearch = item.topic.toLowerCase().includes(search.toLowerCase()) || item.subject.toLowerCase().includes(search.toLowerCase());
    const matchSubject = selectedSubject ? item.subject === selectedSubject : true;
    return matchSearch && matchSubject;
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Title */}
      <div className="space-y-2">
        <Link
          to="/mcq-practice"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to MCQ Dashboard
        </Link>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Attempt History
        </h1>
        <p className="text-xs text-slate-400">
          Review details of your completed MCQ assessment sessions.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by subject or topic name..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-border/60 focus:border-brand-primary bg-[#0f172a] text-slate-200 text-xs transition-colors"
          />
        </div>
        <select
          value={selectedSubject}
          onChange={e => setSelectedSubject(e.target.value)}
          className="p-3 rounded-xl border border-brand-border/60 bg-[#0f172a] text-xs text-slate-300 min-w-[180px]"
        >
          <option value="">All Subjects</option>
          <option value="Aptitude">Aptitude</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Company Prep">Company Prep</option>
        </select>
      </div>

      {/* History table list */}
      {filteredHistory.length === 0 ? (
        <div className="glass-panel p-16 text-center text-slate-400 text-xs">
          No past quiz attempts found matching filters.
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs font-semibold text-slate-300">
            <thead className="bg-[#0f172a] text-slate-400 border-b border-brand-border/60 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4.5">Date</th>
                <th className="p-4.5">Subject & Topic</th>
                <th className="p-4.5">Mode</th>
                <th className="p-4.5">Score</th>
                <th className="p-4.5">Accuracy</th>
                <th className="p-4.5">Time</th>
                <th className="p-4.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              {filteredHistory.map((item) => (
                <tr key={item._id} className="hover:bg-white/3 transition-colors">
                  <td className="p-4.5 whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(item.completedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  </td>
                  <td className="p-4.5">
                    <div>
                      <span className="text-[10px] text-brand-primary uppercase tracking-wide block">{item.subject}</span>
                      <span className="text-white font-bold leading-relaxed">{item.topic}</span>
                    </div>
                  </td>
                  <td className="p-4.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      item.quizMode === 'Test' ? 'bg-brand-warning/10 text-brand-warning' : 'bg-brand-secondary/10 text-brand-secondary'
                    }`}>
                      {item.quizMode}
                    </span>
                  </td>
                  <td className="p-4.5 whitespace-nowrap text-white font-bold">
                    {item.score} / {item.totalQuestions}
                  </td>
                  <td className="p-4.5 whitespace-nowrap">
                    <span className={`font-bold ${item.accuracy >= 80 ? 'text-brand-success' : 'text-brand-warning'}`}>
                      {item.accuracy}%
                    </span>
                  </td>
                  <td className="p-4.5 whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {formatTime(item.timeSpent)}
                    </span>
                  </td>
                  <td className="p-4.5 whitespace-nowrap text-center">
                    <Link
                      to="/mcq/results"
                      state={{ testDetails: item }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-brand-border hover:border-brand-primary text-slate-300 hover:text-white transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
