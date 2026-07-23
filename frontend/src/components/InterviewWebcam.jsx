import React, { useRef, useState, useEffect } from 'react';
import { Camera, ShieldAlert, Cpu, Sparkles, Loader } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const CONFIDENCE_THRESHOLDS = {
  phone: 0.85,
  multi_face: 0.90,
  gaze: 0.75,
  head_pose: 0.80
};

// Module-level global cache to reuse loaded model instances across mounts
let globalBlazeface = null;
let globalCocoSsd = null;

export default function InterviewWebcam({
  onWarningTriggered,
  onEventLogged,
  onWebcamReady,
  onStreamActive,
  active = true
}) {
  const videoRef = useRef(null);

  const [modelLoading, setModelLoading] = useState(true);
  const [modelStatus, setModelStatus] = useState('Initializing proctoring engine...');
  const [webcamActive, setWebcamActive] = useState(false);
  const [error, setError] = useState('');

  // Ref tracking variables for consecutive frames to prevent false positive triggers
  const consecMissingFace = useRef(0);
  const consecMultipleFaces = useRef(0);
  const consecPhone = useRef(0);

  // Eye movement consecutive frames tracking
  const consecLookingLeft = useRef(0);
  const consecLookingRight = useRef(0);
  const consecLookingDown = useRef(0);
  const consecEyesClosed = useRef(0);

  // Head pose consecutive frames tracking
  const consecHeadAway = useRef(0);

  // Gaze & Head state transitions tracking
  const lastLoggedGazeState = useRef('looking_screen');
  const lastLoggedHeadState = useRef('facing_screen');

  // Performance Telemetry Health variables
  const framesCount = useRef(0);
  const startTime = useRef(Date.now());
  const totalInferenceTime = useRef(0);
  const droppedFrames = useRef(0);

  const animationFrameId = useRef(null);
  const blazefaceModel = useRef(null);
  const cocossdModel = useRef(null);

  // Initialize local AI models
  useEffect(() => {
    let isMounted = true;

    const initModels = async () => {
      try {
        setModelStatus('Warming up TensorFlow Core...');
        await tf.ready();

        if (isMounted) {
          if (globalBlazeface) {
            blazefaceModel.current = globalBlazeface;
          } else {
            setModelStatus('Loading Face Tracking Model...');
            globalBlazeface = await blazeface.load();
            blazefaceModel.current = globalBlazeface;
          }
        }

        if (isMounted) {
          if (globalCocoSsd) {
            cocossdModel.current = globalCocoSsd;
          } else {
            setModelStatus('Loading Object Tracking Model...');
            globalCocoSsd = await cocoSsd.load();
            cocossdModel.current = globalCocoSsd;
          }
        }

        if (isMounted) {
          setModelLoading(false);
          if (onWebcamReady) onWebcamReady();
        }
      } catch (err) {
        console.error('Failed to initialize local AI models:', err);
        setError('Failed to initialize local proctoring models.');
        setModelLoading(false);
      }
    };

    initModels();

    return () => {
      isMounted = false;
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Web camera setup
  useEffect(() => {
    if (modelLoading || !active) return;

    let localStream = null;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, frameRate: 15 },
          audio: true
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          localStream = stream;
          setWebcamActive(true);
          startTime.current = Date.now();
          if (onStreamActive) {
            onStreamActive(stream);
          }
        }
      } catch (err) {
        console.error('Failed to start camera/microphone stream:', err);
        setError('Camera/Microphone stream blocked. Check device settings.');
        onWarningTriggered('webcam_disabled', 'Webcam or Microphone permissions were blocked or disabled.', 100, 'VisibilityAPI', '1.0.0', null);
      }
    };

    startCamera();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [modelLoading, active]);

  // Frame monitoring loop
  useEffect(() => {
    if (!webcamActive || modelLoading || !active) return;

    let frameCount = 0;

    const monitorLoop = async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
        animationFrameId.current = requestAnimationFrame(monitorLoop);
        return;
      }

      frameCount++;
      // Sample process 1 frame every 8 frames (~250ms interval)
      if (frameCount % 8 === 0) {
        try {
          await runProctorCheck();
        } catch (err) {
          console.warn('Proctor loop frame exception:', err.message);
          droppedFrames.current += 1;
        }
      }

      animationFrameId.current = requestAnimationFrame(monitorLoop);
    };

    monitorLoop();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      updateHealthStats(); // save final stats on cleanup
    };
  }, [webcamActive, modelLoading, active]);

  const updateHealthStats = () => {
    if (framesCount.current === 0) return;
    const elapsedSec = (Date.now() - startTime.current) / 1000;
    const fps = elapsedSec > 0 ? Math.round(framesCount.current / elapsedSec) : 15;
    const avgInference = Math.round(totalInferenceTime.current / framesCount.current);
    
    let resolution = '320x240';
    try {
      const track = videoRef.current?.srcObject?.getVideoTracks()[0];
      const settings = track?.getSettings();
      if (settings) {
        resolution = `${settings.width}x${settings.height}`;
      }
    } catch (e) {}

    const health = {
      averageFps: fps,
      aiInferenceTimeMs: avgInference,
      droppedFramesCount: droppedFrames.current,
      cameraResolution: resolution,
      browserVersion: navigator.userAgent
    };
    localStorage.setItem('prepai_active_session_health', JSON.stringify(health));
  };

  const runProctorCheck = async () => {
    if (!videoRef.current || !blazefaceModel.current || !cocossdModel.current) return;

    const video = videoRef.current;
    const inferenceStart = performance.now();

    // 1. Face Count, Gaze, and Head Pose Checks
    const facePredictions = await blazefaceModel.current.estimateFaces(video, false);

    if (facePredictions.length === 0) {
      consecMissingFace.current++;
      consecMultipleFaces.current = 0;
      if (consecMissingFace.current >= 12) { // ~3 seconds sustained absence
        onWarningTriggered('face_missing', 'No face detected in camera view. Please remain in front of the lens.', 95, 'BlazeFace', '0.1.0', video);
        consecMissingFace.current = 0;
      }
    } else if (facePredictions.length > 1) {
      consecMultipleFaces.current++;
      consecMissingFace.current = 0;
      
      // Face detection probability/confidence check
      const prob = facePredictions[0].probability ? facePredictions[0].probability[0] : 0.95;
      if (prob >= CONFIDENCE_THRESHOLDS.multi_face) {
        if (consecMultipleFaces.current >= 10) { // ~2.5 seconds sustained multiple faces
          onWarningTriggered('multiple_faces', 'Multiple faces detected. Only the registered user is allowed.', Math.round(prob * 100), 'BlazeFace', '0.1.0', video);
          consecMultipleFaces.current = 0;
        }
      }
    } else {
      consecMissingFace.current = 0;
      consecMultipleFaces.current = 0;

      const prob = facePredictions[0].probability ? facePredictions[0].probability[0] : 0.95;

      // Extract BlazeFace landmarks:
      // 0: right eye, 1: left eye, 2: nose, 3: mouth, 4: right ear, 5: left ear
      const landmarks = facePredictions[0].landmarks;
      if (landmarks && landmarks.length >= 6) {
        const rightEye = landmarks[0];
        const leftEye = landmarks[1];
        const nose = landmarks[2];
        const mouth = landmarks[3];
        const rightEar = landmarks[4];
        const leftEar = landmarks[5];

        // Eye Gaze Heuristics - run only if model confidence meets gaze threshold
        if (prob >= CONFIDENCE_THRESHOLDS.gaze) {
          const gazeWidth = leftEye[0] - rightEye[0];
          const gazeRatio = gazeWidth > 0 ? (nose[0] - rightEye[0]) / gazeWidth : 0.5;

          // Eye state flags
          let eyeState = 'looking_screen';
          if (gazeRatio < 0.28) {
            eyeState = 'looking_right';
          } else if (gazeRatio > 0.72) {
            eyeState = 'looking_left';
          }

          // Vertical Gaze heuristic (Up / Down)
          const eyeNoseHeight = nose[1] - (leftEye[1] + rightEye[1]) / 2;
          if (eyeNoseHeight < 8) {
            eyeState = 'looking_up';
          } else if (eyeNoseHeight > 18) {
            eyeState = 'looking_down';
          }

          // Detect Closed Eyes
          const isEyeTraceMissing = (!rightEye || !leftEye || Math.abs(rightEye[0] - leftEye[0]) < 2);
          if (isEyeTraceMissing) {
            eyeState = 'eyes_closed';
          }

          // Log Gaze state changes
          if (eyeState !== lastLoggedGazeState.current) {
            lastLoggedGazeState.current = eyeState;
            onEventLogged(eyeState, `Gaze direction transition to ${eyeState.replace('_', ' ')}`);
          }

          // Apply Warning triggers for eyes
          if (eyeState === 'looking_left') {
            consecLookingLeft.current++;
            if (consecLookingLeft.current >= 20) { // > 5 seconds
              onWarningTriggered('looking_left', 'Looking away to the left for too long.', Math.round(prob * 100), 'BlazeFace', '0.1.0', video);
              consecLookingLeft.current = 0;
            }
          } else {
            consecLookingLeft.current = 0;
          }

          if (eyeState === 'looking_right') {
            consecLookingRight.current++;
            if (consecLookingRight.current >= 20) { // > 5 seconds
              onWarningTriggered('looking_right', 'Looking away to the right for too long.', Math.round(prob * 100), 'BlazeFace', '0.1.0', video);
              consecLookingRight.current = 0;
            }
          } else {
            consecLookingRight.current = 0;
          }

          if (eyeState === 'looking_down') {
            consecLookingDown.current++;
            if (consecLookingDown.current >= 20) { // > 5 seconds
              onWarningTriggered('looking_down', 'Looking down away from screen for too long.', Math.round(prob * 100), 'BlazeFace', '0.1.0', video);
              consecLookingDown.current = 0;
            }
          } else {
            consecLookingDown.current = 0;
          }

          if (eyeState === 'eyes_closed') {
            consecEyesClosed.current++;
            if (consecEyesClosed.current >= 12) { // > 3 seconds
              onWarningTriggered('eyes_closed', 'Eyes closed or covered for too long.', Math.round(prob * 100), 'BlazeFace', '0.1.0', video);
              consecEyesClosed.current = 0;
            }
          } else {
            consecEyesClosed.current = 0;
          }
        }

        // Head Pose Heuristics - run only if model confidence meets head pose threshold
        if (prob >= CONFIDENCE_THRESHOLDS.head_pose) {
          const earSpan = leftEar[0] - rightEar[0];
          const noseEarRatio = earSpan > 0 ? (nose[0] - rightEar[0]) / earSpan : 0.5;

          let headState = 'facing_screen';
          if (noseEarRatio < 0.32) {
            headState = 'head_right';
          } else if (noseEarRatio > 0.68) {
            headState = 'head_left';
          }

          // Head vertical rotation
          const noseMouthDist = mouth[1] - nose[1];
          if (noseMouthDist < 8) {
            headState = 'head_down';
          }

          // State transition events logging
          if (headState !== lastLoggedHeadState.current) {
            lastLoggedHeadState.current = headState;
            onEventLogged(headState, `Head position changed to ${headState.replace('_', ' ')}`);
          }

          // Warning rules for Head poses
          if (headState !== 'facing_screen') {
            consecHeadAway.current++;
            if (consecHeadAway.current >= 20) { // > 5 seconds
              const warningCode = headState === 'head_left' ? 'head_left' : headState === 'head_right' ? 'head_right' : 'head_down';
              onWarningTriggered(warningCode, `Head turned away (${headState.replace('_', ' ')}) for too long.`, Math.round(prob * 100), 'BlazeFace', '0.1.0', video);
              consecHeadAway.current = 0;
            }
          } else {
            consecHeadAway.current = 0;
          }
        }
      }
    }

    // 2. Prohibited Object Scan - run only if model meets phone threshold config
    const objectPredictions = await cocossdModel.current.detect(video);
    const prohibitedObjects = ['cell phone', 'laptop', 'book', 'tablet'];
    const detectedProhibited = objectPredictions.find(pred =>
      prohibitedObjects.includes(pred.class.toLowerCase()) && pred.score > CONFIDENCE_THRESHOLDS.phone
    );

    if (detectedProhibited) {
      consecPhone.current++;
      if (consecPhone.current >= 6) { // ~1.5 seconds sustained visibility
        onWarningTriggered('phone_detected', `Prohibited object detected: ${detectedProhibited.class}.`, Math.round(detectedProhibited.score * 100), 'COCO-SSD', '2.0.0', video);
        consecPhone.current = 0;
      }
    } else {
      consecPhone.current = 0;
    }

    // Accumulate telemetry statistics
    const inferenceEnd = performance.now();
    totalInferenceTime.current += (inferenceEnd - inferenceStart);
    framesCount.current += 1;
    updateHealthStats(); // continuously flush updates to local storage
  };

  return (
    <div className="glass-panel p-4.5 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center bg-brand-card/40 border border-brand-border/80 w-full min-h-[220px]">
      {modelLoading ? (
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <Loader className="w-8 h-8 text-brand-primary animate-spin" />
          <span className="text-xs text-slate-400 font-bold">{modelStatus}</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-2.5 p-4 text-center">
          <ShieldAlert className="w-8 h-8 text-brand-error animate-pulse" />
          <span className="text-xs text-brand-error font-extrabold">{error}</span>
        </div>
      ) : (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-brand-dark/95 border border-brand-border flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur border border-brand-border text-[9px] font-black tracking-widest text-brand-success uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-ping shrink-0" />
            AI SECURE PROCTOR ACTIVE
          </div>
        </div>
      )}
    </div>
  );
}
