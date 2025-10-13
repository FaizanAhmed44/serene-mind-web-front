import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, StopCircle, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import ReportModal from '@/components/ReportModal';

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

  const [reportModal, setReportModal] = useState<{
    isOpen: boolean;
    data: ReportData | null;
  }>({
    isOpen: false,
    data: null,
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceMessagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollVoiceToBottom = () => {
    voiceMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  // Auto-scroll voice messages when they change or when loading/audio state changes
  useEffect(() => {
    if (state.voiceMode) {
      scrollVoiceToBottom();
    }
  }, [state.voiceMessages, state.voiceMode, state.isLoading, state.isPlayingAudio]);

  // ✅ Auto-focus textarea when component mounts or session becomes active
  useEffect(() => {
    if (state.sessionActive && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [state.sessionActive]);

  const updateState = (updates: Partial<ChatState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const sendMessage = async (text: string, isSessionEnd: boolean = false) => {
    if (!text.trim()) return;

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
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: userMessage.text,
          is_session_end: isSessionEnd,
          session_id: state.sessionId,
          stream: true,  // ✅ Enable streaming
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
    endSession();
  };

  // ✅ Start a completely new session
  const handleStartNewSession = () => {
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
      const response = await fetch(`http://localhost:8000/generate-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error(`Report generation failed: ${response.status}`);
      }

      const reportData = await response.json();
      
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

  const toggleRecording = async () => {
    if (!state.isRecording) {
      // Start recording
      try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Create MediaRecorder with better audio format
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        const audioChunks: Blob[] = [];
        
        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = async () => {
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
        
        // Store mediaRecorder reference for stopping
        (window as unknown as { currentMediaRecorder?: MediaRecorder }).currentMediaRecorder = mediaRecorder;
        
        updateState({ 
          isRecording: true
        });
        
      } catch (error) {
        console.error("Error accessing microphone:", error);
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
      
      updateState({ 
        isRecording: false
      });
    }
  };

  const transcribeAndSendAudio = async (base64Audio: string) => {
    try {
      updateState({ isLoading: true, error: "" });

      // Call STT endpoint
      const sttResponse = await fetch("http://localhost:8000/stt", {
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
        
        // Add user voice message to BOTH voice conversation AND main messages
        const userVoiceMessage: Message = {
          id: Date.now().toString(),
          text: voiceMessage,
          sender: 'user',
          timestamp: new Date(),
        };
        
        // Update both voice messages and main messages in a single state update
        setState(prev => ({
          ...prev,
          voiceMessages: [...prev.voiceMessages, userVoiceMessage],
          messages: [...prev.messages, userVoiceMessage]
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
    
    updateState({ 
      voiceMode: false,
      showVoiceOverlay: false,
      isRecording: false,
      isPlayingAudio: false,
      voiceMessages: [] // Clear voice messages since they're already in main chat
    });
  };

  const sendVoiceMessage = async (text: string) => {
    if (!text.trim()) return;

    updateState({ isLoading: true, error: "" });

    try {
      // Send message to MINA using the same endpoint as text chat
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: text,
          is_session_end: false,
          session_id: state.sessionId,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.mina_reply && data.mina_reply.trim()) {
        // Add MINA's response to BOTH voice conversation AND main messages
        const minaVoiceMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.mina_reply.trim(),
          sender: 'mina',
          timestamp: new Date(),
        };
        
        // Update both voice messages and main messages in a single state update
        setState(prev => ({
          ...prev,
          voiceMessages: [...prev.voiceMessages, minaVoiceMessage],
          messages: [...prev.messages, minaVoiceMessage],
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

  const generateAndPlayAudio = async (text: string) => {
    try {
      updateState({ isPlayingAudio: true, error: "" });

      // Call TTS endpoint
      const ttsResponse = await fetch("http://localhost:8000/tts", {
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
        
        audio.onended = () => {
          updateState({ isPlayingAudio: false });
        };
        
        audio.onerror = (e) => {
          console.error("Error playing audio:", e);
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

        {/* Voice Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {state.voiceMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                <Mic className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-medium mb-2">Ready to talk?</h3>
              <p className="text-muted-foreground">Click the green microphone below to start recording</p>
              <p className="text-xs text-muted-foreground mt-2">Your conversation will be saved to the main chat</p>
            </div>
          ) : (
            state.voiceMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-xs lg:max-w-md px-4 py-3 rounded-2xl",
                    message.sender === 'user'
                      ? "bg-accent text-accent-foreground rounded-br-md"
                      : "bg-secondary text-secondary-foreground rounded-bl-md"
                  )}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-semibold">
                      {message.sender === 'user' ? 'You' : 'MINA'}
                    </span>
                  </div>
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      <span className="text-xs opacity-70">Saved</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Loading indicator */}
          {state.isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 px-4 py-3 bg-secondary/50 rounded-2xl rounded-bl-md max-w-xs">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">MINA is thinking...</span>
              </div>
            </div>
          )}

          {/* Audio playing indicator */}
          {state.isPlayingAudio && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 px-4 py-3 bg-accent/20 rounded-2xl rounded-bl-md max-w-xs">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-accent">MINA is speaking...</span>
              </div>
            </div>
          )}
          
          {/* Scroll anchor for auto-scroll */}
          <div ref={voiceMessagesEndRef} />
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
            </div>
            <div className="flex items-center space-x-3">
              {state.sessionId && state.sessionActive && (
                <div className="text-sm text-muted-foreground">
                  Session: {state.sessionId.slice(-8)}
                </div>
              )}
              {state.sessionActive ? (
                <Button
                  onClick={handleEndSession}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
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
      <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur-sm sticky bottom-0">
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