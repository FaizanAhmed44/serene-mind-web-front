import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSessionTimerProps {
  duration?: number; // Duration in seconds (default: 15 minutes = 900 seconds)
  onTimeUp: () => void;
  autoStart?: boolean;
}

export const useSessionTimer = ({ 
  duration = 900, 
  onTimeUp,
  autoStart = false 
}: UseSessionTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isActive, setIsActive] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCalledTimeUpRef = useRef(false);

  const startTimer = useCallback(() => {
    setIsActive(true);
    hasCalledTimeUpRef.current = false;
  }, []);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    setTimeRemaining(duration);
    setIsActive(false);
    hasCalledTimeUpRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [duration]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Timer countdown logic
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeRemaining === 0 && !hasCalledTimeUpRef.current) {
      hasCalledTimeUpRef.current = true;
      stopTimer();
      onTimeUp();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining, onTimeUp, stopTimer]);

  // Cleanup on unmount (page navigation)
  useEffect(() => {
    return () => {
      if (isActive && intervalRef.current) {
        clearInterval(intervalRef.current);
        // Trigger session end if timer was active
        if (!hasCalledTimeUpRef.current && timeRemaining < duration) {
          onTimeUp();
        }
      }
    };
  }, [isActive, duration, timeRemaining, onTimeUp]);

  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isActive,
    startTimer,
    stopTimer,
    resetTimer,
  };
};
