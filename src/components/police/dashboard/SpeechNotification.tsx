import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface SpeechNotificationProps {
  enabled: boolean;
  alerts: Array<{
    id: string;
    type: string;
    message: string;
    severity: string;
    touristId: string;
    location: string;
  }>;
}

const SpeechNotification: React.FC<SpeechNotificationProps> = ({ enabled, alerts }) => {
  const [message, setMessage] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [queue, setQueue] = useState<string[]>([]);
  const processedAlerts = useRef<Set<string>>(new Set());
  
  // Process new high priority alerts and add them to the speech queue
  useEffect(() => {
    if (!enabled) return;
    
    const highPriorityAlerts = alerts
      .filter(alert => alert.severity === 'high' && !processedAlerts.current.has(alert.id));
    
    if (highPriorityAlerts.length === 0) return;
    
    // Add to queue and mark as processed
    highPriorityAlerts.forEach(alert => {
      const speechText = `High priority alert: ${alert.type} at ${alert.location}. ${alert.message}`;
      setQueue(prev => [...prev, speechText]);
      processedAlerts.current.add(alert.id);
    });
    
  }, [enabled, alerts]);
  
  // Process the speech queue
  const processSpeechQueue = useCallback(() => {
    if (!enabled || queue.length === 0 || isPlaying) return;
    
    const nextMessage = queue[0];
    setMessage(nextMessage);
    setIsPlaying(true);
    
    // Use the SpeechSynthesis API
    const utterance = new SpeechSynthesisUtterance(nextMessage);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    utterance.onend = () => {
      setIsPlaying(false);
      setQueue(prev => prev.slice(1)); // Remove the played message
      setMessage("");
    };
    
    window.speechSynthesis.speak(utterance);
    
  }, [enabled, queue, isPlaying]);
  
  // Process the queue whenever it changes
  useEffect(() => {
    processSpeechQueue();
  }, [queue, isPlaying, processSpeechQueue]);
  
  if (!enabled || !message) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 max-w-lg"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center">
        <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
        <p className="text-sm">{message}</p>
      </div>
    </motion.div>
  );
};

export default SpeechNotification;