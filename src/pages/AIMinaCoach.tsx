import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
    <div className="flex items-center space-x-3 px-6 py-4 bg-gray-50 rounded-2xl max-w-xl">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-sm text-gray-600">Mina is thinking...</span>
    </div>
  );

  const VoiceOverlay = () => {
    if (!state.showVoiceOverlay) return null;

    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-8">
          <div className={cn(
            "w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center",
            "transition-all duration-300",
            state.isRecording && "scale-110 bg-purple-200"
          )}>
            <div className={cn(
              "w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center",
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
                  className="w-1 bg-purple-600 rounded-full animate-pulse"
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
    <div className="min-h-screen bg-slate-50">
      {/* Main Container */}
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="text-center py-12 px-8">
          <div className="mb-6">
            <Avatar className="w-16 h-16 mx-auto mb-4 ring-2 ring-purple-200">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-xl font-semibold">
                M
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-3xl font-light text-gray-800 mb-2">
            Good Evening
          </h1>
          <p className="text-gray-500 text-lg">
            I'm Mina, your Mind Science Coach. How can I support you today?
          </p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 px-8 pb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col">
            <ScrollArea className="flex-1 p-8" ref={scrollAreaRef}>
              <div className="space-y-8">
                {state.messages.slice(1).map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-4",
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.sender === 'mina' && (
                      <Avatar className="w-10 h-10 ring-2 ring-purple-100 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-sm font-semibold">
                          M
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div
                      className={cn(
                        "max-w-xl px-6 py-4 rounded-2xl",
                        message.sender === 'user'
                          ? 'bg-purple-600 text-white ml-12'
                          : 'bg-gray-50 text-gray-800'
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="w-10 h-10 shrink-0" />
                    )}
                  </div>
                ))}
                
                {state.isLoading && (
                  <div className="flex gap-4 justify-start">
                    <Avatar className="w-10 h-10 ring-2 ring-purple-100 shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-sm font-semibold">
                        M
                      </AvatarFallback>
                    </Avatar>
                    <TypingIndicator />
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-8 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Input
                    value={state.input}
                    onChange={(e) => updateState({ input: e.target.value })}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask whatever you want"
                    className="h-12 px-6 rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-200 focus:border-purple-300 text-sm"
                    disabled={state.isLoading}
                  />
                </div>
                
                <Button
                  onClick={handleSendClick}
                  disabled={!state.input.trim() || state.isLoading}
                  className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
                
                <Button
                  onClick={startVoiceRecording}
                  variant="outline"
                  className="h-12 w-12 rounded-full border-gray-200 text-gray-600 hover:bg-gray-50 p-0"
                  disabled={state.isLoading}
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VoiceOverlay />
    </div>
  );
};

export default AIMinaCoach;