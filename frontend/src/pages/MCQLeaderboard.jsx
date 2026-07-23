import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Loader,
  ArrowLeft,
  Flame,
  Award,
  Zap,
  Building,
  Target
} from 'lucide-react';
import api from '../lib/api';

export default function MCQLeaderboard() {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/mcq/leaderboard');
        if (res.data?.success) {
          setLeaderboard(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1: return <span className="w-6.5 h-6.5 rounded-full bg-yellow-500/20 border border-yellow-500 text-yellow-400 font-black text-xs flex items-center justify-center">1</span>;
      case 2: return <span className="w-6.5 h-6.5 rounded-full bg-slate-300/20 border border-slate-300 text-slate-200 font-black text-xs flex items-center justify-center">2</span>;
      case 3: return <span className="w-6.5 h-6.5 rounded-full bg-amber-700/20 border border-amber-700 text-amber-600 font-black text-xs flex items-center justify-center">3</span>;
      default: return <span className="w-6.5 h-6.5 rounded-full bg-white/5 border border-brand-border text-slate-400 font-semibold text-xs flex items-center justify-center">{rank}</span>;
    }
  };

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
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Trophy className="w-7 h-7 text-yellow-500 animate-pulse" />
          Global Standings
        </h1>
        <p className="text-xs text-slate-400">
          Compare your placement preparation score and accuracy with other candidates.
        </p>
      </div>

      {/* Leaderboard Table */}
      {leaderboard.length === 0 ? (
        <div className="glass-panel p-16 text-center text-slate-400 text-xs">
          No leaderboard data available yet. Solve a quiz to initialize standings!
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs font-semibold text-slate-300">
            <thead className="bg-[#0f172a] text-slate-400 border-b border-brand-border/60 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4.5 text-center w-16">Rank</th>
                <th className="p-4.5">Candidate</th>
                <th className="p-4.5">Score</th>
                <th className="p-4.5">Solved</th>
                <th className="p-4.5">Streak</th>
                <th className="p-4.5">Accuracy</th>
                <th className="p-4.5">Target Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              {leaderboard.map((item) => (
                <tr key={item.rank} className="hover:bg-white/3 transition-colors">
                  <td className="p-4.5 text-center font-bold">
                    <div className="flex justify-center">
                      {getRankBadge(item.rank)}
                    </div>
                  </td>
                  <td className="p-4.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8.5 h-8.5 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white font-extrabold text-xs">
                        {item.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-white font-extrabold block">{item.fullName}</span>
                        <span className="text-[10px] text-slate-500">{item.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4.5 whitespace-nowrap text-white font-bold">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      {item.score} pts
                    </span>
                  </td>
                  <td className="p-4.5 whitespace-nowrap text-slate-300">
                    {item.solved} solved
                  </td>
                  <td className="p-4.5 whitespace-nowrap text-orange-400 font-extrabold">
                    <span className="flex items-center gap-0.5">
                      <Flame className="w-4 h-4 fill-current animate-bounce" />
                      {item.streak}
                    </span>
                  </td>
                  <td className="p-4.5 whitespace-nowrap font-bold">
                    <span className={item.accuracy >= 80 ? 'text-brand-success' : 'text-brand-warning'}>
                      {item.accuracy}%
                    </span>
                  </td>
                  <td className="p-4.5">
                    <div>
                      <span className="text-[9px] font-black uppercase text-brand-secondary tracking-wider block">
                        {item.targetCompany}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                        {item.targetRole}
                      </span>
                    </div>
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
