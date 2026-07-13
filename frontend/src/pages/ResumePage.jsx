import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { useToast } from '../components/Toast';
import PdfPreview from '../components/PdfPreview';
import ResumeCompare from '../components/ResumeCompare';
import {
  FileText,
  UploadCloud,
  Trash2,
  RefreshCw,
  Eye,
  FileCheck,
  AlertTriangle,
  Loader,
  Calendar,
  Layers,
  Cpu,
  User,
  GraduationCap,
  Code,
  Briefcase,
  Award,
  Globe,
  Github,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  Bookmark,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Terminal,
  Activity,
  Heart,
  Target,
  FileWarning,
  TrendingUp,
  BookmarkCheck,
  Plus,
  Save,
  Building
} from 'lucide-react';

export default function ResumePage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' | 'parser' | 'analyst'
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  const getHealthBadgeStyles = (health) => {
    switch (health) {
      case 'Excellent':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'Good':
        return 'bg-teal-500/10 border-teal-500/30 text-teal-400';
      case 'Average':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'Needs Improvement':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      case 'Poor':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      default:
        return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
    }
  };

  const getHealthBadgeStars = (health) => {
    switch (health) {
      case 'Excellent':
        return '★★★★★ Excellent';
      case 'Good':
        return '★★★★☆ Good';
      case 'Average':
        return '★★★☆☆ Average';
      case 'Needs Improvement':
        return '★★☆☆☆ Needs Improvement';
      case 'Poor':
        return '★☆☆☆☆ Poor';
      default:
        return '★★★☆☆ Average';
    }
  };
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Advanced features
  const [devMode, setDevMode] = useState(false);
  const [parsingStep, setParsingStep] = useState(0);

  // Job Description Module states
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [selectedJdId, setSelectedJdId] = useState('');
  const [isCreatingJd, setIsCreatingJd] = useState(false);
  const [editingJdText, setEditingJdText] = useState('');

  // Create JD Form
  const [newJdTitle, setNewJdTitle] = useState('');
  const [newJdCompany, setNewJdCompany] = useState('');
  const [newJdRole, setNewJdRole] = useState('');
  const [newJdText, setNewJdText] = useState('');

  // Fetch resume metadata on mount
  const fetchResume = async () => {
    try {
      const response = await api.get('/resume');
      if (response.data?.success) {
        setResume(response.data.data.resumeMetadata);
      }
    } catch (err) {
      if (err.status !== 404) {
        console.error('Error fetching resume metadata:', err);
      }
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved Job Descriptions
  const fetchJds = async () => {
    try {
      const response = await api.get('/job-descriptions');
      if (response.data?.success) {
        const jds = response.data.data.jobDescriptions;
        setJobDescriptions(jds);
        if (jds.length > 0 && !selectedJdId) {
          setSelectedJdId(jds[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching job descriptions:', err);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  // Fetch JDs when moving to Analyst Tab
  useEffect(() => {
    if (activeTab === 'analyst') {
      fetchJds();
    }
  }, [activeTab]);

  // Synchronize editing text when selected JD changes
  const selectedJd = jobDescriptions.find(j => j._id === selectedJdId);
  useEffect(() => {
    if (selectedJd) {
      setEditingJdText(selectedJd.jobDescriptionText || '');
    } else {
      setEditingJdText('');
    }
  }, [selectedJdId, jobDescriptions]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    if (!file) return false;
    if (file.type !== 'application/pdf') {
      showToast('Invalid file format. Only PDF resumes are accepted.', 'error');
      return false;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast('File size exceeds the 5 MB limit.', 'error');
      return false;
    }
    return true;
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        await uploadFile(file);
      }
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        await uploadFile(file);
      }
    }
  };

  const uploadFile = async (file, force = false) => {
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('resume', file);

    // Pass force reanalyze query param if requested
    const url = resume ? `/resume/replace${force ? '?forceReanalyze=true' : ''}` : `/resume/upload${force ? '?forceReanalyze=true' : ''}`;
    const method = resume ? 'put' : 'post';

    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await api({
        method,
        url,
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (response.data?.success) {
        if (response.data.duplicate) {
          if (window.confirm("This resume is identical to your latest uploaded version. Do you want to analyze it again?")) {
            // Re-upload with forceReanalyze set to true
            uploadFile(file, true);
          } else {
            setResume(response.data.data.resumeMetadata);
          }
        } else {
          showToast(resume ? 'Resume replaced successfully!' : 'Resume uploaded successfully!', 'success');
          setResume(response.data.data.resumeMetadata);
        }
      }
    } catch (err) {
      showToast(err.message || 'File upload failed.', 'error');
    } finally {
      setTimeout(() => {
        setUploading(false);
      }, 500);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your uploaded resume? This action is permanent.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.delete('/resume');
      if (response.data?.success) {
        showToast('Resume deleted successfully.', 'success');
        setResume(null);
        setActiveTab('manage');
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete resume.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Resume Parsing service API
  const handleParse = async () => {
    setParsing(true);
    setParsingStep(1);

    const interval = setInterval(() => {
      setParsingStep(prev => {
        if (prev < 4) return prev + 1;
        clearInterval(interval);
        return 4;
      });
    }, 600);

    try {
      const response = await api.post('/resume/parse');
      clearInterval(interval);
      setParsingStep(5);

      if (response.data?.success) {
        showToast('Resume parsed successfully!', 'success');
        setResume(response.data.data.resumeMetadata);
      }
    } catch (err) {
      clearInterval(interval);
      setParsingStep(0);
      showToast(err.message || 'Parsing failed.', 'error');
      await fetchResume();
    } finally {
      setParsing(false);
    }
  };

  // Create a new Job Description
  const handleCreateJd = async (e) => {
    e.preventDefault();
    if (!newJdTitle || !newJdCompany || !newJdText) {
      showToast('Title, Company, and Job Description Text are required.', 'error');
      return;
    }

    try {
      const response = await api.post('/job-descriptions', {
        title: newJdTitle,
        company: newJdCompany,
        jobRole: newJdRole || newJdTitle,
        jobDescriptionText: newJdText
      });

      if (response.data?.success) {
        showToast('Job Description added successfully!', 'success');
        const jd = response.data.data.jobDescription;
        setJobDescriptions(prev => [jd, ...prev]);
        setSelectedJdId(jd._id);
        setIsCreatingJd(false);
        setNewJdTitle('');
        setNewJdCompany('');
        setNewJdRole('');
        setNewJdText('');
      }
    } catch (err) {
      showToast(err.message || 'Failed to add Job Description.', 'error');
    }
  };

  // Trigger Gemini AI Resume Analysis API against selected JD
  const handleAnalyze = async () => {
    if (!selectedJdId) {
      showToast('Please select or create a Target Job Description first.', 'error');
      return;
    }

    setAnalyzing(true);
    try {
      // Auto-save changes first if JD description changed in textarea
      if (selectedJd && editingJdText.trim() !== selectedJd.jobDescriptionText.trim()) {
        await api.put(`/job-descriptions/${selectedJdId}`, {
          jobDescriptionText: editingJdText
        });
      }

      const response = await api.post('/resume/analyze', { jobDescriptionId: selectedJdId });
      if (response.data?.success) {
        showToast(response.data.data.cached ? 'Loaded cached analysis results!' : 'Gemini Resume Analysis completed!', 'success');
        await fetchResume();
        await fetchJds();
      }
    } catch (err) {
      showToast(err.message || 'AI Analysis failed.', 'error');
      await fetchResume();
      await fetchJds();
    } finally {
      setAnalyzing(false);
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Render color coded status badge for parsing state
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Parsing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            Parsing...
          </span>
        );
      case 'Parsed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-success/15 border border-brand-success/35 text-brand-success text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            Parsed
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-error/15 border border-brand-error/35 text-brand-error text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-secondary/15 border border-brand-secondary/35 text-brand-secondary text-xs font-semibold">
            <Bookmark className="w-3.5 h-3.5" />
            Uploaded
          </span>
        );
    }
  };

  // Render color coded status badge for AI analysis state
  const renderAiBadge = (status) => {
    switch (status) {
      case 'Analyzing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold animate-pulse">
            <Loader className="w-3.5 h-3.5 animate-spin" />
            Analyzing...
          </span>
        );
      case 'Analyzed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-success/15 border border-brand-success/35 text-brand-success text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-success" />
            Analyzed
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-error/15 border border-brand-error/35 text-brand-error text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            Analysis Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/15 border border-slate-500/35 text-slate-400 text-xs font-semibold">
            <Bookmark className="w-3.5 h-3.5" />
            Idle
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] animate-pulse">
        <Loader className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  const serverBaseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api/v1', '') : 'http://localhost:5000';
  const fileUrl = resume ? `${serverBaseUrl}${resume.storagePath}` : '';

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto">

      {/* Header section with tab switches */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-brand-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Resume Management</h1>
          <p className="text-xs text-slate-400">Upload, parse, and audit your credentials using our structured engine.</p>
        </div>

        {/* Tab switch buttons */}
        {resume && (
          <div className="flex gap-1.5 p-1 bg-[#090d16] border border-brand-border/60 rounded-xl">
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'manage'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              Manage Resume
            </button>
            <button
              onClick={() => setActiveTab('parser')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'parser'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              Parser Console
            </button>
            <button
              onClick={() => setActiveTab('analyst')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'analyst'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              AI Analyst
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Tab 1: Manage Resume */}
        {activeTab === 'manage' && (
          <motion.div
            key="manage"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
          >
            {/* Left Upload Drag & Drop Area */}
            <div className="md:col-span-2 space-y-6">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`glass-panel p-8 rounded-2xl border-2 border-dashed text-center flex flex-col items-center justify-center min-h-[260px] relative transition-all duration-300 ${dragActive
                    ? 'border-brand-primary bg-brand-primary/5 scale-[1.01]'
                    : 'border-brand-border/80 hover:border-brand-primary/40'
                  }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {uploading ? (
                  <div className="space-y-4 w-full max-w-xs">
                    <Loader className="w-10 h-10 text-brand-primary animate-spin mx-auto" />
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-300">Uploading your PDF resume...</p>
                      <div className="w-full bg-brand-dark/60 rounded-full h-2 overflow-hidden border border-brand-border">
                        <div
                          className="bg-brand-primary h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold">{uploadProgress}% uploaded</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-full inline-block">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <div>
                      <label htmlFor="file-upload" className="text-sm font-bold text-white cursor-pointer hover:text-brand-primary transition-colors">
                        Click to browse
                      </label>
                      <span className="text-xs text-slate-400"> or drag and drop your file here</span>
                      <p className="text-[10px] text-slate-500 mt-2 font-medium">Supports PDF only (Maximum 5 MB)</p>
                    </div>
                  </div>
                )}
              </div>

              {resume && (
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-brand-primary" />
                    Resume Preview (No Download Required)
                  </h3>
                  <PdfPreview fileUrl={fileUrl} />
                </div>
              )}
            </div>

            {/* Right Status Card */}
            <div className="space-y-6">
              {resume ? (
                <div className="glass-panel p-6 rounded-2xl space-y-5 border-brand-primary/20">
                  <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Console</span>
                    {renderStatusBadge(resume.status)}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-success/15 border border-brand-success/20 text-brand-success rounded-xl shrink-0">
                      <FileCheck className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-black text-white truncate" title={resume.originalFileName}>
                        {resume.originalFileName}
                      </h3>
                      <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Version: {resume.version}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300 border-t border-brand-border/40 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Size:</span>
                      <span className="font-medium text-white">{formatBytes(resume.fileSize)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Uploaded:</span>
                      <span className="font-medium text-white">{new Date(resume.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Confidence:</span>
                      <span className="font-medium text-white">{resume.parsingConfidence}%</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2.5">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      View PDF
                    </a>

                    <div className="grid grid-cols-2 gap-2.5">
                      <label
                        htmlFor="file-upload"
                        className="py-2.5 bg-white/5 border border-brand-border hover:bg-white/10 text-white rounded-xl text-xs font-bold text-center cursor-pointer transition-all flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Replace
                      </label>
                      <button
                        onClick={handleDelete}
                        className="py-2.5 bg-brand-error/10 border border-brand-error/25 hover:bg-brand-error/20 text-brand-error rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-6 rounded-2xl space-y-4 text-center">
                  <div className="p-4 bg-brand-error/10 border border-brand-error/20 text-brand-error rounded-full inline-block">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-white">No Resume Uploaded</h3>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                      Upload your profile resume now to enable resume parsing audits.
                    </p>
                  </div>
                  <label
                    htmlFor="file-upload"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold hover:brightness-110 active:scale-98 transition-all cursor-pointer"
                  >
                    Upload Now
                  </label>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 2: Parser Console */}
        {activeTab === 'parser' && resume && (
          <motion.div
            key="parser"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Parser execution card with developer toggle */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-brand-secondary/5 to-transparent pointer-events-none" />

              <div className="flex items-center gap-4.5 min-w-0 flex-1">
                <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-2xl shrink-0">
                  <Cpu className="w-7 h-7" />
                </div>
                <div className="space-y-1 text-center md:text-left min-w-0">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                    <h3 className="text-sm font-extrabold text-white">Modular Parsing Engine</h3>
                    {renderStatusBadge(resume.status)}
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-brand-dark border border-brand-border text-slate-400">
                      v{resume.parserVersion || '1.0.0'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    Deconstructs unstructured PDF text stream profiles and extracts structured categories (Personal contacts, Skills, Education history, Projects) without using AI models.
                  </p>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3">
                <button
                  onClick={handleParse}
                  disabled={parsing}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-brand-primary hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {parsing ? (
                    <>
                      <Loader className="w-4.5 h-4.5 animate-spin" />
                      <span>Parsing PDF...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4.5 h-4.5" />
                      <span>Run Parsing Engine</span>
                    </>
                  )}
                </button>

                {resume.status === 'Parsed' && (
                  <button
                    onClick={() => setDevMode(!devMode)}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 border rounded-xl text-[10px] font-bold transition-all cursor-pointer ${devMode
                        ? 'bg-brand-secondary/20 border-brand-secondary text-brand-secondary'
                        : 'bg-white/5 border-brand-border text-slate-400 hover:text-slate-200'
                      }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    {devMode ? 'Hide Developer Log' : 'Show Developer Log'}
                  </button>
                )}
              </div>
            </div>

            {/* Parsing State Display views */}
            {parsing ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Loader animation card */}
                <div className="lg:col-span-2 glass-panel p-8 rounded-2xl text-center space-y-4 min-h-[340px] flex flex-col items-center justify-center">
                  <Loader className="w-10 h-10 text-brand-primary animate-spin mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Parsing Document...</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Running SHA-256 validation checks, mapping paragraph chunks, and executing regex boundary analyzers...
                    </p>
                  </div>
                </div>

                {/* Parsing steps timeline */}
                <div className="glass-panel p-6 rounded-2xl space-y-5">
                  <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                    <Activity className="w-4.5 h-4.5 text-brand-primary" />
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Pipeline Steps</h3>
                  </div>

                  <div className="space-y-4.5 text-xs relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-brand-border">
                    {(resume?.processingSteps && resume.processingSteps.length > 0 ? resume.processingSteps : [
                      { step: 'Uploading', status: 'Completed' },
                      { step: 'Parsing', status: 'In Progress' },
                      { step: 'Extracting Skills', status: 'Pending' },
                      { step: 'Calculating ATS', status: 'Pending' },
                      { step: 'Running AI Analysis', status: 'Pending' },
                      { step: 'Saving Results', status: 'Pending' }
                    ]).map((s, index) => {
                      const isCompleted = s.status === 'Completed';
                      const isInProgress = s.status === 'In Progress';
                      const isFailed = s.status === 'Failed';

                      let colorClass = 'text-slate-500';
                      if (isCompleted || isInProgress) colorClass = 'text-white';
                      if (isFailed) colorClass = 'text-brand-error';

                      return (
                        <div key={index} className={`relative pl-6 flex items-center justify-between ${colorClass}`}>
                          <div className={`absolute left-[4.5px] w-2 h-2 rounded-full ${isCompleted ? 'bg-brand-success' : isInProgress ? 'bg-brand-primary animate-pulse' : isFailed ? 'bg-brand-error' : 'bg-slate-700'
                            }`} />
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{s.step}</span>
                            {isCompleted && s.duration > 0 && (
                              <span className="text-[10px] text-slate-500 font-medium">({s.duration}ms)</span>
                            )}
                          </div>
                          {isCompleted && <CheckCircle className="w-4 h-4 text-brand-success shrink-0" />}
                          {isInProgress && <Loader className="w-4 h-4 text-brand-primary animate-spin shrink-0" />}
                          {isFailed && <XCircle className="w-4 h-4 text-brand-error shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : resume.status === 'Parsed' && resume.parsedData ? (
              <div className="space-y-6">

                {/* Developer Mode Raw Text View */}
                {devMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass-panel p-6 rounded-2xl space-y-4 border-brand-secondary/30"
                  >
                    <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4.5 h-4.5 text-brand-secondary" />
                        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Raw Extracted Text</h3>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-brand-dark border border-brand-border text-slate-400">
                        Developer Mode
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      {resume.parsingLogs && (
                        <div className="grid grid-cols-3 gap-4 p-3 bg-brand-dark/40 border border-brand-border/60 rounded-xl text-[10px] text-slate-400">
                          <span>Started: {new Date(resume.parsingLogs.startedAt).toLocaleTimeString()}</span>
                          <span>Completed: {new Date(resume.parsingLogs.completedAt).toLocaleTimeString()}</span>
                          <span>Duration: {resume.parsingLogs.duration} ms</span>
                        </div>
                      )}

                      <pre className="whitespace-pre-wrap font-mono text-[10px] text-slate-300 bg-brand-dark/80 p-4 rounded-xl max-h-[300px] overflow-y-auto border border-brand-border/80">
                        {resume.rawText || 'No text extracted.'}
                      </pre>
                    </div>
                  </motion.div>
                )}

                {/* Structured JSON Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                  {/* Left Column */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Personal Card */}
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                        <User className="w-4.5 h-4.5 text-brand-primary" />
                        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Contact Information</h3>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase block">Parsed Candidate Name</span>
                          <p className="font-semibold text-slate-200">{resume.parsedData.personalInformation?.name || 'Not detected'}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase block">Email Address</span>
                          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{resume.parsedData.personalInformation?.email || 'Not detected'}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase block">Phone Number</span>
                          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{resume.parsedData.personalInformation?.phone || 'Not detected'}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase block">Parsed Address</span>
                          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{resume.parsedData.personalInformation?.address || 'Not detected'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Links Card */}
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                        <Globe className="w-4.5 h-4.5 text-brand-primary" />
                        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Links & Repositories</h3>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase block">GitHub</span>
                          {resume.parsedData.links?.github ? (
                            <a href={resume.parsedData.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-brand-primary hover:underline font-semibold">
                              <Github className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                              <span className="truncate">GitHub Profile</span>
                            </a>
                          ) : <span className="text-slate-500 italic">Not detected</span>}
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase block">LinkedIn</span>
                          {resume.parsedData.links?.linkedin ? (
                            <a href={resume.parsedData.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-brand-primary hover:underline font-semibold">
                              <Linkedin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                              <span className="truncate">LinkedIn Profile</span>
                            </a>
                          ) : <span className="text-slate-500 italic">Not detected</span>}
                        </div>

                        <div className="space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase block">Portfolio / Website</span>
                          {resume.parsedData.links?.portfolio ? (
                            <a href={resume.parsedData.links.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-brand-primary hover:underline font-semibold">
                              <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                              <span className="truncate">Portfolio Link</span>
                            </a>
                          ) : <span className="text-slate-500 italic">Not detected</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Columns */}
                  <div className="lg:col-span-2 space-y-6">

                    {/* Skills Tags Card */}
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                        <Code className="w-4.5 h-4.5 text-brand-primary" />
                        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Skills Directory</h3>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {resume.parsedData.skills?.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold rounded-full">
                            {skill}
                          </span>
                        ))}
                        {(!resume.parsedData.skills || resume.parsedData.skills.length === 0) && (
                          <span className="text-xs text-slate-500 italic">No skills keywords identified.</span>
                        )}
                      </div>
                    </div>

                    {/* Education Card */}
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                        <GraduationCap className="w-4.5 h-4.5 text-brand-primary" />
                        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Education Records</h3>
                      </div>

                      <ul className="space-y-3.5 list-none pt-1">
                        {resume.parsedData.education?.map((edu, index) => (
                          <li key={index} className="text-xs text-slate-300 leading-relaxed border-l-2 border-brand-border/80 pl-3">
                            {edu}
                          </li>
                        ))}
                        {(!resume.parsedData.education || resume.parsedData.education.length === 0) && (
                          <span className="text-xs text-slate-500 italic">No education details identified.</span>
                        )}
                      </ul>
                    </div>

                    {/* Projects Card */}
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                        <Layers className="w-4.5 h-4.5 text-brand-primary" />
                        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Projects Summary</h3>
                      </div>

                      <ul className="space-y-3.5 list-none pt-1">
                        {resume.parsedData.projects?.map((proj, index) => (
                          <li key={index} className="text-xs text-slate-300 leading-relaxed border-l-2 border-brand-border/80 pl-3">
                            {proj}
                          </li>
                        ))}
                        {(!resume.parsedData.projects || resume.parsedData.projects.length === 0) && (
                          <span className="text-xs text-slate-500 italic">No project details identified.</span>
                        )}
                      </ul>
                    </div>

                    {/* Experience Card */}
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                        <Briefcase className="w-4.5 h-4.5 text-brand-primary" />
                        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Professional Experience</h3>
                      </div>

                      <ul className="space-y-3.5 list-none pt-1">
                        {resume.parsedData.experience?.map((exp, index) => (
                          <li key={index} className="text-xs text-slate-300 leading-relaxed border-l-2 border-brand-border/80 pl-3">
                            {exp}
                          </li>
                        ))}
                        {(!resume.parsedData.experience || resume.parsedData.experience.length === 0) && (
                          <span className="text-xs text-slate-500 italic">No professional experience identified.</span>
                        )}
                      </ul>
                    </div>

                    {/* Certificates Card */}
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                        <Award className="w-4.5 h-4.5 text-brand-primary" />
                        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Certifications & Courses</h3>
                      </div>

                      <ul className="space-y-3.5 list-none pt-1">
                        {resume.parsedData.certifications?.map((cert, index) => (
                          <li key={index} className="text-xs text-slate-300 leading-relaxed border-l-2 border-brand-border/80 pl-3">
                            {cert}
                          </li>
                        ))}
                        {(!resume.parsedData.certifications || resume.parsedData.certifications.length === 0) && (
                          <span className="text-xs text-slate-500 italic">No certification details identified.</span>
                        )}
                      </ul>
                    </div>

                    {/* Languages Card */}
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                        <Globe className="w-4.5 h-4.5 text-brand-primary" />
                        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Languages</h3>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {resume.parsedData.languages?.map((lang, index) => (
                          <span key={index} className="px-3 py-1 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-semibold rounded-full">
                            {lang}
                          </span>
                        ))}
                        {(!resume.parsedData.languages || resume.parsedData.languages.length === 0) && (
                          <span className="text-xs text-slate-500 italic">No languages identified.</span>
                        )}
                      </div>
                    </div>

                    {/* Achievements Card */}
                    <div className="glass-panel p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                        <Award className="w-4.5 h-4.5 text-brand-primary" />
                        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Achievements & Honors</h3>
                      </div>

                      <ul className="space-y-3.5 list-none pt-1">
                        {resume.parsedData.achievements?.map((ach, index) => (
                          <li key={index} className="text-xs text-slate-300 leading-relaxed border-l-2 border-brand-border/80 pl-3">
                            {ach}
                          </li>
                        ))}
                        {(!resume.parsedData.achievements || resume.parsedData.achievements.length === 0) && (
                          <span className="text-xs text-slate-500 italic">No achievements details identified.</span>
                        )}
                      </ul>
                    </div>

                  </div>

                </div>
              </div>
            ) : resume.status === 'Failed' ? (
              <div className="glass-panel p-8 rounded-2xl text-center space-y-4 min-h-[300px] flex flex-col items-center justify-center border-brand-error/20">
                <div className="p-4 bg-brand-error/10 border border-brand-error/20 text-brand-error rounded-full inline-block">
                  <AlertTriangle className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Parsing Operation Failed</h4>
                  <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
                    The parser was unable to extract layout metrics from this document. Resumes containing scanned images or missing machine-readable text structures require OCR layers (scheduled for future modules).
                  </p>
                </div>
                <button
                  onClick={handleParse}
                  className="px-5 py-2.5 bg-brand-primary hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Retry Parsing
                </button>
              </div>
            ) : (
              /* Ready state to trigger parsing */
              <div className="glass-panel p-8 rounded-2xl text-center space-y-4 min-h-[300px] flex flex-col items-center justify-center">
                <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-full inline-block">
                  <Cpu className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Ready to Parse Resume</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    PDF document uploaded successfully. Click the parsing trigger above to extract structured categories.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 3: AI Analyst */}
        {activeTab === 'analyst' && resume && (
          <motion.div
            key="analyst"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Job Description Target selection card */}
            <div className="glass-panel p-6 rounded-2xl space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-brand-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4.5 h-4.5 text-brand-primary" />
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Company Job Description Profiles</h3>
                </div>

                <button
                  onClick={() => setIsCreatingJd(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary hover:brightness-110 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add JD Profile
                </button>
              </div>

              {isCreatingJd ? (
                /* Save New JD Profile Form */
                <form onSubmit={handleCreateJd} className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">JD Title / Position</label>
                      <input
                        type="text"
                        value={newJdTitle}
                        onChange={(e) => setNewJdTitle(e.target.value)}
                        placeholder="e.g. SDE-1"
                        className="w-full p-2.5 rounded-lg border border-brand-border/80 bg-brand-dark text-white text-xs focus-ring"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Company Name</label>
                      <input
                        type="text"
                        value={newJdCompany}
                        onChange={(e) => setNewJdCompany(e.target.value)}
                        placeholder="e.g. Google"
                        className="w-full p-2.5 rounded-lg border border-brand-border/80 bg-brand-dark text-white text-xs focus-ring"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Target Role / Track</label>
                      <input
                        type="text"
                        value={newJdRole}
                        onChange={(e) => setNewJdRole(e.target.value)}
                        placeholder="e.g. Full Stack Engineer"
                        className="w-full p-2.5 rounded-lg border border-brand-border/80 bg-brand-dark text-white text-xs focus-ring"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase">Job Description Text</label>
                    <textarea
                      value={newJdText}
                      onChange={(e) => setNewJdText(e.target.value)}
                      placeholder="Paste full job description requirements here..."
                      rows="4"
                      className="w-full p-3 rounded-lg border border-brand-border/80 bg-brand-dark text-white text-xs focus-ring"
                    />
                  </div>

                  <div className="flex gap-2.5 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsCreatingJd(false)}
                      className="px-4 py-2 border border-brand-border text-slate-400 hover:text-slate-200 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Save JD Profile
                    </button>
                  </div>
                </form>
              ) : (
                /* Select existing JD console dropdown */
                <div className="space-y-4">
                  {jobDescriptions.length > 0 ? (
                    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                      <div className="flex-1 space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Select Target Position</label>
                        <select
                          value={selectedJdId}
                          onChange={(e) => setSelectedJdId(e.target.value)}
                          className="w-full p-3 rounded-xl border border-brand-border bg-brand-dark/80 text-white text-xs font-semibold focus-ring"
                        >
                          {jobDescriptions.map(jd => (
                            <option key={jd._id} value={jd._id}>
                              {jd.company} — {jd.title} ({jd.jobRole})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-xl text-center text-xs text-slate-400">
                      No saved Job Descriptions found. Click "Add JD Profile" to create one.
                    </div>
                  )}

                  {selectedJd && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                          <Building className="w-4 h-4 text-slate-400" />
                          <span>{selectedJd.company}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-500" />
                          <span>{selectedJd.title}</span>
                        </div>
                        {selectedJd.lastUsed && (
                          <span>Last Used: {new Date(selectedJd.lastUsed).toLocaleDateString()}</span>
                        )}
                      </div>
                      <textarea
                        value={editingJdText}
                        onChange={(e) => setEditingJdText(e.target.value)}
                        placeholder="Job Description description text..."
                        rows="4"
                        className="w-full p-4 rounded-xl border border-brand-border/60 bg-brand-dark/50 text-slate-200 text-xs font-medium focus-ring transition-all"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI execution header card */}
            {selectedJd && (
              <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-brand-secondary/5 to-transparent pointer-events-none" />

                <div className="flex items-center gap-4.5 min-w-0 flex-1">
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl shrink-0">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="space-y-1 text-center md:text-left min-w-0">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                      <h3 className="text-sm font-extrabold text-white">Gemini AI Audit Console</h3>
                      {renderAiBadge(selectedJd.aiAnalysisStatus)}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                      Compares your profile tags against technical recruiting standards to locate skill gaps, critique bullet formatting, and recommend specific learning paths.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing || resume.status !== 'Parsed'}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-brand-primary hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    {analyzing ? (
                      <>
                        <Loader className="w-4.5 h-4.5 animate-spin" />
                        <span>Auditing Resume...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4.5 h-4.5" />
                        <span>Analyze Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error: Resume must be parsed first */}
            {resume.status !== 'Parsed' && (
              <div className="glass-panel p-8 rounded-2xl text-center space-y-4 min-h-[250px] flex flex-col items-center justify-center border-brand-warning/20">
                <div className="p-4 bg-brand-warning/10 border border-brand-warning/20 text-brand-warning rounded-full inline-block">
                  <FileWarning className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Parsing Required First</h4>
                  <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto">
                    Before Gemini can analyze your resume, you must trigger text extraction in the **Parser Console** tab to generate structured JSON formats.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('parser')}
                  className="px-5 py-2.5 bg-brand-primary hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Go to Parser Console
                </button>
              </div>
            )}

            {/* Analyzing loading state screens */}
            {analyzing ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel p-8 rounded-2xl text-center space-y-4 min-h-[300px] flex flex-col items-center justify-center">
                  <Loader className="w-10 h-10 text-brand-primary animate-spin mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Gemini Auditing Active...</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Executing LLM prompt templates, checking target role keyword alignments, locating missing skill vectors, and building suggestions...
                    </p>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl space-y-5">
                  <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                    <Activity className="w-4.5 h-4.5 text-brand-primary" />
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Audit Progress</h3>
                  </div>

                  <div className="space-y-4.5 text-xs relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-brand-border">
                    {(resume?.processingSteps && resume.processingSteps.length > 0 ? resume.processingSteps : [
                      { step: 'Uploading', status: 'Completed' },
                      { step: 'Parsing', status: 'Completed' },
                      { step: 'Extracting Skills', status: 'Completed' },
                      { step: 'Calculating ATS', status: 'Completed' },
                      { step: 'Running AI Analysis', status: 'In Progress' },
                      { step: 'Saving Results', status: 'Pending' }
                    ]).map((s, index) => {
                      const isCompleted = s.status === 'Completed';
                      const isInProgress = s.status === 'In Progress';
                      const isFailed = s.status === 'Failed';

                      let colorClass = 'text-slate-500';
                      if (isCompleted || isInProgress) colorClass = 'text-white';
                      if (isFailed) colorClass = 'text-brand-error';

                      return (
                        <div key={index} className={`relative pl-6 flex items-center justify-between ${colorClass}`}>
                          <div className={`absolute left-[4.5px] w-2 h-2 rounded-full ${isCompleted ? 'bg-brand-success' : isInProgress ? 'bg-brand-primary animate-pulse' : isFailed ? 'bg-brand-error' : 'bg-slate-700'
                            }`} />
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{s.step}</span>
                            {isCompleted && s.duration > 0 && (
                              <span className="text-[10px] text-slate-500 font-medium">({s.duration}ms)</span>
                            )}
                          </div>
                          {isCompleted && <CheckCircle className="w-4 h-4 text-brand-success shrink-0" />}
                          {isInProgress && <Loader className="w-4 h-4 text-brand-primary animate-spin shrink-0" />}
                          {isFailed && <XCircle className="w-4 h-4 text-brand-error shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : selectedJd && selectedJd.aiAnalysisStatus === 'Analyzed' && selectedJd.aiAnalysisData ? (
              /* Audited Dashboard grid */
              <div className="space-y-8">

                {resume?.version > 1 && (
                  <div className="flex justify-between items-center bg-[#05080e]/40 border border-brand-border/60 p-4 rounded-xl">
                    <div>
                      <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest block">Version Control</span>
                      <span className="text-[11px] text-slate-300">You are viewing <strong>v{resume.version}</strong> of this profile. Evolution diffs are available.</span>
                    </div>
                    <button
                      onClick={() => setShowComparison(prev => !prev)}
                      className="px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 hover:bg-brand-primary/20 text-brand-primary text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      {showComparison ? 'Hide Version Diffs' : 'Compare Version Evolution'}
                    </button>
                  </div>
                )}

                {showComparison && (
                  <ResumeCompare onClose={() => setShowComparison(false)} />
                )}

                {/* Visual Insights Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                  {/* ATS Score Card with Health Meter */}
                  <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">ATS Score</span>
                      <Activity className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-black text-white">{resume?.atsScore || 0}%</div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${getHealthBadgeStyles(resume?.resumeHealth || 'Average')}`}>
                        {getHealthBadgeStars(resume?.resumeHealth || 'Average')}
                      </span>
                    </div>
                  </div>

                  {/* Resume Quality Card */}
                  <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Resume Quality</span>
                      <Layers className="w-4 h-4 text-brand-secondary" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-black text-white">{resume?.resumeQuality || 0}%</div>
                      <span className="text-[9px] text-slate-400 font-medium">Completeness & Style</span>
                    </div>
                  </div>

                  {/* Keyword Coverage Card */}
                  <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Keyword Coverage</span>
                      <Target className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-black text-white">
                        {selectedJd.aiAnalysisData.atsAnalysis?.keywordMatch === 'High' ? '92%' : selectedJd.aiAnalysisData.atsAnalysis?.keywordMatch === 'Medium' ? '70%' : '45%'}
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium">Match: {selectedJd.aiAnalysisData.atsAnalysis?.keywordMatch || 'Medium'}</span>
                    </div>
                  </div>

                  {/* AI Match Confidence Card */}
                  <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">AI Match Confidence</span>
                      <Sparkles className="w-4 h-4 text-brand-success" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-black text-white">
                        {selectedJd.aiAnalysisData.confidence || 85}%
                      </div>
                      <span className="text-[9px] text-slate-400 font-medium">LLM Audit Alignment</span>
                    </div>
                  </div>

                </div>

                {/* Section Scores & Checklist Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                  {/* Left: Section Scores */}
                  <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-5">
                    <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                      <Layers className="w-4.5 h-4.5 text-brand-primary" />
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Detailed Section Scores</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                      {[
                        { label: 'Contact Information', key: 'contactInformation' },
                        { label: 'Summary', key: 'summary' },
                        { label: 'Education', key: 'education' },
                        { label: 'Projects', key: 'projects' },
                        { label: 'Experience', key: 'experience' },
                        { label: 'Skills', key: 'skills' },
                        { label: 'Certifications', key: 'certifications' },
                        { label: 'Achievements', key: 'achievements' }
                      ].map((item) => {
                        const val = resume?.sectionScores?.[item.key] || 0;
                        let barColor = 'bg-brand-primary';
                        if (val >= 90) barColor = 'bg-emerald-500';
                        else if (val >= 70) barColor = 'bg-brand-primary';
                        else if (val >= 50) barColor = 'bg-amber-500';
                        else barColor = 'bg-red-500';

                        return (
                          <div key={item.key} className="space-y-1 text-xs">
                            <div className="flex justify-between font-medium">
                              <span className="text-slate-300">{item.label}</span>
                              <span className="text-white font-bold">{val}%</span>
                            </div>
                            <div className="w-full bg-brand-dark/80 h-2 rounded-full overflow-hidden border border-brand-border/50">
                              <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${val}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: ATS Checklist */}
                  <div className="lg:col-span-1 glass-panel p-6 rounded-2xl space-y-5">
                    <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                      <CheckCircle className="w-4.5 h-4.5 text-brand-success" />
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Recruiter ATS Checklist</h3>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-300">
                      {[
                        { label: 'Email found', flag: resume?.atsChecklist?.emailFound },
                        { label: 'Phone found', flag: resume?.atsChecklist?.phoneFound },
                        { label: 'LinkedIn profile', flag: resume?.atsChecklist?.linkedinFound },
                        { label: 'GitHub repository', flag: resume?.atsChecklist?.githubFound },
                        { label: 'Education listings', flag: resume?.atsChecklist?.educationFound },
                        { label: 'Projects details', flag: resume?.atsChecklist?.projectsFound },
                        { label: 'Skills tags density', flag: resume?.atsChecklist?.skillsFound },
                        { label: 'Structured bullet points', flag: resume?.atsChecklist?.bulletPointsFound },
                        { label: 'Action verbs matching', flag: resume?.atsChecklist?.actionVerbsFound },
                        { label: 'Certifications presence', flag: !resume?.atsChecklist?.certificationsMissing },
                        { label: 'Portfolio link', flag: !resume?.atsChecklist?.portfolioMissing },
                        { label: 'Achievements listed', flag: !resume?.atsChecklist?.achievementsMissing }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="font-semibold text-slate-400">{item.label}</span>
                          {item.flag ? (
                            <span className="text-emerald-400 font-black">✔</span>
                          ) : (
                            <span className="text-red-400 font-black">✘</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* File Statistics Widget */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                    <FileText className="w-4.5 h-4.5 text-brand-primary" />
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">File & Parsing Statistics</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-xs text-slate-300">
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Resume Name</span>
                      <span className="text-slate-200 font-semibold truncate block" title={resume?.originalFileName}>{resume?.originalFileName}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">File Size</span>
                      <span className="text-slate-200 font-semibold">{formatBytes(resume?.fileSize || 0)}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Pages</span>
                      <span className="text-slate-200 font-semibold">{resume?.parsedData?.metadata?.pageCount || 1}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Word Count</span>
                      <span className="text-slate-200 font-semibold">{resume?.parsedData?.metadata?.wordCount || 0}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Character Count</span>
                      <span className="text-slate-200 font-semibold">{resume?.parsedData?.metadata?.charCount || 0}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Sections Found</span>
                      <span className="text-slate-200 font-semibold">{(resume?.parsedData?.metadata?.sectionsFound || []).length || 0}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Version</span>
                      <span className="text-slate-200 font-semibold">v{resume?.version || 1}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Last Analyzed</span>
                      <span className="text-slate-200 font-semibold">{resume?.lastAnalyzed ? new Date(resume.lastAnalyzed).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Readability Score</span>
                      <span className="text-slate-200 font-semibold">{resume?.parsedData?.metadata?.readability || 70}%</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Completeness</span>
                      <span className="text-slate-200 font-semibold">{resume?.parsedData?.metadata?.completeness || 80}%</span>
                    </div>
                  </div>
                </div>

                {/* Overall Feedback Banner */}
                <div className="grid grid-cols-1 gap-6">

                  {/* Summary Card */}
                  <div className="glass-panel p-6 rounded-2xl space-y-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-transparent" />
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">AI Executive Summary</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedJd.aiAnalysisData.resumeSummary}
                    </p>
                  </div>

                </div>

                {/* Historical Audit Metadata logs */}
                {selectedJd.aiAnalysisMetadata && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-brand-dark/60 border border-brand-border/60 rounded-xl text-[10px] text-slate-400">
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Analysis Version</span>
                      <span className="text-slate-200 font-semibold">{selectedJd.aiAnalysisMetadata.analysisVersion}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Audited At</span>
                      <span className="text-slate-200 font-semibold">{new Date(selectedJd.aiAnalysisMetadata.analyzedAt).toLocaleTimeString()}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Model Engine</span>
                      <span className="text-slate-200 font-semibold">{selectedJd.aiAnalysisMetadata.modelName}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Response Time</span>
                      <span className="text-slate-200 font-semibold">{selectedJd.aiAnalysisMetadata.responseTime} ms</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-500 font-bold uppercase block">Token Costs</span>
                      <span className="text-slate-200 font-semibold">∑ {selectedJd.aiAnalysisMetadata.tokenUsage?.totalTokens || 0}</span>
                    </div>
                  </div>
                )}

                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  {/* Strengths Card */}
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                      <CheckCircle className="w-4.5 h-4.5 text-brand-success" />
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Identified Profile Strengths</h3>
                    </div>
                    <ul className="space-y-3 list-none">
                      {selectedJd.aiAnalysisData.strengths?.map((str, i) => (
                        <li key={i} className="text-xs text-slate-300 leading-relaxed border-l-2 border-brand-success/60 pl-3">
                          {str}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses Card */}
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                      <XCircle className="w-4.5 h-4.5 text-brand-error" />
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Identified Profile Gaps</h3>
                    </div>
                    <ul className="space-y-3 list-none">
                      {selectedJd.aiAnalysisData.weaknesses?.map((weak, i) => (
                        <li key={i} className="text-xs text-slate-300 leading-relaxed border-l-2 border-brand-error/60 pl-3">
                          {weak}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Skill gaps and Recommended technologies */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  {/* Missing Skills Card */}
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                      <FileWarning className="w-4.5 h-4.5 text-brand-warning" />
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Missing Required Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedJd.aiAnalysisData.missingSkills?.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-brand-warning/10 border border-brand-warning/20 text-brand-warning text-xs font-semibold rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommended technologies Card */}
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                      <Code className="w-4.5 h-4.5 text-brand-primary" />
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Recommended Technologies</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedJd.aiAnalysisData.recommendedTechnologies?.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Recommended Certifications, Career Progression & Improvements */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                  {/* Certifications Card */}
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                      <BookmarkCheck className="w-4.5 h-4.5 text-indigo-400" />
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Target Certifications</h3>
                    </div>
                    <ul className="space-y-3.5 list-none">
                      {selectedJd.aiAnalysisData.recommendedCertifications?.map((cert, i) => (
                        <li key={i} className="text-xs text-slate-300 leading-relaxed border-l-2 border-indigo-500/60 pl-3">
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Career recommendations Card */}
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                      <TrendingUp className="w-4.5 h-4.5 text-brand-secondary" />
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Career Path Progression</h3>
                    </div>
                    <ul className="space-y-3.5 list-none">
                      {selectedJd.aiAnalysisData.careerRecommendations?.map((rec, i) => (
                        <li key={i} className="text-xs text-slate-300 leading-relaxed border-l-2 border-brand-secondary/60 pl-3">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvement suggestions Card */}
                  <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                      <RefreshCw className="w-4.5 h-4.5 text-brand-primary" />
                      <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Resume Enhancements</h3>
                    </div>
                    <ul className="space-y-3.5 list-none">
                      {selectedJd.aiAnalysisData.improvementSuggestions?.map((sug, i) => (
                        <div
                          key={i}
                          className="border border-brand-border/40 rounded-xl p-4 space-y-3"
                        >
                          <div>
                            <span className="text-red-400 text-[10px] font-bold uppercase">
                              Original
                            </span>

                            <p className="text-xs text-slate-300 mt-1">
                              {sug.original}
                            </p>
                          </div>

                          <div>
                            <span className="text-emerald-400 text-[10px] font-bold uppercase">
                              Recommended
                            </span>

                            <p className="text-xs text-slate-200 mt-1">
                              {sug.recommended}
                            </p>
                          </div>
                        </div>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* ATS Analysis insights */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 border-b border-brand-border/40 pb-3">
                    <Target className="w-4.5 h-4.5 text-brand-primary" />
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">ATS Layout & Keyword Audit</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">Keyword Matching Density</span>
                      <p className="font-semibold text-slate-200">{selectedJd.aiAnalysisData.atsAnalysis?.keywordMatch || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">Layout & Structure</span>
                      <p className="text-slate-300 leading-relaxed">{selectedJd.aiAnalysisData.atsAnalysis?.structureOptimization || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">Formatting Cleanness</span>
                      <p className="text-slate-300 leading-relaxed">{selectedJd.aiAnalysisData.atsAnalysis?.formattingCleanliness || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Overall Feedback note */}
                <div className="glass-panel p-6 rounded-2xl space-y-3 bg-indigo-500/5 border-indigo-500/15">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                    <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Coach Overall Feedback</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{selectedJd.aiAnalysisData.overallFeedback}"
                  </p>
                </div>

                {/* Future Integration roadmap banner */}
                <div className="glass-panel p-6 rounded-2xl bg-brand-primary/5 border border-brand-primary/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-transparent pointer-events-none" />
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4.5 h-4.5 text-brand-primary animate-pulse" />
                        Future Platform Integration
                      </h4>
                      <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                        This parsed resume serves as the unified database core for the entire platform. Upcoming updates will reuse this profile data for the <strong>Career Mentor</strong>, <strong>Mock Interviews</strong>, <strong>Coding Practice</strong>, <strong>MCQ Practice</strong>, <strong>Company-wise Preparation</strong>, <strong>Salary Prediction</strong>, and <strong>Roadmap Generator</strong> instantly with zero friction.
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-3.5 py-2 rounded-xl border border-brand-primary/20">
                      Module Integrator Enabled
                    </span>
                  </div>
                </div>

              </div>
            ) : selectedJd && selectedJd.aiAnalysisStatus === 'Failed' ? (
              <div className="glass-panel p-8 rounded-2xl text-center space-y-4 min-h-[300px] flex flex-col items-center justify-center border-brand-error/20">
                <div className="p-4 bg-brand-error/10 border border-brand-error/20 text-brand-error rounded-full inline-block">
                  <AlertTriangle className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">AI Audit Failed</h4>
                  <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto">
                    Google Gemini failed to audit this document. This may be due to rate limiting or incorrect configuration variables.
                  </p>
                </div>
                <button
                  onClick={handleAnalyze}
                  className="px-5 py-2.5 bg-brand-primary hover:brightness-110 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Retry Audit
                </button>
              </div>
            ) : selectedJd ? (
              /* Ready state to trigger analysis */
              <div className="glass-panel p-8 rounded-2xl text-center space-y-4 min-h-[250px] flex flex-col items-center justify-center">
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full inline-block">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Ready for AI Audit</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Resume parsed successfully. Click "Analyze Profile" above to start Google Gemini resume auditing.
                  </p>
                </div>
              </div>
            ) : (
              /* Inform selection first */
              <div className="glass-panel p-8 rounded-2xl text-center space-y-4 min-h-[250px] flex flex-col items-center justify-center border-brand-border/60">
                <div className="p-4 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-full inline-block">
                  <Target className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Select Position Track</h4>
                  <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto">
                    Create a Job Description profile or select an existing one above to target your AI audit reports.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
