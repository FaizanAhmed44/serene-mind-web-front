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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const startVoiceRecording = () => {
    updateState({ 
      isRecording: true, 
      showVoiceOverlay: true 
    });
  };

  const stopVoiceRecording = () => {
    updateState({ 
      isRecording: false, 
      showVoiceOverlay: false 
    });
    
    // Simulate voice-to-text conversion
    setTimeout(() => {
      sendMessage("I've been feeling overwhelmed lately and could use some guidance on managing my stress.");
    }, 500);
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
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-8">
          <div className={cn(
            "w-32 h-32 rounded-full bg-accent/20 flex items-center justify-center",
            "transition-all duration-300",
            state.isRecording && "scale-110 bg-accent/30"
          )}>
            <div className={cn(
              "w-20 h-20 rounded-full bg-accent flex items-center justify-center",
              state.isRecording && "animate-pulse"
            )}>
              <Mic className="w-10 h-10 text-white" />
            </div>
          </div>
          
          {state.isRecording && (
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-accent rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 40 + 20}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}

          <Button
            onClick={stopVoiceRecording}
            variant="destructive"
            size="lg"
            className="rounded-full px-8"
          >
            <StopCircle className="w-5 h-5 mr-2" />
            Stop Recording
          </Button>
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
              
              <Button
                onClick={startVoiceRecording}
                variant="outline"
                className="rounded-xl px-4 py-3 h-11 border-accent text-accent hover:bg-accent hover:text-accent-foreground shrink-0"
                disabled={state.isLoading || state.isStreaming}
              >
                <Mic className="w-4 h-4" />
              </Button>
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