import { useEffect, useState, useRef, useCallback } from 'react';

interface UseIdleTimerOptions {
  timeout: number;
  onIdle: () => void;
  onActive?: () => void;
  events?: string[];
  debounce?: number;
}

export const useIdleTimer = ({
  timeout,
  onIdle,
  onActive,
  events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'wheel'],
  debounce = 200
}: UseIdleTimerOptions) => {
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef(Date.now());
  const timeoutTrackerRef = useRef<NodeJS.Timeout | null>(null);

  const handleActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (isIdle) {
      setIsIdle(false);
      onActive?.();
    }
    
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
      onIdle();
    }, timeout);
  }, [isIdle, timeout, onIdle, onActive]);

  // Create a debounced version of the activity handler
  const debouncedHandler = useCallback(() => {
    if (timeoutTrackerRef.current) {
      clearTimeout(timeoutTrackerRef.current);
    }
    
    timeoutTrackerRef.current = setTimeout(() => {
      handleActivity();
    }, debounce);
  }, [handleActivity, debounce]);

  useEffect(() => {
    // Set up initial timer
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
      onIdle();
    }, timeout);
    
    // Set up event listeners for user activity
    const attachEvents = () => {
      events.forEach(event => {
        window.addEventListener(event, debouncedHandler);
      });
    };
    
    const detachEvents = () => {
      events.forEach(event => {
        window.removeEventListener(event, debouncedHandler);
      });
    };
    
    attachEvents();
    
    // Clean up event listeners and timers
    return () => {
      detachEvents();
      
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      
      if (timeoutTrackerRef.current) {
        clearTimeout(timeoutTrackerRef.current);
      }
    };
  }, [timeout, onIdle, events, debouncedHandler]);

  // Public methods
  const reset = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    
    lastActivityRef.current = Date.now();
    setIsIdle(false);
    
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
      onIdle();
    }, timeout);
  }, [timeout, onIdle]);
  
  const getLastActivity = useCallback(() => {
    return lastActivityRef.current;
  }, []);
  
  const getElapsedTime = useCallback(() => {
    return Date.now() - lastActivityRef.current;
  }, []);
  
  const getRemainingTime = useCallback(() => {
    return Math.max(0, timeout - getElapsedTime());
  }, [timeout, getElapsedTime]);

  return {
    isIdle,
    reset,
    getLastActivity,
    getElapsedTime,
    getRemainingTime
  };
};