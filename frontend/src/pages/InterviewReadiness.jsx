import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Mic, Wifi, Sparkles, ArrowRight, Loader, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import api from '../lib/api';


export default function InterviewReadiness() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');
  
  // Checking states
  const [camCheck, setCamCheck] = useState('checking'); // checking, pass, fail
  const [micCheck, setMicCheck] = useState('checking');
  const [wifiCheck, setWifiCheck] = useState('checking');
  
  const [micLevel, setMicLevel] = useState(0);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  
  const micIntervalRef = useRef(null);

  // Fetch session data first
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/interview/session/${id}`);
        if (res.data?.success) {
          setSession(res.data.data);
          runReadinessChecks();
        } else {
          setError('Could not locate interview session.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch interview session config.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();

    return () => {
      stopChecks();
    };
  }, [id]);

  const runReadinessChecks = async () => {
    // Reset checks state
    setCamCheck('checking');
    setMicCheck('checking');
    setError('');

    // 1. Wifi check
    if (navigator.onLine) {
      setWifiCheck('pass');
    } else {
      setWifiCheck('fail');
    }

    const goOnline = () => setWifiCheck('pass');
    const goOffline = () => setWifiCheck('fail');
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    // 2. Camera & Mic Stream Setup
    let localStream = null;
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: true
      });
      
      streamRef.current = localStream;
      if (videoRef.current) {
        videoRef.current.srcObject = localStream;
      }
      setCamCheck('pass');
      setMicCheck('pass');
      console.log('[Proctor] Camera initialized');

      // Initialize Mic volume meter using Web Audio API
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(localStream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      micIntervalRef.current = setInterval(() => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const avg = sum / bufferLength;
          setMicLevel(Math.min(100, Math.round(avg * 2)));
        }
      }, 100);

    } catch (err) {
      console.error('[Proctor] Camera or microphone stream blocked:', err);
      setCamCheck('fail');
      setMicCheck('fail');
      setError('Webcam or Microphone permissions were blocked or disabled.');
      return;
    }
  };

  const stopChecks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    if (micIntervalRef.current) clearInterval(micIntervalRef.current);
  };

  const handleStartInterview = async () => {
    stopChecks();
    navigate(`/mock-interviews/session/${id}`, { state: { proctoringEnabled: true } });
  };

  const allPassed = camCheck === 'pass' && 
                    micCheck === 'pass' && 
                    wifiCheck === 'pass';

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
        <Loader className="w-8 h-8 text-brand-primary animate-spin" />
        <span className="font-bold">Configuring Readiness checks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto w-full">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/20 text-brand-primary text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Proctor Audit
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          AI Readiness <span className="text-gradient">Hardware Check</span>
        </h1>
        <p className="text-xs text-slate-400">
          Ensure your camera, microphone, and connection meet proctoring guidelines before starting the session.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-brand-error/10 border border-brand-error/25 flex items-center justify-between text-xs text-brand-error font-medium">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button 
            onClick={runReadinessChecks}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-error/20 hover:bg-brand-error/35 transition-all text-[10px] font-black uppercase text-white"
          >
            <RefreshCw className="w-3 h-3" /> Retry Setup
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Left Side: Camera Preview */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center bg-brand-card/30 relative min-h-[300px]">
          {camCheck === 'pass' ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-brand-border shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              {/* Mic Indicator Overlay */}
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur rounded-xl border border-brand-border/60 flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-brand-secondary" />
                  Mic Level
                </span>
                <div className="flex-1 max-w-[120px] h-2 bg-slate-700 rounded-full overflow-hidden mx-3">
                  <div className="h-full bg-brand-secondary transition-all" style={{ width: `${micLevel}%` }} />
                </div>
                <span className="text-[10px] font-black text-white font-mono">{micLevel}%</span>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-error/10 border border-brand-error/25 flex items-center justify-center text-brand-error mx-auto">
                <Camera className="w-8 h-8 animate-pulse" />
              </div>
              <h4 className="font-extrabold text-white text-sm">Media Stream Blocked</h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed mx-auto">
                Please allow camera and microphone access inside your browser address bar permissions to continue.
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Audit Checklist */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">
              System Verification Checklist
            </h3>

            {/* Checklist elements */}
            <div className="space-y-4">
              {/* 1. Camera check */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-brand-border/40">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${camCheck === 'pass' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-error/10 text-brand-error'}`}>
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Camera Video Stream</span>
                    <span className="text-[10px] text-slate-400">Webcam feeds must remain active continuously</span>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  camCheck === 'pass' ? 'bg-brand-success/15 text-brand-success' : 'bg-brand-error/15 text-brand-error'
                }`}>
                  {camCheck === 'pass' ? 'Active' : 'Missing'}
                </span>
              </div>

              {/* 2. Microphone check */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-brand-border/40">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${micCheck === 'pass' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-error/10 text-brand-error'}`}>
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Microphone Stream</span>
                    <span className="text-[10px] text-slate-400">Voice recording is active during checks</span>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  micCheck === 'pass' ? 'bg-brand-success/15 text-brand-success' : 'bg-brand-error/15 text-brand-error'
                }`}>
                  {micCheck === 'pass' ? 'Active' : 'Missing'}
                </span>
              </div>


              {/* 4. Connection check */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-brand-border/40">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${wifiCheck === 'pass' ? 'bg-brand-success/10 text-brand-success' : 'bg-brand-error/10 text-brand-error'}`}>
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Internet Stability</span>
                    <span className="text-[10px] text-slate-400">Stable connection required to submit feedback</span>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  wifiCheck === 'pass' ? 'bg-brand-success/15 text-brand-success' : 'bg-brand-error/15 text-brand-error'
                }`}>
                  {wifiCheck === 'pass' ? 'Stable' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <button
            onClick={handleStartInterview}
            disabled={!allPassed}
            className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-sm transition-all shadow-lg hover:shadow-brand-primary/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            Start Proctored Interview
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
