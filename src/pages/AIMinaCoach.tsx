import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

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
}

const AIMinaCoach: React.FC = () => {
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
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const updateState = (updates: Partial<ChatState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    updateState({
      messages: [...state.messages, userMessage],
      input: '',
      isLoading: true,
    });

    // Simulate Mina's response
    setTimeout(() => {
      const minaResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I hear what you're saying, and I want you to know that your feelings are completely valid. Let's explore this together. What do you think might be the underlying belief or pattern that's contributing to this experience?",
        sender: 'mina',
        timestamp: new Date(),
      };

      updateState({
        messages: [...state.messages, userMessage, minaResponse],
        isLoading: false,
      });
    }, 2000);
  };

  const handleSendClick = () => {
    sendMessage(state.input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(state.input);
    }
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
      <span className="text-sm text-muted-foreground">Mina is thinking...</span>
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
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-primary mb-1">
            Mina – Your Mind Science Coach
          </h1>
          <p className="text-sm text-muted-foreground">
            A safe space for self-growth, mindset building, and emotional clarity
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 relative">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="px-6 py-4 space-y-4">
            {state.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    "max-w-xs lg:max-w-md px-4 py-3 rounded-2xl",
                    "shadow-sm transition-all duration-200 hover:shadow-md",
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-secondary/80 text-secondary-foreground rounded-bl-md'
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
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
            
            {state.isLoading && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                value={state.input}
                onChange={(e) => updateState({ input: e.target.value })}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="pr-12 py-3 rounded-xl border-input bg-background focus:ring-2 focus:ring-ring"
                disabled={state.isLoading}
              />
            </div>
            
            <Button
              onClick={handleSendClick}
              disabled={!state.input.trim() || state.isLoading}
              className="rounded-xl px-4 py-3 h-auto"
            >
              <Send className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={startVoiceRecording}
              variant="outline"
              className="rounded-xl px-4 py-3 h-auto border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              disabled={state.isLoading}
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <VoiceOverlay />
    </div>
  );
};

export default AIMinaCoach;