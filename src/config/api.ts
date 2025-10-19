// Backend API Configuration
// All endpoints use local backend (main.py)
export const BACKEND_URL = "https://mina-api.corecognitive.io";

// API Endpoints - All from local main.py
export const API_ENDPOINTS = {
  CHAT: `${BACKEND_URL}/chat`,
  STT: `${BACKEND_URL}/stt`,
  TTS: `${BACKEND_URL}/tts`,
  GENERATE_CUES: `${BACKEND_URL}/generate-cues`,
  GENERATE_REPORT: `${BACKEND_URL}/generate-report`,
  VOICE_CHAT: `${BACKEND_URL}/voice-chat`,
} as const;

export default BACKEND_URL;

