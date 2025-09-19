import { useState, useEffect, useCallback } from 'react';

interface ChatState {
  isOpen: boolean;
  hasNewMessage: boolean;
  currentLanguage: string;
}

export const useChatWidget = (initialLanguage: string = 'en') => {
  const [chatState, setChatState] = useState<ChatState>({
    isOpen: false,
    hasNewMessage: false,
    currentLanguage: initialLanguage
  });

  // Simulate new message notification
  useEffect(() => {
    const timer = setTimeout(() => {
      setChatState(prev => ({ ...prev, hasNewMessage: true }));
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleChat = useCallback(() => {
    setChatState(prev => ({ 
      ...prev, 
      isOpen: !prev.isOpen,
      hasNewMessage: prev.isOpen ? prev.hasNewMessage : false // Clear notification when opening
    }));
  }, []);

  const changeLanguage = useCallback((language: string) => {
    setChatState(prev => ({ 
      ...prev, 
      currentLanguage: language,
      hasNewMessage: false // Clear notification on language change
    }));
  }, []);

  const clearNewMessage = useCallback(() => {
    setChatState(prev => ({ ...prev, hasNewMessage: false }));
  }, []);

  return {
    chatState,
    toggleChat,
    changeLanguage,
    clearNewMessage
  };
};

export default useChatWidget;