import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

// Pages
import KioskWelcome from './kiosk/KioskWelcome';
import KioskRegistration from './kiosk/KioskRegistration';
import KioskComplete from './kiosk/KioskComplete';

// Components
import OfflineBanner from '../components/common/OfflineBanner';
import ToastManager from '../components/common/ToastManager';

// Services & Hooks
import { useIdleTimer } from '../hooks/useIdleTimer.ts';
import { useManifest } from '../hooks/useManifest.ts';
import { clearSession, initializeSession } from '../services/sessionManager.ts';

// Utils & Providers
import { I18nProvider } from '../utils/i18n.tsx';
import { ThemeProvider } from '../contexts/ThemeContext';
import { DeviceContextProvider } from '../contexts/DeviceContext.tsx';
import { SessionProvider } from '../contexts/SessionContext.tsx';

// Icons
import { Globe, CheckCircle2 } from 'lucide-react';

// Constants
const IDLE_TIMEOUT = 120_000; // 120 seconds in milliseconds

// Language Configuration
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', region: 'US' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', region: 'IN' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩', region: 'BD' },
  { code: 'as', name: 'অসমীয়া', flag: '🇮🇳', region: 'IN' },
  { code: 'ne', name: 'नेपाली', flag: '🇳🇵', region: 'NP' },
  { code: 'ta', name: 'தমிழ்', flag: '🇮🇳', region: 'IN' }
];

// Global Language Selector Component
const GlobalLanguageSelector: React.FC<{
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}> = ({ selectedLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];
  const location = useLocation();

  // Hide on welcome page since it has its own language selector
  if (location.pathname === '/registration/welcome' || location.pathname === '/welcome') {
    return null;
  }

  return (
    <div className="fixed top-6 left-6 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center space-x-3 shadow-lg hover:shadow-xl hover:bg-white/95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          aria-label="Select language"
          aria-expanded={isOpen}
        >
          <span className="text-lg">{selectedLang.flag}</span>
          <span className="font-medium text-gray-700">{selectedLang.name}</span>
          <Globe className="w-4 h-4 text-gray-500" />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-w-48 animate-fadeIn z-50">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-blue-50 transition-colors ${
                  selectedLanguage === language.code ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
                {selectedLanguage === language.code && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600 ml-auto" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ErrorFallback component - Shown when app crashes
 */
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({ 
  resetErrorBoundary 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center p-6">
    <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg w-full text-center">
      <div className="text-red-500 text-5xl mb-6">⚠️</div>
      <h1 className="text-2xl font-semibold mb-4">Oops! Please restart the registration.</h1>
      <p className="text-gray-600 mb-8">
        We encountered a technical issue. Your data is safe.
      </p>
      <button
        onClick={resetErrorBoundary}
        className="bg-blue-600 text-white font-semibold px-6 py-4 rounded-xl text-lg w-full hover:bg-blue-700 transition-colors"
        aria-label="Restart registration"
      >
        Restart Registration
      </button>
    </div>
  </div>
);

/**
 * RegistrationKiosk - Main app shell for the kiosk registration system
 * Handles routing, global providers, idle timeout, offline detection, and global language state
 */
const RegistrationKiosk: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('selectedLanguage') || 'en';
  });
  const location = useLocation();
  
  // Load app manifest containing translations, policy notices and destination data
  const { isLoading, error } = useManifest();
  
  // Initialize device ID and session on mount
  useEffect(() => {
    const deviceId = window.localStorage.getItem('kioskDeviceId') || `kiosk-${Date.now()}`;
    
    // Store device ID if not already set
    if (!window.localStorage.getItem('kioskDeviceId')) {
      window.localStorage.setItem('kioskDeviceId', deviceId);
    }
    
    // Initialize session with device ID
    initializeSession(deviceId);
    
    // Clean up session on unmount
    return () => clearSession();
  }, []);

  // Handle global language change
  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    localStorage.setItem('selectedLanguage', languageCode);
    
    // Apply language to document for better accessibility
    document.documentElement.lang = languageCode;
    
    // Trigger any i18n updates here if needed
    // dispatch({ type: 'SET_LANGUAGE', payload: languageCode });
  };
  
  // Set up idle timeout to reset session after inactivity
  const { isIdle } = useIdleTimer({
    timeout: IDLE_TIMEOUT,
    onIdle: () => {
      // Only reset to welcome screen if not already there
      if (location.pathname !== '/registration/welcome') {
        clearSession();
        window.location.href = '/registration/welcome';
      }
    },
    // These actions reset the idle timer
    events: ['mousedown', 'touchstart', 'keydown']
  });
  
  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Announce route changes to screen readers
  useEffect(() => {
    // Create a virtual announcement element for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    document.body.appendChild(announcement);
    
    // Extract page name from URL path for announcement
    const pageName = location.pathname.split('/').pop();
    if (pageName) {
      let pageTitle = '';
      switch (pageName) {
        case 'welcome':
          pageTitle = 'Welcome to Tourist Registration';
          break;
        case 'register':
          pageTitle = 'Tourist Registration Form';
          break;
        case 'complete':
          pageTitle = 'Registration Complete';
          break;
        default:
          pageTitle = 'Tourist Registration';
      }
      
      announcement.textContent = pageTitle;
    }
    
    return () => {
      document.body.removeChild(announcement);
    };
  }, [location]);

  // Show loading state while manifest is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center">
        <div className="bg-white bg-opacity-10 rounded-full p-4">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" 
               role="status" aria-label="Loading">
          </div>
        </div>
      </div>
    );
  }

  // Show error state if manifest failed to load
  if (error) {
    return <ErrorFallback 
      error={error as Error} 
      resetErrorBoundary={() => window.location.reload()} 
    />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <I18nProvider>
        <ThemeProvider>
          <DeviceContextProvider>
            <SessionProvider>
              {/* Main container with Apple-style gradient background */}
              <div className="min-h-screen bg-gradient-to-br from-blue-600 to-emerald-600 font-['SF_Pro_Display',system-ui,sans-serif]">
                {/* Global Language Selector - Sticky throughout the flow */}
                <GlobalLanguageSelector 
                  selectedLanguage={selectedLanguage} 
                  onLanguageChange={handleLanguageChange} 
                />
                
                {/* Offline banner - shown only when offline */}
                {isOffline && <OfflineBanner />}
                
                {/* Toast notification container */}
                <ToastManager />
                
                {/* Main route content */}
                <Routes>
                  <Route path="/welcome" element={<KioskWelcome />} />
                  <Route path="/register" element={<KioskRegistration />} />
                  <Route path="/complete" element={<KioskComplete />} />
                  <Route path="*" element={<Navigate to="/registration/welcome" replace />} />
                </Routes>
                
                {/* Idle indicator - only visible in dev mode */}
                {process.env.NODE_ENV === 'development' && isIdle && (
                  <div className="fixed bottom-2 right-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
                    Idle - {Math.floor(IDLE_TIMEOUT / 1000)}s timeout
                  </div>
                )}
                
                {/* Kiosk device ID - only visible in dev mode */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="fixed bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    {window.localStorage.getItem('kioskDeviceId')}
                  </div>
                )}
                
                {/* Language debug info - only visible in dev mode */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="fixed bottom-8 left-2 bg-purple-500 bg-opacity-80 text-white text-xs px-2 py-1 rounded-full">
                    Lang: {selectedLanguage}
                  </div>
                )}
              </div>
            </SessionProvider>
          </DeviceContextProvider>
        </ThemeProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
};

export default RegistrationKiosk;