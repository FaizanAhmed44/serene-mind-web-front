import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Trigger from '@/components/Trigger'; // Adjust path if needed
import Loader from '@/components/Loader';
import Character from '@/components/Character';
import SoothingBackground from '@/components/SoothingBackground';
import VoiceTherapy from '@/components/VoiceTherapy';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, AnimatePresence } from "framer-motion";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { API_ENDPOINTS } from "@/config/api";
import ReportModal from '@/components/ReportModal';
import { Button } from '@/components/ui/button';

interface ReportData {
  user_name: string;
  session_summary: string;
  emotional_snapshot: {
    current_vibe: string;
    energy: string;
    focus_state: string;
  };
  your_strengths: string[];
  growth_focus: string[];
  next_micro_actions: string[];
  coach_reflection: string;
  mood_icon: string;
  report_version: string;
}

const AIMinaCoach2: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [therapistReply, setTherapistReply] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [mouthCues, setMouthCues] = useState<Array<{
    start: number;
    end: number;
    value: string;
    intensity?: number;
  }>>([]);
  
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    data: ReportData | null;
  }>({
    isOpen: false,
    data: null,
  });
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Toggle recording function
  const toggleRecording = async () => {
    if (!isRecording) {
      // Stop any currently playing audio before starting new recording
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setIsPlayingAudio(false);
        setTherapistReply('');
        setMouthCues([]);
      }
      
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        
        audioChunksRef.current = [];
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstop = async () => {
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
          
          // Create audio blob
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert to base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Audio = reader.result?.toString().split(',')[1];
            if (base64Audio) {
              await processVoiceInput(base64Audio);
            }
          };
          reader.readAsDataURL(audioBlob);
        };
        
        mediaRecorder.start(1000);
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
        setError(null);
        
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setError("Microphone access denied. Please allow microphone access.");
      }
    } else {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    }
  };

  // End session handler
  const handleEndSession = () => {
    endSession();
  };

  // End session function
  const endSession = async () => {
    if (!sessionId) {
      console.warn("No active session to end");
      return;
    }

    try {
      setIsLoading(true);
      
      // Send final message to backend with session end flag
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: "Thank you for the session. I'd like to end our conversation now.",
          is_session_end: true,
          session_id: sessionId,
          stream: false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Session ended successfully");
        
        // Generate report
        await generateUserReport(sessionId);
      }
      
      // Deactivate session
      setSessionActive(false);
      setIsLoading(false);
      
    } catch (error) {
      console.error("Error ending session:", error);
      setError("Failed to end session properly");
      setIsLoading(false);
    }
  };

  // Generate user report
  const generateUserReport = async (sid: string) => {
    try {
      console.log("📊 Generating user report for session:", sid);
      const response = await fetch(API_ENDPOINTS.GENERATE_REPORT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sid }),
      });

      if (!response.ok) {
        throw new Error(`Report generation failed: ${response.status}`);
      }

      const reportData = await response.json();
      console.log("✅ Report generated successfully");
      
      // Show report modal
      setReportModal({
        isOpen: true,
        data: reportData.report_data,
      });
      
    } catch (error) {
      console.error("Error generating report:", error);
      setError("Failed to generate session report");
    }
  };

  // Close report modal
  const closeReportModal = () => {
    setReportModal({
      isOpen: false,
      data: null,
    });
  };

  // Start new session
  const handleStartNewSession = () => {
    console.log("🆕 Starting new session");
    
    // Reset all state
    setTherapistReply('');
    setIsRecording(false);
    setIsLoading(false);
    setIsPlayingAudio(false);
    setSessionId(null);
    setSessionActive(true);
    setError(null);
    setCurrentAudio(null);
    setMouthCues([]);
    
    // Stop any playing audio
    if (currentAudio) {
      currentAudio.pause();
    }
    
    console.log("✅ New session started - ready for conversation");
  };

  // Process voice input: STT -> Chat -> TTS
  const processVoiceInput = async (base64Audio: string, isSessionEnd: boolean = false) => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 1: Speech-to-Text
      console.log("🎤 Step 1: Converting speech to text...");
      const sttResponse = await fetch(API_ENDPOINTS.STT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio_data: base64Audio,
          session_id: sessionId,
          mime_type: "audio/webm"
        }),
      });

      if (!sttResponse.ok) {
        throw new Error(`STT error: ${sttResponse.status}`);
      }

      const sttData = await sttResponse.json();
      
      if (!sttData.success || !sttData.transcript || !sttData.transcript.trim()) {
        throw new Error("No speech detected. Please try again.");
      }

      const userMessage = sttData.transcript.trim();
      console.log("✅ Transcript:", userMessage);

      // Step 2: Get MINA's response
      console.log("🤖 Step 2: Getting MINA's response...");
      const chatResponse = await fetch(API_ENDPOINTS.CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: userMessage,
          is_session_end: isSessionEnd,
          session_id: sessionId,
          stream: false,
        }),
      });

      if (!chatResponse.ok) {
        throw new Error(`Chat error: ${chatResponse.status}`);
      }

      const chatData = await chatResponse.json();
      
      if (!chatData.mina_reply || !chatData.mina_reply.trim()) {
        throw new Error("No response received from MINA");
      }

      const minaResponse = chatData.mina_reply.trim();
      console.log("✅ MINA Response:", minaResponse);
      
      // Update session ID
      if (chatData.session_id) {
        setSessionId(chatData.session_id);
      }

      // Check if session ended and generate report
      if (isSessionEnd || !chatData.session_active) {
        await generateUserReport(chatData.session_id);
        setSessionActive(false);
      }

      // Step 3: Text-to-Speech + Lipsync Generation (PARALLEL)
      console.log("🔊 Step 3: Generating TTS audio AND lipsync cues in parallel...");
      
      const [ttsResponse, lipsyncResponse] = await Promise.all([
        // TTS API call
        fetch(API_ENDPOINTS.TTS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: minaResponse,
            session_id: sessionId,
            voice: "aura-asteria-en"
          }),
        }),
        // Lipsync API call
        fetch(API_ENDPOINTS.GENERATE_CUES, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: minaResponse
          }),
        })
      ]);

      if (!ttsResponse.ok) {
        throw new Error(`TTS error: ${ttsResponse.status}`);
      }

      if (!lipsyncResponse.ok) {
        throw new Error(`Lipsync error: ${lipsyncResponse.status}`);
      }

      const [ttsData, lipsyncData] = await Promise.all([
        ttsResponse.json(),
        lipsyncResponse.json()
      ]);
      
      if (!ttsData.success || !ttsData.audio_data) {
        throw new Error("Failed to generate speech");
      }

      if (!lipsyncData.mouthCues || !Array.isArray(lipsyncData.mouthCues)) {
        throw new Error("Failed to generate lipsync cues");
      }

      console.log("✅ Audio generated:", ttsData.audio_data ? "Ready" : "Failed");
      console.log("✅ Lipsync cues generated:", lipsyncData.mouthCues.length, "cues");
      console.log("🎬 Preparing synchronized playback...");
      
      // Create audio element
      setIsLoading(false);
      const audio = new Audio(`data:audio/wav;base64,${ttsData.audio_data}`);
      
      // Set up audio event handlers for UI state only
      audio.onplay = () => {
        console.log("🎵 Audio playback started");
        setIsPlayingAudio(true);
      };
      
      audio.onended = () => {
        console.log("✅ Audio playback finished");
        setIsPlayingAudio(false);
        // Clear after a small delay to let lipsync finish
        setTimeout(() => {
          setTherapistReply('');
          setCurrentAudio(null);
          setMouthCues([]);
        }, 200);
      };
      
      audio.onerror = (e) => {
        console.error("Error playing audio:", e);
        setIsPlayingAudio(false);
        setTherapistReply('');
        setCurrentAudio(null);
        setMouthCues([]);
        setError("Failed to play audio response");
      };
      
      // Set text, audio element, and PRE-GENERATED mouth cues
      // All data is ready BEFORE playback starts
      setTherapistReply(minaResponse);
      setMouthCues(lipsyncData.mouthCues);
      setCurrentAudio(audio);
      
      // Small delay to ensure React state updates before playing
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Start audio playback - Character will sync automatically with pre-loaded cues
      console.log("▶️ Starting audio playback - lipsync cues already loaded, perfect sync guaranteed!");
      await audio.play();

    } catch (err) {
      console.error("Voice processing error:", err);
      setIsLoading(false);
      setIsPlayingAudio(false);
      setError(err instanceof Error ? err.message : 'Voice processing failed');
    }
  };

  return (
    
    <div className="w-full h-full flex flex-col bg-white relative">
      <motion.div
        className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between p-4">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <SidebarTrigger />
          </motion.div>
          <motion.h1
            className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            AI Mina Coach
          </motion.h1>
          
          {/* Session Controls */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {sessionId && sessionActive && (
              <div className="text-xs text-muted-foreground">
                Session: {sessionId.slice(-8)}
              </div>
            )}
            {sessionActive ? (
              <Button
                onClick={handleEndSession}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
                disabled={isLoading || isRecording}
              >
                End Session
              </Button>
            ) : (
              <Button
                onClick={handleStartNewSession}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                ✨ Start New Session
              </Button>
            )}
          </motion.div>
        </div>
      </motion.div>     
      {loading && <Loader />}
      <ErrorBoundary
        fallback={<div className="flex items-center justify-center h-full bg-white">Failed to load 3D scene—check console for details.</div>}
      >
      <div className="flex-1">
        <Canvas
          camera={{ position: [0, 1.4, 1.5], fov: 25 }}
          gl={{ antialias: false }} // Helps with context issues
          style={{ background: 'white' }}
        >
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          {/* Lighting */}
          <ambientLight intensity={1} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight
            position={[-5, 5, -5]}
            intensity={0.4}
          />
          <hemisphereLight
            groundColor="#ffffff"
            intensity={0.2}
          />
          
          <Suspense fallback={<Trigger setLoading={setLoading} />}>
            <SoothingBackground />
            <Character 
              therapistReply={therapistReply} 
              audioElement={currentAudio}
              mouthCues={mouthCues}
            />
          </Suspense>
        </Canvas>
      </div>
      </ErrorBoundary>
      
      {/* Voice Controls - Only show when session is active */}
      {sessionActive && (
        <VoiceTherapy 
          onToggleRecording={toggleRecording}
          isRecording={isRecording}
          isLoading={isLoading}
          isPlayingAudio={isPlayingAudio}
        />
      )}
      
      {/* Session Ended Overlay */}
      {!sessionActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            transform: 'translate(-50%, 50%)',
            zIndex: 20,
            textAlign: 'center',
          }}
        >
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 shadow-2xl max-w-md">
            <div className="text-6xl mb-4">🪷</div>
            <p className="text-2xl font-bold mb-2 text-gray-800">Session Ended</p>
            <p className="text-sm mb-6 text-gray-600">
              Your session report has been generated. Check the popup for details.
            </p>
            <Button
              onClick={handleStartNewSession}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              ✨ Start New Session
            </Button>
          </div>
        </motion.div>
      )}
      
      {/* Error Display */}
      {error && (
        <div style={{ 
          position: 'absolute', 
          top: 80, 
          left: '50%', 
          transform: 'translateX(-50%)',
          background: '#fee', 
          color: '#c33', 
          padding: '12px 24px', 
          borderRadius: '8px',
          zIndex: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          ⚠️ {error}
        </div>
      )}
      
      {/* Status Display */}
      {(isRecording || isLoading || isPlayingAudio) && (
        <div style={{ 
          position: 'absolute', 
          top: 80, 
          right: 20, 
          background: 'rgba(255,255,255,0.9)', 
          padding: '8px 16px', 
          borderRadius: '20px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isRecording ? '#ef4444' : isPlayingAudio ? '#3b82f6' : '#f59e0b',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>
            {isRecording ? 'Recording...' : isLoading ? 'Processing...' : 'MINA Speaking...'}
          </span>
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      
      {/* Report Modal */}
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={closeReportModal}
        reportData={reportModal.data}
        sessionId={sessionId}
      />
    </div>
  );
};

export default AIMinaCoach2;