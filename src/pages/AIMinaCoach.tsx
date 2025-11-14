import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, StopCircle, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import ReportModal from '@/components/ReportModal';
import { API_ENDPOINTS } from '@/config/api';
import { useDecrementMinaSession,useCreateSessionDetail } from '@/hooks/useMinaSession';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { motion } from 'framer-motion';
import { useSessionTimer } from '@/hooks/useSessionTimer';


interface Message {
  id: string;
  text: string;
  sender: 'user' | 'mina';
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  input: string;
  isRecording: boolean;
  isLoading: boolean;
  error: string | null;
  showVoiceOverlay: boolean;
  sessionActive: boolean;
  sessionId: string | null;
  isStreaming: boolean;
  voiceMode: boolean;
  voiceMessages: Message[];
  isPlayingAudio: boolean;
}

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

const AIMinaCoach: React.FC = () => {
  const { user } = useAuth();
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        text: "Hello! I'm Mina, your Mind Science Coach. I'm here to help you with self-growth, mindset building, and emotional clarity. How can I support you today?",
        sender: 'mina',
        timestamp: new Date(),
      },
    ],
    input: '',
    isRecording: false,
    isLoading: false,
    error: null,
    showVoiceOverlay: false,
    sessionActive: true,
    sessionId: null,
    isStreaming: false,
    voiceMode: false,
    voiceMessages: [],
    isPlayingAudio: false,
  });
  const { mutate: createSession, isSuccess, error } = useCreateSessionDetail();
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    data: ReportData | null;
  }>({
    isOpen: false,
    data: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isVisualizingRef = useRef<boolean>(false);
  const isRecordingRef = useRef<boolean>(false);
  const microphoneCircleRef = useRef<HTMLDivElement>(null);
  const audioScaleRef = useRef<number>(1);
  const decrementMinaSession = useDecrementMinaSession();

  // Session timer (15 minutes)
  const sessionTimer = useSessionTimer({
    duration: 900, // 15 minutes in seconds
    onTimeUp: () => {
      console.log("⏰ Session time limit reached - auto-ending session");
      handleEndSession();
    },
    autoStart: false,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  // ✅ Auto-focus textarea when component mounts or session becomes active
  useEffect(() => {
    if (state.sessionActive && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [state.sessionActive]);

  // Cleanup: End session if user navigates away while session is active
  useEffect(() => {
    const handleNavigationCleanup = () => {
      if (sessionTimer.isActive && state.sessionActive) {
        console.log("🚪 User navigating away - ending active session");
        handleEndSession();
      }
    };
    
    return handleNavigationCleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionTimer.isActive, state.sessionActive]);

  // Cleanup: End session if user navigates away while session is active
  useEffect(() => {
    return () => {
      if (sessionTimer.isActive && state.sessionActive) {
        console.log("🚪 User navigating away - ending active session");
        handleEndSession();
      }
    };
  }, [sessionTimer.isActive, state.sessionActive]);

  const updateState = (updates: Partial<ChatState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const sendMessage = async (text: string, isSessionEnd: boolean = false) => {
    if (!text.trim()) return;

    // Start timer on first interaction
    if (!sessionTimer.isActive && state.sessionActive) {
      sessionTimer.startTimer();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    // Add user message immediately
    updateState({
      messages: [...state.messages, userMessage],
      input: "",
      isLoading: false,
      isStreaming: true,
      error: null,
    });

    // Create placeholder for MINA's response
    const minaResponseId = (Date.now() + 1).toString();
    const minaResponse: Message = {
      id: minaResponseId,
      text: "",
      sender: "mina",
      timestamp: new Date(),
    };

    // Add empty MINA response to start streaming
    updateState({
      messages: [...state.messages, userMessage, minaResponse],
    });

    try {
      // ✅ Use same /chat endpoint with stream=true
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: userMessage.text,
          is_session_end: isSessionEnd,
          session_id: state.sessionId,
          stream: true,  // ✅ Enable streaming
          user_Id:user.id ,
          user_name: user.name,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.token) {
                  accumulatedText += data.token;
                  
                  // Update MINA's message with accumulated text
                  setState(prevState => ({
                    ...prevState,
                    messages: prevState.messages.map(msg => 
                      msg.id === minaResponseId 
                        ? { ...msg, text: accumulatedText }
                        : msg
                    ),
                  }));
                } else if (data.type === 'complete') {
                  // Finalize the response
                  updateState({
                    isLoading: false,
                    isStreaming: false,
                    sessionActive: data.session_active,
                    sessionId: data.session_id,
                  });

                  // If session ended, generate report
                  if (isSessionEnd || !data.session_active) {
                    await generateUserReport(data.session_id);
                  }

                  // ✅ Refocus textarea after streaming completes
                  setTimeout(() => {
                    textareaRef.current?.focus();
                  }, 100);
                } else if (data.type === 'error') {
                  throw new Error(data.error);
                }
              } catch (parseError) {
                console.warn('Failed to parse SSE data:', parseError);
              }
            }
          }
        }
      }

    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "⚠️ Couldn't reach MINA server. Please try again.",
        sender: "mina",
        timestamp: new Date(),
      };

      updateState({
        messages: [...state.messages, userMessage, errorMessage],
        isLoading: false,
        isStreaming: false,
        error: "Connection error",
      });

      // ✅ Refocus textarea even on error
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  };



  const handleSendClick = () => {
    sendMessage(state.input);
  };

  // ✅ Handle textarea click to ensure focus
  const handleTextareaClick = () => {
    textareaRef.current?.focus();
  };

  const handleEndSession = () => {
    sessionTimer.stopTimer();
    endSession();
  };

  // ✅ Start a completely new session
  const handleStartNewSession = () => {
    sessionTimer.resetTimer();
    updateState({
      messages: [],
      input: "",
      isLoading: false,
      isStreaming: false,
      error: null,
      sessionActive: true,
      sessionId: null,
    });
    
    // Focus textarea for immediate typing
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(state.input);
    }
  };

  const endSession = async () => {
    
    await decrementMinaSession.mutateAsync();
    // Send session end message
    await sendMessage("Thank you for the session. I'd like to end our conversation now.", true);
    
    // Update UI to show session ended
    updateState({
      sessionActive: false,
      input: "",
    });
  };

  const generateUserReport = async (sessionId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_REPORT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            session_id: sessionId,
            user_Id:user.id ,
            user_name: user.name,
         }),
      });

      if (!response.ok) {
        throw new Error(`Report generation failed: ${response.status}`);
      }

      const reportData = await response.json();

      createSession({
        sessionId,
        sessionMode: 'Text-Voice', // or 'Text', 'Video', etc.
        sessionReportJson: JSON.stringify(reportData.report_data),
      });
      
      // Show report modal instead of alert
      setReportModal({
        isOpen: true,
        data: reportData.report_data,
      });
      
    } catch (error) {
      console.error("Error generating report:", error);
      updateState({
        error: "Failed to generate session report"
      });
    }
  };

  const closeReportModal = () => {
    setReportModal({
      isOpen: false,
      data: null,
    });
  };

  const startVoiceRecording = async () => {
    // Just open the voice overlay, don't start recording yet
    updateState({ 
      showVoiceOverlay: true,
      voiceMode: true,
      isRecording: false
    });
  };

  const startAudioVisualization = (stream: MediaStream) => {
    // Create audio context and analyser
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    source.connect(analyser);
    
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    isVisualizingRef.current = true;
    
    // Start visualization loop
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const visualize = () => {
      if (!isVisualizingRef.current || !analyserRef.current) {
        return;
      }
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      
      // Scale from 0.8 to 1.4 based on volume (0-255)
      const scale = 0.8 + (average / 255) * 0.6;
      audioScaleRef.current = scale;
      
      // Directly update DOM instead of React state to avoid re-renders
      if (microphoneCircleRef.current) {
        microphoneCircleRef.current.style.transform = `scale(${scale})`;
      }
      
      animationFrameRef.current = requestAnimationFrame(visualize);
    };
    
    visualize();
  };

  const stopAudioVisualization = () => {
    isVisualizingRef.current = false;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    
    audioContextRef.current = null;
    analyserRef.current = null;
    audioScaleRef.current = 1;
    
    // Reset DOM transform
    if (microphoneCircleRef.current) {
      microphoneCircleRef.current.style.transform = 'scale(1)';
    }
  };

  const toggleRecording = async () => {
    // Use ref to check current recording state to avoid stale closure
    if (!isRecordingRef.current) {
      // Start timer on first interaction
      if (!sessionTimer.isActive && state.sessionActive) {
        sessionTimer.startTimer();
      }

      // Start recording
      try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Start audio visualization
        startAudioVisualization(stream);
        
        // Create MediaRecorder with better audio format
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        const audioChunks: Blob[] = [];
        
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = async () => {
          // Stop audio visualization
          stopAudioVisualization();
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
          
          // Create audio blob with proper MIME type
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          
          // Convert to base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Audio = reader.result?.toString().split(',')[1];
            if (base64Audio) {
              await transcribeAndSendAudio(base64Audio);
            }
          };
          reader.readAsDataURL(audioBlob);
        };
        
        // Start recording with time slices
        mediaRecorder.start(1000); // Record in 1-second chunks
        
        // Store mediaRecorder and stream reference for stopping
        (window as unknown as { currentMediaRecorder?: MediaRecorder; currentStream?: MediaStream }).currentMediaRecorder = mediaRecorder;
        (window as unknown as { currentMediaRecorder?: MediaRecorder; currentStream?: MediaStream }).currentStream = stream;
        
        // Update both state and ref
        isRecordingRef.current = true;
        updateState({ 
          isRecording: true
        });
        
      } catch (error) {
        console.error("Error accessing microphone:", error);
        stopAudioVisualization();
        isRecordingRef.current = false;
        updateState({
          error: "Microphone access denied. Please allow microphone access to use voice features.",
          isRecording: false
        });
      }
    } else {
      // Stop recording
      const mediaRecorder = (window as unknown as { currentMediaRecorder?: MediaRecorder }).currentMediaRecorder;
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      
      stopAudioVisualization();
      
      // Update both state and ref
      isRecordingRef.current = false;
      updateState({ 
        isRecording: false
      });
    }
  };

  const transcribeAndSendAudio = async (base64Audio: string) => {
    try {
      updateState({ isLoading: true, error: "" });

      // Call STT endpoint
      const sttResponse = await fetch(API_ENDPOINTS.STT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audio_data: base64Audio,
          session_id: state.sessionId,
          mime_type: "audio/webm"
        }),
      });

      if (!sttResponse.ok) {
        const errorText = await sttResponse.text();
        throw new Error(`STT error: ${sttResponse.status} - ${errorText}`);
      }

      const sttData = await sttResponse.json();
      
      if (sttData.success && sttData.transcript && sttData.transcript.trim()) {
        const voiceMessage = sttData.transcript.trim();
        
        // Add user voice message to voice conversation only
        const userVoiceMessage: Message = {
          id: Date.now().toString(),
          text: voiceMessage,
          sender: 'user',
          timestamp: new Date(),
        };
        
        // Update only voice messages during voice mode
        setState(prev => ({
          ...prev,
          voiceMessages: [...prev.voiceMessages, userVoiceMessage]
        }));
        
        // Send to MINA and get response
        await sendVoiceMessage(voiceMessage);
      } else {
        console.error("STT failed:", sttData.error || "No transcript received");
        updateState({
          error: sttData.error || "No speech detected. Please try speaking again.",
          isLoading: false
        });
      }

    } catch (error) {
      console.error("Error transcribing audio:", error);
      updateState({
        error: `Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isLoading: false
      });
    }
  };

  const exitVoiceMode = () => {
    // Stop recording if active
    const mediaRecorder = (window as unknown as { currentMediaRecorder?: MediaRecorder }).currentMediaRecorder;
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    
    // Stop audio visualization
    stopAudioVisualization();
    
    // Stop any playing audio
    const currentAudio = (window as unknown as { currentVoiceAudio?: HTMLAudioElement }).currentVoiceAudio;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    
    // Reset recording ref
    isRecordingRef.current = false;
    
    // Transfer all voice messages to main chat when exiting
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, ...prev.voiceMessages],
      voiceMode: false,
      showVoiceOverlay: false,
      isRecording: false,
      isPlayingAudio: false,
      voiceMessages: [] // Clear voice messages after transferring
    }));
  };

  const sendVoiceMessage = async (text: string) => {
    if (!text.trim()) return;

    updateState({ isLoading: true, error: "" });

    try {
      // Send message to MINA using the same endpoint as text chat
      const response = await fetch(API_ENDPOINTS.CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: text,
          is_session_end: false,
          session_id: state.sessionId,
          stream: false,
          user_Id:user.id ,
          user_name: user.name,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.mina_reply && data.mina_reply.trim()) {
        // Add MINA's response to voice conversation only
        const minaVoiceMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.mina_reply.trim(),
          sender: 'mina',
          timestamp: new Date(),
        };
        
        // Update only voice messages during voice mode
        setState(prev => ({
          ...prev,
          voiceMessages: [...prev.voiceMessages, minaVoiceMessage],
          isLoading: false,
          sessionId: data.session_id
        }));

        // Generate TTS audio for MINA's response
        await generateAndPlayAudio(data.mina_reply.trim());
      } else {
        throw new Error("No response received from MINA");
      }

    } catch (error) {
      console.error("Error sending voice message:", error);
      updateState({
        error: `Failed to send voice message: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isLoading: false
      });
    }
  };

  const startPlaybackVisualization = (audio: HTMLAudioElement) => {
    try {
      // Create audio context and analyser for playback
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audio);
      
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyser.connect(audioContext.destination); // Connect to speakers
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      isVisualizingRef.current = true;
      
      // Start visualization loop
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const visualize = () => {
        if (!isVisualizingRef.current || !analyserRef.current) {
          return;
        }
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        
        // Scale from 0.85 to 1.5 based on volume (0-255)
        const scale = 0.85 + (average / 255) * 0.65;
        audioScaleRef.current = scale;
        
        // Directly update DOM instead of React state to avoid re-renders
        if (microphoneCircleRef.current) {
          microphoneCircleRef.current.style.transform = `scale(${scale})`;
        }
        
        animationFrameRef.current = requestAnimationFrame(visualize);
      };
      
      visualize();
    } catch (error) {
      console.error("Error setting up audio visualization:", error);
    }
  };

  const generateAndPlayAudio = async (text: string) => {
    try {
      updateState({ isPlayingAudio: true, error: "" });

      // Call TTS endpoint
      const ttsResponse = await fetch(API_ENDPOINTS.TTS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          session_id: state.sessionId,
          voice: "aura-asteria-en"
        }),
      });

      if (!ttsResponse.ok) {
        const errorText = await ttsResponse.text();
        throw new Error(`TTS error: ${ttsResponse.status} - ${errorText}`);
      }

      const ttsData = await ttsResponse.json();
      
      if (ttsData.success && ttsData.audio_data) {
        // Create audio element and play (use WAV format as returned by Deepgram TTS)
        const audio = new Audio(`data:audio/wav;base64,${ttsData.audio_data}`);
        
        // Store audio reference
        (window as unknown as { currentVoiceAudio?: HTMLAudioElement }).currentVoiceAudio = audio;
        
        audio.onplay = () => {
          // Start visualization when audio starts playing
          startPlaybackVisualization(audio);
        };
        
        audio.onended = () => {
          stopAudioVisualization();
          updateState({ isPlayingAudio: false });
        };
        
        audio.onerror = (e) => {
          console.error("Error playing audio:", e);
          stopAudioVisualization();
          updateState({ 
            isPlayingAudio: false,
            error: "Failed to play audio response"
          });
        };
        
        await audio.play();
      } else {
        console.error("TTS failed:", ttsData.error);
        updateState({ 
          isPlayingAudio: false,
          error: ttsData.error || "Failed to generate speech"
        });
      }

    } catch (error) {
      console.error("Error generating/playing audio:", error);
      stopAudioVisualization();
      updateState({ 
        isPlayingAudio: false,
        error: `Failed to generate speech: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 px-4 py-3 bg-secondary/50 rounded-2xl rounded-bl-md max-w-xs">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm text-muted-foreground">
        {state.isStreaming ? "MINA is typing..." : "Mina is thinking..."}
      </span>
    </div>
  );

  const VoiceOverlay = () => {
    if (!state.showVoiceOverlay) return null;

    return (
      <div className="fixed inset-0 bg-background backdrop-blur-sm z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Voice Conversation</h2>
              <p className="text-sm text-muted-foreground">
                Speak naturally with MINA • Messages saved to chat
              </p>
            </div>
          </div>
          <Button
            onClick={exitVoiceMode}
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            Exit Voice
          </Button>
        </div>

        {/* Voice Interaction Area */}
        <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center max-w-md">
            {/* Animated Microphone Icon with Audio Frequency */}
            <div 
              ref={microphoneCircleRef}
              className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-colors duration-300",
                state.isRecording 
                  ? "bg-red-500/20" 
                  : state.isLoading 
                  ? "bg-blue-500/20 animate-pulse"
                  : state.isPlayingAudio 
                  ? "bg-purple-500/20"
                  : "bg-accent/20"
              )}
              style={{
                transition: (state.isRecording || state.isPlayingAudio) ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out',
                transform: 'scale(1)'
              }}
            >
              <Mic className={cn(
                "w-16 h-16 transition-colors",
                state.isRecording 
                  ? "text-red-500" 
                  : state.isLoading 
                  ? "text-blue-500"
                  : state.isPlayingAudio 
                  ? "text-purple-500"
                  : "text-accent"
              )} />
            </div>
            
            {/* Status Messages */}
            {state.isRecording && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-red-500">Recording...</h3>
                <p className="text-muted-foreground">Listening to your voice</p>
                <p className="text-sm text-muted-foreground mt-2">Click the red button to stop and send</p>
              </div>
            )}
            
            {state.isLoading && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-blue-500">Processing...</h3>
                <p className="text-muted-foreground">MINA is thinking about your message</p>
              </div>
            )}
            
            {state.isPlayingAudio && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-500">MINA Speaking...</h3>
                <p className="text-muted-foreground">Listen to MINA's response</p>
              </div>
            )}
            
            {!state.isRecording && !state.isLoading && !state.isPlayingAudio && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Ready to talk with MINA</h3>
                <p className="text-muted-foreground mb-3">Click the green microphone below to start</p>
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Voice mode active</span>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  💬 Your conversation will be saved to the main chat when you exit
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Voice Controls */}
        <div className="p-4 border-t bg-background/95">
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={toggleRecording}
              size="lg"
              className={cn(
                "rounded-full w-16 h-16 text-white transition-colors",
                state.isRecording 
                  ? "bg-red-500 hover:bg-red-600" 
                  : "bg-green-500 hover:bg-green-600"
              )}
              disabled={state.isLoading || state.isPlayingAudio}
            >
              <Mic className="w-8 h-8" />
            </Button>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-2">
            {state.isRecording ? "Recording... Click to stop and send" :
             state.isLoading ? "MINA is processing..." : 
             state.isPlayingAudio ? "MINA is speaking..." : 
             "Click to start recording"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          
          <div className="flex justify-between items-center">
          
            <div>
              <h1 className="text-2xl font-bold text-primary mb-1">
                Mina – Your Mind Science Coach
              </h1>
              <p className="text-sm text-muted-foreground">
                A safe space for self-growth, mindset building, and emotional clarity
              </p>
              <p className="text-sm text-muted-foreground">
                Sessions left: <span className="text-accent font-bold">{user.minaSessionCount}</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {sessionTimer.isActive && (
                <div className={cn(
                  "text-sm font-semibold px-3 py-1 rounded-full",
                  sessionTimer.timeRemaining <= 60 
                    ? "bg-red-100 text-red-600" 
                    : "bg-primary/10 text-primary"
                )}>
                  ⏱️ {sessionTimer.formattedTime}
                </div>
              )}
              {state.sessionId && state.sessionActive && (
                <div className="text-sm text-muted-foreground">
                  Session: {state.sessionId.slice(-8)} | {user.name}
                </div>
              )}
              {state.sessionActive && user.minaSessionCount > 0 ? (
                <Button
                  onClick={handleEndSession}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-100 hover:text-red-600"
                >
                  End Session
                </Button>
              ) : (
                <div></div>
                // <Button
                //   onClick={handleStartNewSession}
                //   size="sm"
                //   className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                // >
                //   ✨ Start New Session
                // </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-6 py-6 space-y-6 min-h-full flex flex-col">
              <div className="flex-1">
                {state.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex mb-6 items-start",
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.sender === 'mina' && (
                      <Avatar className="w-8 h-8 mr-3 mt-1 shrink-0">
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          <Brain className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={cn(
                        "max-w-xs lg:max-w-lg px-4 py-3 rounded-2xl relative",
                        "shadow-sm transition-all duration-200 hover:shadow-md",
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-md ml-12'
                          : 'bg-muted/60 text-foreground rounded-bl-md'
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text || (message.sender === 'mina' && state.isStreaming ? '...' : '')}
                      </p>
                      <div className="mt-2">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(state.isLoading || state.isStreaming) && (
                  <div className="flex justify-start mb-6 items-start">
                    <Avatar className="w-8 h-8 mr-3 mt-1 shrink-0">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <Brain className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <TypingIndicator />
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Input Area */}
      {/* <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur-sm sticky bottom-0">
        <div className="px-6 py-4">
          {state.error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {state.error}
            </div>
          )}
          
          {!state.sessionActive ? (
            <div className="text-center py-8">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 max-w-md mx-auto">
                <div className="text-4xl mb-4">🪷</div>
                <p className="text-lg font-medium mb-2">Session Ended</p>
                <p className="text-sm mb-4">Your session report has been generated. Check the popup for details.</p>
                <Button
                  onClick={handleStartNewSession}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  ✨ Start New Session
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-end space-x-3 max-w-4xl mx-auto">
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={state.input}
                  onChange={(e) => updateState({ input: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(state.input);
                    }
                  }}
                  onClick={handleTextareaClick}
                  placeholder="Share what's on your mind..."
                  className="w-full min-h-[44px] max-h-32 px-4 py-3 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring resize-none overflow-hidden"
                  disabled={state.isLoading || state.isStreaming}
                  rows={1}
                  style={{ 
                    height: '44px',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = '44px';
                    const scrollHeight = target.scrollHeight;
                    if (scrollHeight > 44) {
                      target.style.height = Math.min(scrollHeight, 128) + 'px';
                    }
                  }}
                />
              </div>
              
              <Button
                onClick={handleSendClick}
                disabled={!state.input.trim() || state.isLoading || state.isStreaming}
                className="rounded-xl px-4 py-3 h-11 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
              
              {!state.voiceMode && (
                <Button
                  onClick={startVoiceRecording}
                  variant="outline"
                  className="rounded-xl px-4 py-3 h-11 border-accent text-accent hover:bg-accent hover:text-accent-foreground shrink-0"
                  disabled={state.isLoading || state.isStreaming}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div> */}

{/* Input Area */}
<div className="shrink-0 border-t border-border bg-background/95 backdrop-blur-sm sticky bottom-0">
  <div className="px-6 py-4">
    {state.error && (
      <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {state.error}
      </div>
    )}

    {/* Check if user has remaining sessions */}
    {user?.minaSessionCount > 0 ? (
      !state.sessionActive ? (
        <div className="text-center py-8">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 max-w-md mx-auto">
            <div className="text-4xl mb-4">🪷</div>
            <p className="text-lg font-medium mb-2">Session Ended</p>
            <p className="text-sm mb-4">
              Your session report has been generated. Check the popup for details.
            </p>
            <Button
              onClick={handleStartNewSession}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              ✨ Start New Session
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-end space-x-3 max-w-4xl mx-auto">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={state.input}
              onChange={(e) => updateState({ input: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(state.input);
                }
              }}
              onClick={handleTextareaClick}
              placeholder="Share what's on your mind..."
              className="w-full min-h-[44px] max-h-32 px-4 py-3 rounded-xl border border-input bg-background/50 focus:outline-none focus:ring-2 focus:ring-ring resize-none overflow-hidden"
              disabled={state.isLoading || state.isStreaming}
              rows={1}
              style={{
                height: '44px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = '44px';
                const scrollHeight = target.scrollHeight;
                if (scrollHeight > 44) {
                  target.style.height = Math.min(scrollHeight, 128) + 'px';
                }
              }}
            />
          </div>

          <Button
            onClick={handleSendClick}
            disabled={!state.input.trim() || state.isLoading || state.isStreaming}
            className="rounded-xl px-4 py-3 h-11 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>

          {!state.voiceMode && (
            <Button
              onClick={startVoiceRecording}
              variant="outline"
              className="rounded-xl px-4 py-3 h-11 border-accent text-accent hover:bg-accent hover:text-accent-foreground shrink-0"
              disabled={state.isLoading || state.isStreaming}
            >
              <Mic className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    ) : (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-lg font-medium mb-2 text-red-600">Mina Session Limit Reached</p>
          <p className="text-sm text-gray-600 mb-4">
            You have used all your free available sessions. Please contact support for Paid Sessions.
          </p>
        </div>
      </div>
    )}
  </div>
</div>


      <VoiceOverlay />
      
      {/* Report Modal */}
      <ReportModal
        isOpen={reportModal.isOpen}
        onClose={closeReportModal}
        reportData={reportModal.data}
        sessionId={state.sessionId}
      />
    </div>
  );
};

export default AIMinaCoach;