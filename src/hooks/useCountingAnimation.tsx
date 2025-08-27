import { useEffect, useState } from 'react';

interface UseCountingAnimationProps {
  target: number;
  duration?: number;
  delay?: number;
  suffix?: string;
}

export const useCountingAnimation = ({ 
  target, 
  duration = 3000, 
  delay = 0,
  suffix = ''
}: UseCountingAnimationProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const remaining = Math.max(endTime - now, 0);
      const progress = Math.min((duration - remaining) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * target);
      
      setCount(currentCount);

      if (remaining > 0) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(updateCount);
  }, [target, duration, isVisible]);

  return `${count.toLocaleString()}${suffix}`;
};