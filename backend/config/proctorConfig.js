const PROCTOR_POLICIES = {
  face_missing: { scoreDeduction: 5, label: 'Face Missing' },
  multiple_faces: { scoreDeduction: 10, label: 'Multiple Faces' },
  phone_detected: { scoreDeduction: 15, label: 'Phone Detected' },
  eye_looking_away: { scoreDeduction: 3, label: 'Looking Away' },
  fullscreen_exit: { scoreDeduction: 10, label: 'Fullscreen Exit' },
  webcam_disabled: { scoreDeduction: 20, label: 'Webcam Disabled' },
  mic_disabled: { scoreDeduction: 20, label: 'Microphone Disabled' }
};

const BUFFER_CONFIG = {
  preEventBufferSeconds: 10,
  postEventBufferSeconds: 10,
  minViolationDuration: 2,
  maxEvidenceClipLength: 20
};

const CONFIDENCE_THRESHOLDS = {
  phone: 0.85,
  multi_face: 0.90,
  gaze: 0.75,
  head_pose: 0.80
};

const LIGHTING_CONFIG = {
  minimumLuminance: 40,
  optimalLuminance: 60,
  overExposureLimit: 240,
  autoPassIfFaceVisible: true,
  faceConfidenceThreshold: 0.90
};

module.exports = { PROCTOR_POLICIES, BUFFER_CONFIG, CONFIDENCE_THRESHOLDS, LIGHTING_CONFIG };
