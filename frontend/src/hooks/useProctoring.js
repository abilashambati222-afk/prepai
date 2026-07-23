import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const BUFFER_CONFIG = {
  preEventBufferSeconds: 10,
  postEventBufferSeconds: 10,
  minViolationDuration: 2,
  maxEvidenceClipLength: 20
};

export default function useProctoring(interviewId, active = true) {
  const navigate = useNavigate();

  const [integrityScore, setIntegrityScore] = useState(100);
  const [warningsCount, setWarningsCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [currentWarningType, setCurrentWarningType] = useState('');
  const [currentWarningMsg, setCurrentWarningMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fullscreenExitCount = useRef(0);
  const isTerminated = useRef(false);

  // MediaRecorder rolling evidence buffers
  const mediaRecorderRef = useRef(null);
  const rollingBuffer = useRef([]); // holds recent 5s segments of Blobs
  const isRecordingEvidence = useRef(false);
  const activeStream = useRef(null);

  // Background Upload Queue
  const uploadQueue = useRef([]);
  const isUploading = useRef(false);

  // 1. Fullscreen changes listener
  useEffect(() => {
    if (!active || isTerminated.current) return;

    const requestFullscreen = async () => {
      try {
        const docEl = document.documentElement;
        if (!document.fullscreenElement) {
          await docEl.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (err) {
        console.warn('Fullscreen request blocked by user interaction:', err.message);
      }
    };

    requestFullscreen();

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        fullscreenExitCount.current++;
        triggerWarning('fullscreen_exit', 'You have exited fullscreen mode. Please return to fullscreen immediately.', 100, 'VisibilityAPI', '1.0.0', null);

        if (fullscreenExitCount.current >= 3) {
          terminateSession('Repeatedly exited fullscreen mode.');
        }
      } else {
        setIsFullscreen(true);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [active]);

  // 2. Tab switching & window blur checks
  useEffect(() => {
    if (!active || isTerminated.current) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerWarning('tab_switch', 'Tab switching detected. You are required to remain on the interview page.', 100, 'VisibilityAPI', '1.0.0', null);
      }
    };

    const handleWindowBlur = () => {
      triggerWarning('window_blur', 'Focus moved away from the interview. Please stay focused on the assessment.', 100, 'VisibilityAPI', '1.0.0', null);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [active]);

  // 3. Evidence Recorder rolling buffers
  const startEvidenceRecorder = (stream) => {
    if (!stream || mediaRecorderRef.current) return;
    activeStream.current = stream;

    try {
      // Slices data every 5 seconds
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8' });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          if (isRecordingEvidence.current) return;
          
          rollingBuffer.current.push(e.data);
          
          // Determine slices to keep based on pre-event config (slice size = 5s)
          const slicesToKeep = Math.ceil(BUFFER_CONFIG.preEventBufferSeconds / 5);
          if (rollingBuffer.current.length > slicesToKeep) {
            rollingBuffer.current.shift();
          }
        }
      };

      recorder.start(5000);
    } catch (err) {
      console.warn('MediaRecorder failed to initialize:', err.message);
    }
  };

  const processUploadQueue = async () => {
    if (isUploading.current || uploadQueue.current.length === 0) return;
    isUploading.current = true;

    const item = uploadQueue.current[0];
    try {
      await api.post('/interview/evidence', item.formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Success: shift queue and process next
      uploadQueue.current.shift();
      isUploading.current = false;
      processUploadQueue();
    } catch (err) {
      console.warn('Background evidence upload failed, retrying in 5 seconds...', err.message);
      isUploading.current = false;
      setTimeout(processUploadQueue, 5000); // Retry after 5 seconds
    }
  };

  const captureEvidenceClip = async (violationType, confidence, modelUsed, modelVersion, videoElement) => {
    if (isRecordingEvidence.current || !activeStream.current) return;
    isRecordingEvidence.current = true;

    // 1. Capture snapshots immediately (represents the high confidence violation frame)
    let thumbnailBlob = null;
    if (videoElement && videoElement.videoWidth) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0);
        thumbnailBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
      } catch (snapErr) {
        console.warn('Failed to capture thumbnail snapshot:', snapErr.message);
      }
    }

    try {
      // Gather current pre-violation buffer blobs
      const preBlobs = [...rollingBuffer.current];
      
      // Stop standard rolling recorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      // Record subsequent post-violation video chunks
      const postBlobs = [];
      const evidenceRecorder = new MediaRecorder(activeStream.current, { mimeType: 'video/webm;codecs=vp8' });
      
      evidenceRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          postBlobs.push(e.data);
        }
      };

      evidenceRecorder.onstop = async () => {
        const finalBlobs = [...preBlobs, ...postBlobs];
        const mergedBlob = new Blob(finalBlobs, { type: 'video/webm' });
        const clipDuration = Math.round(finalBlobs.length * 5); // Approximate duration

        // Create upload package
        const formData = new FormData();
        formData.append('interviewId', interviewId);
        formData.append('violationType', violationType);
        formData.append('confidence', confidence);
        formData.append('duration', clipDuration);
        formData.append('modelUsed', modelUsed);
        formData.append('modelVersion', modelVersion);
        formData.append('video', mergedBlob, `evidence-${violationType}-${Date.now()}.webm`);
        if (thumbnailBlob) {
          formData.append('thumbnail', thumbnailBlob, `evidence-${violationType}-${Date.now()}.jpg`);
        }

        // Push to upload queue and trigger background processing
        uploadQueue.current.push({ formData });
        processUploadQueue();

        // Restart rolling monitor recorder
        isRecordingEvidence.current = false;
        mediaRecorderRef.current = null;
        rollingBuffer.current = [];
        startEvidenceRecorder(activeStream.current);
      };

      evidenceRecorder.start();

      // Collect post-event buffer seconds from configuration
      const recordMs = BUFFER_CONFIG.postEventBufferSeconds * 1000;
      setTimeout(() => {
        if (evidenceRecorder.state !== 'inactive') {
          evidenceRecorder.stop();
        }
      }, recordMs);

    } catch (err) {
      console.warn('Failed to compile proctor evidence recording:', err.message);
      isRecordingEvidence.current = false;
    }
  };

  const handleProctorWarning = (type, message, confidence = 100, modelUsed = 'Unknown', modelVersion = '1.0.0', videoElement = null) => {
    if (isTerminated.current) return;
    triggerWarning(type, message, confidence, modelUsed, modelVersion, videoElement);
  };

  const handleProctorEvent = async (type, details, duration = 0) => {
    if (isTerminated.current) return;
    try {
      await api.post('/interview/event', {
        interviewId,
        eventType: type,
        details,
        duration
      });
    } catch (err) {
      console.warn('Failed to log event to backend:', err.message);
    }
  };

  const triggerWarning = async (type, message, confidence = 100, modelUsed = 'Unknown', modelVersion = '1.0.0', videoElement = null) => {
    if (isTerminated.current) return;

    setCurrentWarningType(type);
    setCurrentWarningMsg(message);
    setShowWarningModal(true);

    // Trigger video and snapshot captures
    captureEvidenceClip(type, confidence, modelUsed, modelVersion, videoElement);

    try {
      const res = await api.post('/interview/warning', {
        interviewId,
        warningType: type,
        details: message
      });

      if (res.data?.success) {
        setWarningsCount(res.data.data.warnings);
        setIntegrityScore(res.data.data.integrityScore);

        if (res.data.data.warnings >= 5) {
          terminateSession('Accumulated maximum warning limit.');
        }
      }
    } catch (err) {
      console.warn('Failed to submit warning details:', err.message);
      setWarningsCount(prev => {
        const nextVal = prev + 1;
        if (nextVal >= 5) {
          terminateSession('Accumulated maximum warning limit (calculated locally).');
        }
        return nextVal;
      });
      setIntegrityScore(prev => Math.max(0, prev - 10));
    }

    setTimeout(() => {
      setShowWarningModal(false);
    }, 4000);
  };

  const terminateSession = async (reason) => {
    if (isTerminated.current) return;
    isTerminated.current = true;

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    // Attach telemetry health logs
    const healthDataStr = localStorage.getItem('prepai_active_session_health');
    const sessionHealth = healthDataStr ? JSON.parse(healthDataStr) : null;

    try {
      await api.post('/interview/end', {
        interviewId,
        status: 'terminated',
        sessionHealth
      });
    } catch (err) {
      console.error('Failed to report termination status:', err);
    }

    localStorage.removeItem(`prepai_interview_checkpoint_${interviewId}`);
    localStorage.removeItem('prepai_active_session_health');
    alert(`Interview Terminated: ${reason}`);
    navigate(`/mock-interviews/report/${interviewId}`);
  };

  const handleForceFullscreen = () => {
    const docEl = document.documentElement;
    if (docEl.requestFullscreen) {
      docEl.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    }
  };

  // Clean up recorders on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return {
    integrityScore,
    setIntegrityScore,
    warningsCount,
    setWarningsCount,
    showWarningModal,
    currentWarningType,
    currentWarningMsg,
    isFullscreen,
    handleProctorWarning,
    handleProctorEvent,
    handleForceFullscreen,
    terminateSession,
    startEvidenceRecorder
  };
}
