import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { useToast } from '../components/Toast';
import {
  Sparkles,
  Award,
  BookOpen,
  CheckCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';

export default function InterviewReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedQ, setExpandedQ] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/interview/report/${id}`);
        if (res.data?.success) {
          setReport(res.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load final report. Make sure the session has completed.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-400 text-xs animate-pulse">
        <Award className="w-6 h-6 animate-bounce mr-2 text-brand-primary" />
        Compiling report analytics and scoring metrics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-6 rounded-2xl max-w-md mx-auto text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-brand-warning mx-auto" />
        <h3 className="font-extrabold text-white text-base">Incomplete Session</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
        <button onClick={() => navigate('/mock-interviews')} className="px-5 py-2.5 bg-brand-primary rounded-xl text-xs font-bold text-white">
          Start New Simulation
        </button>
      </div>
    );
  }

  const {
    type,
    company,
    role,
    difficulty,
    date,
    duration,
    scores = {},
    feedbackSummary = '',
    weakAreas = [],
    strongAreas = [],
    recommendations = {},
    questions = []
  } = report;

  const passed = scores.overall >= 70;

  const handleDownloadTranscript = async () => {
    try {
      const response = await api.get(
        `/interview/${id}/transcript`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Interview_Transcript.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      showToast?.("Failed to download transcript.", "error");
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* 1. Header Banner */}
      <div className="relative rounded-2xl overflow-hidden glass-panel p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-brand-accent/5 to-transparent pointer-events-none" />
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            Session Results Card
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Interview <span className="text-gradient">Performance Summary</span>
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            Review your technical fluency ratings, weak concepts, and study roadmaps.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10 shrink-0">
          <button
            onClick={handleDownloadTranscript}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-brand-border hover:bg-white/10 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Transcript
          </button>
          {passed && (
            <Link
              to="/mock-interviews/certificates"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold text-xs transition-all flex items-center gap-2 shadow-lg hover:shadow-brand-primary/20 cursor-pointer"
            >
              <Award className="w-4 h-4 fill-white" />
              Claim Certificate
            </Link>
          )}
        </div>
      </div>

      {/* 2. Score Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ring score */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 border-brand-border/40">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Overall Interview Score</span>

          <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="48" stroke="#1e294b" strokeWidth="6" fill="transparent" />
              <circle
                cx="56" cy="56" r="48"
                stroke={passed ? "var(--color-brand-success)" : "var(--color-brand-primary)"} strokeWidth="6" fill="transparent"
                strokeDasharray={301.6}
                strokeDashoffset={301.6 - (301.6 * scores.overall) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">{scores.overall}%</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase">{passed ? 'Passed' : 'Needs Practice'}</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed max-w-xs pt-2">
            {feedbackSummary}
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 md:col-span-2 justify-between flex flex-col border-brand-border/40">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
            Hiring Categories Breakdown
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-300">
                <span>Technical Score</span>
                <span>{scores.technical}%</span>
              </div>
              <div className="w-full bg-brand-dark rounded-full h-2 overflow-hidden border border-brand-border">
                <div className="bg-brand-primary h-full" style={{ width: `${scores.technical}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-300">
                <span>HR & Alignment</span>
                <span>{scores.hr}%</span>
              </div>
              <div className="w-full bg-brand-dark rounded-full h-2 overflow-hidden border border-brand-border">
                <div className="bg-brand-secondary h-full" style={{ width: `${scores.hr}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-300">
                <span>Communication Fluency</span>
                <span>{scores.communication}%</span>
              </div>
              <div className="w-full bg-brand-dark rounded-full h-2 overflow-hidden border border-brand-border">
                <div className="bg-brand-success h-full" style={{ width: `${scores.communication}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-300">
                <span>Speech Confidence</span>
                <span>{scores.confidence}%</span>
              </div>
              <div className="w-full bg-brand-dark rounded-full h-2 overflow-hidden border border-brand-border">
                <div className="bg-brand-accent h-full" style={{ width: `${scores.confidence}%` }} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 border-t border-brand-border/45 pt-3.5 mt-2.5">
            <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date: {new Date(date).toLocaleDateString()}</div>
            <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Duration: {Math.round(duration / 60)} mins</div>
            <div className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Mode: {difficulty} ({type})</div>
          </div>
        </div>
      </div>

      {/* 2.5 AI Proctoring Integrity Report */}
      {report.integrity && (
        <div className="glass-panel p-6 md:p-8 rounded-2xl border-brand-border/40 space-y-6 bg-brand-card/15">
          <div className="flex items-center gap-3 border-b border-brand-border/40 pb-4">
            <div className="p-2.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
              <span className="w-5 h-5 block text-center font-black">🛡</span>
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                AI Proctoring & Integrity Audit
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">Continuous webcam tracking, eye gaze movement, window focus, and prohibited device scanning.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Integrity Gauge & Diagnostics */}
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Integrity Score</span>
              <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="#1e294b" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="56" cy="56" r="48"
                    stroke={report.integrity.integrityScore >= 85 ? "#10b981" : report.integrity.integrityScore >= 70 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="6" fill="transparent"
                    strokeDasharray={301.6}
                    strokeDashoffset={301.6 - (301.6 * report.integrity.integrityScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{report.integrity.integrityScore}%</span>
                  <span className={`text-[9px] font-black uppercase ${
                    report.integrity.integrityScore >= 85 ? 'text-brand-success' : report.integrity.integrityScore >= 70 ? 'text-brand-warning' : 'text-brand-error'
                  }`}>
                    {report.integrity.integrityScore >= 85 ? 'Excellent' : report.integrity.integrityScore >= 70 ? 'Suspicious' : 'Failed Audit'}
                  </span>
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">
                Status: <span className={`font-black ${report.integrity.status === 'terminated' ? 'text-brand-error' : 'text-brand-success'}`}>{report.integrity.status}</span>
              </div>

              {/* Telemetry Diagnostics */}
              {report.integrity.sessionHealth && (
                <div className="pt-2.5 border-t border-brand-border/40 w-full text-[10px] text-slate-400 space-y-1 text-left font-semibold">
                  <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-black mb-1">Telemetry Diagnostics</span>
                  <div className="flex justify-between"><span>Avg FPS:</span><span className="text-white">{report.integrity.sessionHealth.averageFps || '15'}</span></div>
                  <div className="flex justify-between"><span>AI Latency:</span><span className="text-white">{report.integrity.sessionHealth.aiInferenceTimeMs || '10'}ms</span></div>
                  <div className="flex justify-between"><span>Dropped Frames:</span><span className="text-white">{report.integrity.sessionHealth.droppedFramesCount || '0'}</span></div>
                  <div className="flex justify-between"><span>Camera:</span><span className="text-white truncate max-w-[90px]">{report.integrity.sessionHealth.cameraResolution || '320x240'}</span></div>
                </div>
              )}
            </div>

            {/* Event metrics summary (Expanded Integrity Dashboard) */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-white uppercase tracking-wider">Audit Statistics Dashboard</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/2 border border-brand-border/40 rounded-xl">
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Total Warnings</span>
                  <span className="text-sm font-black text-white">{report.integrity.warnings}</span>
                </div>
                <div className="p-3 bg-white/2 border border-brand-border/40 rounded-xl">
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Looking Away</span>
                  <span className="text-sm font-black text-white">
                    {report.integrity.eyeMovementEvents ? report.integrity.eyeMovementEvents.reduce((acc, curr) => acc + (curr.duration || 5), 0) : 0}s
                  </span>
                </div>
                <div className="p-3 bg-white/2 border border-brand-border/40 rounded-xl">
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Phone Signals</span>
                  <span className="text-sm font-black text-white">
                    {report.integrity.violations.filter(v => v.type === 'phone_detected').length}
                  </span>
                </div>
                <div className="p-3 bg-white/2 border border-brand-border/40 rounded-xl">
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Multiple Faces</span>
                  <span className="text-sm font-black text-white">
                    {report.integrity.violations.filter(v => v.type === 'multiple_faces').length}
                  </span>
                </div>
                <div className="p-3 bg-white/2 border border-brand-border/40 rounded-xl col-span-2">
                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Max Severity Flag</span>
                  <span className="text-[10px] font-black text-brand-error truncate block">
                    {(() => {
                      const types = report.integrity.violations.map(v => v.type);
                      if (types.includes('webcam_disabled') || types.includes('mic_disabled')) return 'CRITICAL (Media Disconnect)';
                      if (types.includes('phone_detected')) return 'HIGH (Prohibited Device)';
                      if (types.includes('multiple_faces')) return 'HIGH (Multiple Faces)';
                      if (types.includes('fullscreen_exit')) return 'HIGH (Fullscreen Exit)';
                      if (types.length > 0) return 'LOW (Gaze Deviation)';
                      return 'NONE';
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning timeline */}
            <div className="space-y-4 w-full">
              <h4 className="text-[10px] font-black text-white uppercase tracking-wider">Warnings Timeline</h4>
              <div className="max-h-48 overflow-y-auto space-y-2.5 pr-2.5 w-full">
                {report.integrity.timeline && report.integrity.timeline.length > 0 ? (
                  report.integrity.timeline.map((evt, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-[10px] leading-relaxed">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${evt.type === 'warning' ? 'bg-brand-error animate-ping' : 'bg-slate-500'}`} />
                      <div className="flex-1 min-w-0">
                        <span className="text-slate-500 font-mono font-bold block">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                        <p className={`truncate max-w-[200px] ${evt.type === 'warning' ? 'text-brand-error font-semibold' : 'text-slate-400 font-medium'}`}>
                          {evt.message}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No warning events logged in this session.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2.6 AI Proctoring Recorded Evidence Clips */}
      {report.integrity && report.integrity.evidenceClips && report.integrity.evidenceClips.length > 0 && (
        <div className="glass-panel p-6 md:p-8 rounded-2xl border-brand-border/40 space-y-6 bg-brand-card/15">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-error/10 border border-brand-error/20 text-brand-error">
                <span className="w-5 h-5 block text-center font-black">📹</span>
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider">
                  Recorded Video Evidence Clips
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">Incident-triggered video clips capturing user and device anomalies.</p>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5 bg-brand-dark/60 p-1 rounded-xl border border-brand-border/40">
              {[
                { id: 'all', label: 'All Clips' },
                { id: 'phone', label: 'Phones' },
                { id: 'gaze', label: 'Gaze Shifts' },
                { id: 'face', label: 'Multiple Faces' },
                { id: 'media', label: 'Media Disconnects' },
                { id: 'fullscreen', label: 'Fullscreen Exit' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    filterType === f.id
                      ? 'bg-brand-primary text-white border border-brand-primary'
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {report.integrity.evidenceClips
              .filter(clip => {
                if (filterType === 'all') return true;
                if (filterType === 'phone') return clip.violationType === 'phone_detected';
                if (filterType === 'gaze') return ['looking_left', 'looking_right', 'looking_down', 'eye_looking_away'].includes(clip.violationType);
                if (filterType === 'face') return clip.violationType === 'multiple_faces';
                if (filterType === 'media') return ['webcam_disabled', 'mic_disabled'].includes(clip.violationType);
                if (filterType === 'fullscreen') return clip.violationType === 'fullscreen_exit';
                return true;
              })
              .map((clip, idx) => {
                const videoUrl = clip.videoPath.startsWith('http') 
                  ? clip.videoPath 
                  : `http://localhost:5000${clip.videoPath}`;

                const thumbnailUrl = clip.thumbnailPath 
                  ? (clip.thumbnailPath.startsWith('http') ? clip.thumbnailPath : `http://localhost:5000${clip.thumbnailPath}`)
                  : '';
                
                return (
                  <div key={idx} className="p-4 rounded-xl bg-white/2 border border-brand-border/40 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-wider text-slate-400">
                        <span className="text-brand-error">{clip.violationType.replace('_', ' ')}</span>
                        <span>{new Date(clip.timestamp).toLocaleTimeString()}</span>
                      </div>
                      {/* Video Player with Snapshot Poster */}
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-brand-dark/95 border border-brand-border">
                        <video
                          src={videoUrl}
                          poster={thumbnailUrl}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-400">
                        <div>
                          <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-black">Duration</span>
                          <span className="text-white font-bold">{clip.duration} seconds</span>
                        </div>
                        <div>
                          <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-black">Confidence</span>
                          <span className="text-brand-success font-black">{clip.confidence}%</span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-black">Sensor Model</span>
                          <span className="text-slate-300 font-semibold">{clip.modelUsed} (v{clip.modelVersion})</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white/3 border border-brand-border/45 rounded-lg text-[10px]">
                        <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-black mb-1">Reviewer Notes</span>
                        {clip.reviewNotes ? (
                          <p className="text-slate-300 italic">"{clip.reviewNotes}"</p>
                        ) : (
                          <span className="text-slate-500 italic">No notes logged yet.</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 3. Strengths, Weaknesses and Study Recommendation Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Concepts panel */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 h-fit">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
            Concepts Analysis
          </h3>
          <div className="space-y-4">
            {/* Weak Areas */}
            <div className="space-y-2">
              <span className="text-[10px] text-brand-error font-black uppercase tracking-wider block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Focus Areas (Weak)
              </span>
              <ul className="space-y-2">
                {weakAreas.length > 0 ? (
                  weakAreas.map((topic, i) => (
                    <li key={i} className="text-xs text-slate-400 bg-brand-error/5 border border-brand-error/10 p-2.5 rounded-xl">
                      {topic}
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-500 italic">None identified in this session.</li>
                )}
              </ul>
            </div>

            {/* Strong Areas */}
            <div className="space-y-2">
              <span className="text-[10px] text-brand-success font-black uppercase tracking-wider block flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Demonstrated Strengths
              </span>
              <ul className="space-y-2">
                {strongAreas.length > 0 ? (
                  strongAreas.map((topic, i) => (
                    <li key={i} className="text-xs text-slate-400 bg-brand-success/5 border border-brand-success/10 p-2.5 rounded-xl">
                      {topic}
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-500 italic">None identified in this session.</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Study Recommendations */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
            Personalized Learning Materials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Courses and books */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-black text-brand-secondary flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-4 h-4" /> Recommended Courses
                </h4>
                <ul className="space-y-1.5">
                  {recommendations.courses && recommendations.courses.length > 0 ? (
                    recommendations.courses.map((c, i) => (
                      <li key={i} className="text-xs text-slate-300 hover:text-white transition-colors">
                        <a href={c.link} target="_blank" rel="noopener noreferrer" className="underline">{c.name}</a> ({c.type})
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-500 italic">Generic learning courses suggested.</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-black text-brand-secondary flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-4 h-4" /> Recommended Books
                </h4>
                <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
                  {recommendations.books && recommendations.books.length > 0 ? (
                    recommendations.books.map((b, i) => <li key={i}>{b}</li>)
                  ) : (
                    <li className="text-xs text-slate-500 italic">Cracking the Coding Interview</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Video lectures & revision timeline */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-black text-brand-accent flex items-center gap-1.5 mb-2">
                  <FileText className="w-4 h-4" /> YouTube Video Playlists
                </h4>
                <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
                  {recommendations.videos && recommendations.videos.length > 0 ? (
                    recommendations.videos.map((v, i) => <li key={i}>{v}</li>)
                  ) : (
                    <li className="text-xs text-slate-500 italic">NeetCode System Design channel</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-black text-brand-accent flex items-center gap-1.5 mb-2">
                  <Layers className="w-4 h-4" /> Coding Practice Tasks
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {recommendations.codingPractice && recommendations.codingPractice.length > 0
                    ? recommendations.codingPractice[0]
                    : 'Practice solving DSA exercises.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Revision timeline */}
          {recommendations.revisionPlan && recommendations.revisionPlan.length > 0 && (
            <div className="p-4 bg-white/2 border border-brand-border/40 rounded-xl space-y-3">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Custom Study Revision Schedule</h4>
              <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-brand-border/60">
                {recommendations.revisionPlan.map((step, i) => (
                  <div key={i} className="relative pl-6 space-y-1">
                    <div className="absolute left-[5px] top-[6px] w-[7px] h-[7px] rounded-full bg-brand-primary border border-brand-dark" />
                    <span className="text-[10px] text-brand-secondary font-black">Day {step.day}: {step.topic}</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{step.task}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Question details list breakdown */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
          Question Level Evaluation Details
        </h3>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const isExpanded = expandedQ === idx;
            return (
              <div key={idx} className="border border-brand-border/50 rounded-xl overflow-hidden bg-white/2 transition-all">
                {/* Header toggle button */}
                <button
                  onClick={() => setExpandedQ(isExpanded ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="space-y-1.5 flex-1 pr-6">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                      <span>Question {idx + 1}</span>
                      <span>&bull;</span>
                      <span className="text-brand-secondary">{q.category}</span>
                      <span>&bull;</span>
                      <span className={`px-2 py-0.5 rounded ${q.feedbackScore >= 70 ? 'bg-brand-success/15 text-brand-success' : 'bg-brand-warning/15 text-brand-warning'}`}>
                        Score: {q.feedbackScore}%
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white leading-relaxed">{q.questionText}</p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                {/* Expanded details body */}
                {isExpanded && (
                  <div className="p-4 border-t border-brand-border/50 space-y-4 text-xs bg-brand-dark/40">
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Submitted Answer</span>
                      <p className="p-3 bg-brand-card border border-brand-border rounded-xl font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                        {q.userAnswer}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Evaluation explanation</span>
                      <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                    </div>

                    {q.suggestions && q.suggestions.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-brand-warning uppercase font-black tracking-wider block">Sub-metric recommendations</span>
                        <ul className="list-disc list-inside text-slate-400 space-y-1">
                          {q.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
