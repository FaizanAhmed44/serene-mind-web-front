import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn Button

type Props = {
  onTherapistReply: (reply: string) => void;
};

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  isFinal: boolean;
  [Symbol.iterator](): IterableIterator<SpeechRecognitionAlternative>;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
  item(index: number): SpeechRecognitionResult;
  [Symbol.iterator](): IterableIterator<SpeechRecognitionResult>;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const VoiceTherapy: React.FC<Props> = ({ onTherapistReply }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionCtor = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognitionCtor) {
      const rec = new SpeechRecognitionCtor() as SpeechRecognition;
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          // Send to backend for reply (replace with your API)
          fetch('/api/therapy-reply', { // Or your endpoint
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: finalTranscript }),
          })
            .then(res => res.json())
            .then(data => onTherapistReply(data.reply))
            .catch(err => console.error('Backend error:', err));
        }
      };

      setRecognition(rec);
    }
  }, []);

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening);
    }
  };

  return (
    <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 10 }}>
      <Button onClick={toggleListening} variant={isListening ? 'destructive' : 'default'}>
        {isListening ? 'Stop Listening' : 'Start Talking'}
      </Button>
    </div>
  );
};

export default VoiceTherapy;