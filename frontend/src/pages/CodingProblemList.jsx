import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Search,
  Filter,
  CheckCircle,
  Circle,
  Bookmark,
  BookmarkMinus,
  Loader,
  Play,
  RotateCcw
} from 'lucide-react';
import api from '../lib/api';

export default function CodingProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState('');

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coding/problems', {
        params: {
          search,
          difficulty,
          category
        }
      });
      setProblems(res.data.data.problems || []);
    } catch (err) {
      console.error('Failed to fetch coding problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [difficulty, category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProblems();
  };

  const handleToggleBookmark = async (problemId, isBookmarked) => {
    try {
      if (isBookmarked) {
        await api.delete(`/coding/bookmark/${problemId}`);
      } else {
        await api.post('/coding/bookmark', { problemId });
      }
      // Update local state
      setProblems(prev => prev.map(p => {
        if (p._id === problemId) {
          return { ...p, isBookmarked: !isBookmarked };
        }
        return p;
      }));
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setDifficulty('');
    setCategory('');
    // Trigger fetch manually after state resets
    setTimeout(() => {
      fetchProblems();
    }, 0);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header and Search Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border/40 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white">Problem Catalog</h1>
          <p className="text-xs text-slate-400">Select and solve algorithm questions.</p>
        </div>
      </div>

      {/* Filters Form Panel */}
      <form onSubmit={handleSearchSubmit} className="glass-panel p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between shadow-md">
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-brand-border focus:outline-none focus:border-brand-primary text-slate-200"
            />
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="px-4 py-2 text-xs rounded-xl bg-slate-900 border border-brand-border focus:outline-none focus:border-brand-primary text-slate-200"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 text-xs rounded-xl bg-slate-900 border border-brand-border focus:outline-none focus:border-brand-primary text-slate-200"
          >
            <option value="">All Categories</option>
            <option value="Arrays">Arrays</option>
            <option value="Strings">Strings</option>
            <option value="Linked Lists">Linked Lists</option>
            <option value="Trees">Trees</option>
            <option value="Graphs">Graphs</option>
            <option value="Dynamic Programming">Dynamic Programming</option>
            <option value="Stack">Stack</option>
            <option value="Queue">Queue</option>
            <option value="Hash Maps">Hash Maps</option>
            <option value="Greedy">Greedy</option>
            <option value="Recursion">Recursion</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-brand-primary text-xs font-bold text-white hover:bg-brand-primary/95 transition-all shadow-md"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="p-2.5 rounded-xl bg-slate-800 border border-brand-border text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Catalog Problems Table Grid */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader className="w-8 h-8 text-brand-primary animate-spin" />
        </div>
      ) : problems.length === 0 ? (
        <div className="glass-panel p-8 text-center rounded-2xl border border-dashed border-brand-border/80">
          <p className="text-sm text-slate-400">No coding problems match your filters. Reset search rules to browse.</p>
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-brand-border/60 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 text-center w-16">Status</th>
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Difficulty</th>
                  <th className="py-4 px-6">Acceptance Rate</th>
                  <th className="py-4 px-6 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40 text-sm text-slate-300">
                {problems.map((prob) => (
                  <tr key={prob._id} className="hover:bg-brand-primary/5 transition-all duration-150">
                    <td className="py-4 px-6 text-center">
                      {prob.status === 'Solved' ? (
                        <CheckCircle className="w-5 h-5 text-brand-success mx-auto" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-6 font-bold text-white flex items-center gap-2">
                      <button
                        onClick={() => handleToggleBookmark(prob._id, prob.isBookmarked)}
                        className={`text-slate-500 hover:text-brand-warning transition-colors ${
                          prob.isBookmarked ? 'text-brand-warning' : ''
                        }`}
                      >
                        {prob.isBookmarked ? <Bookmark className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                      <RouterLink to={`/coding-practice/problem/${prob.slug}`} className="hover:text-brand-primary hover:underline">
                        {prob.title}
                      </RouterLink>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400">{prob.category}</td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full uppercase ${
                        prob.difficulty === 'Easy' ? 'bg-brand-success/10 text-brand-success' :
                        prob.difficulty === 'Medium' ? 'bg-brand-warning/10 text-brand-warning' :
                        'bg-brand-danger/10 text-brand-danger'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs">{prob.acceptanceRate}%</td>
                    <td className="py-4 px-6 text-center">
                      <RouterLink
                        to={`/coding-practice/problem/${prob.slug}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-primary/10 hover:bg-brand-primary hover:text-white border border-brand-primary/20 text-brand-primary text-xs font-bold transition-all shadow-inner"
                      >
                        Solve
                        <Play className="w-3 h-3" />
                      </RouterLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
