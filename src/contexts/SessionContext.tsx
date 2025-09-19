import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SessionData {
  id: string;
  startTime: number;
  deviceId: string;
  languagePreference?: string;
}

interface SessionContextType {
  session: SessionData | null;
  setLanguagePreference: (language: string) => void;
  clearSession: () => void;
  isAuthenticated: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    // Initialize or restore session
    const storedSession = sessionStorage.getItem('kioskSession');
    
    if (storedSession) {
      try {
        setSession(JSON.parse(storedSession));
      } catch (error) {
        console.error('Error parsing session:', error);
        // If session data is corrupted, create a new one
        initializeNewSession();
      }
    } else {
      initializeNewSession();
    }
    
    // Set up cleanup on window unload
    const handleUnload = () => {
      // Keep session data for 5 minutes max after tab close
      const expiryTime = Date.now() + 5 * 60 * 1000;
      
      if (session) {
        localStorage.setItem('kioskLastSession', JSON.stringify({
          ...session,
          expiryTime
        }));
      }
    };
    
    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  // Effect to persist session updates to sessionStorage
  useEffect(() => {
    if (session) {
      sessionStorage.setItem('kioskSession', JSON.stringify(session));
    } else {
      sessionStorage.removeItem('kioskSession');
    }
  }, [session]);

  const initializeNewSession = () => {
    const deviceId = localStorage.getItem('kioskDeviceId') || `kiosk-${Date.now()}`;
    
    const newSession: SessionData = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      startTime: Date.now(),
      deviceId
    };
    
    setSession(newSession);
  };

  const setLanguagePreference = (language: string) => {
    if (session) {
      setSession({
        ...session,
        languagePreference: language
      });
    }
  };

  const clearSession = () => {
    sessionStorage.removeItem('kioskSession');
    setSession(null);
    initializeNewSession();
  };

  const value = {
    session,
    setLanguagePreference,
    clearSession,
    isAuthenticated: !!session
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  
  return context;
};