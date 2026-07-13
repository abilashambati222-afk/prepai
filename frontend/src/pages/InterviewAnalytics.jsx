import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { TrendingUp, BarChart3, Clock, HelpCircle, Layers, Sparkles } from 'lucide-react';

export default function InterviewAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/interview/analytics');
        if (res.data?.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400 text-xs animate-pulse">
        <BarChart3 className="w-6 h-6 animate-bounce mr-2 text-brand-primary" />
        Retrieving advanced progression analytics...
      </div>
    );
  }

  const {
    overallInterviewScore = 0,
    technicalScore = 0,
    hrScore = 0,
    communicationScore = 0,
    confidenceScore = 0,
    behaviorScore = 0,
    codingScore = 0,
    completedInterviewsCount = 0,
    topicDistribution = {},
    progressHistory = []
  } = stats || {};

  const radarData = Object.entries(topicDistribution).map(([topic, score]) => ({
    subject: topic,
    A: score,
    fullMark: 100
  })).slice(0, 7);

  const barData = [
    { name: 'Technical', score: technicalScore },
    { name: 'HR', score: hrScore },
    { name: 'Behavioral', score: behaviorScore },
    { name: 'Coding', score: codingScore }
  ];

  return (
    <div className="space-y-8 w-full">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5" />
          Analytics Console
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          System <span className="text-gradient">Performance Curves</span>
        </h1>
        <p className="text-xs text-slate-400">Deep-dive review of placement capabilities and subject command.</p>
      </div>

      {progressHistory.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timeline chart */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
              Performance Timeline Curve
            </h3>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressHistory}>
                  <defs>
                    <linearGradient id="curveColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-brand-primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0e1326', borderColor: '#1e294b', color: '#fff' }} />
                  <Area type="monotone" dataKey="score" stroke="var(--color-brand-primary)" strokeWidth={2.5} fill="url(#curveColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar chart of topics */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
              Subject Concepts Domain Fit
            </h3>
            <div className="h-64 w-full flex items-center justify-center pt-4">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" r="80%" data={radarData}>
                    <PolarGrid stroke="#1e294b" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={9} />
                    <Radar name="Candidate" dataKey="A" stroke="var(--color-brand-secondary)" fill="var(--color-brand-secondary)" fillOpacity={0.4} />
                    <Tooltip contentStyle={{ backgroundColor: '#0e1326', borderColor: '#1e294b', color: '#fff' }} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <span className="text-xs text-slate-500 italic">No topic details logged. Complete more questions.</span>
              )}
            </div>
          </div>

          {/* Bar Chart of categories */}
          <div className="glass-panel p-6 rounded-2xl space-y-4 lg:col-span-2">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
              Category Wise Scores
            </h3>
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0e1326', borderColor: '#1e294b', color: '#fff' }} />
                  <Bar dataKey="score" fill="var(--color-brand-accent)" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-2xl text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-3">
          <BarChart3 className="w-10 h-10 text-slate-600 animate-pulse" />
          <span>You have not completed any mock assessments yet. Analytics will unlock after completing a mock session.</span>
        </div>
      )}
    </div>
  );
}
