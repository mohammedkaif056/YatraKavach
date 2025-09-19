import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DeviceInfo {
  deviceId: string;
  isKiosk: boolean;
  isTouchEnabled: boolean;
  screenSize: {
    width: number;
    height: number;
  };
  orientation: 'portrait' | 'landscape';
  networkType: string | null;
  browserInfo: string;
  hasCamera: boolean;
  hasMicrophone: boolean;
}

interface DeviceContextType {
  deviceInfo: DeviceInfo;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // Get stored deviceId or generate new one
    const deviceId = localStorage.getItem('kioskDeviceId') || `kiosk-${Date.now()}`;
    
    // Store deviceId if it doesn't exist
    if (!localStorage.getItem('kioskDeviceId')) {
      localStorage.setItem('kioskDeviceId', deviceId);
    }
    
    // Initial device detection
    return {
      deviceId,
      isKiosk: detectKioskMode(),
      isTouchEnabled: 'ontouchstart' in window,
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      networkType: getNetworkType(),
      browserInfo: getBrowserInfo(),
      hasCamera: false, // Will be updated in useEffect
      hasMicrophone: false // Will be updated in useEffect
    };
  });

  useEffect(() => {
    // Update device info on resize
    const handleResize = () => {
      setDeviceInfo(prev => ({
        ...prev,
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      }));
    };

    // Update device info on network change
    const handleNetworkChange = () => {
      setDeviceInfo(prev => ({
        ...prev,
        networkType: getNetworkType()
      }));
    };

    // Check for media devices
    const checkMediaDevices = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          
          const hasCamera = devices.some(device => device.kind === 'videoinput');
          const hasMicrophone = devices.some(device => device.kind === 'audioinput');
          
          setDeviceInfo(prev => ({
            ...prev,
            hasCamera,
            hasMicrophone
          }));
        }
      } catch (error) {
        console.error('Error checking media devices:', error);
      }
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);
    
    // Check for media devices
    checkMediaDevices();

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, []);

  return (
    <DeviceContext.Provider value={{ deviceInfo }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceContextProvider');
  }
  return context;
};

// Helper functions
function detectKioskMode(): boolean {
  // Check for kiosk mode indicators (fullscreen, standalone, etc)
  const isFullscreen = 
    (window.navigator as any).standalone || // Safari on iOS
    document.fullscreenElement !== null ||
    (window.matchMedia('(display-mode: fullscreen)').matches);
  
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Check for URL parameters that might indicate kiosk mode
  const urlParams = new URLSearchParams(window.location.search);
  const kioskMode = urlParams.get('mode') === 'kiosk';
  
  // Check localStorage flag (could be set by kiosk setup)
  const storedKioskMode = localStorage.getItem('isKioskMode') === 'true';
  
  return isFullscreen || isStandalone || kioskMode || storedKioskMode;
}

function getNetworkType(): string | null {
  // Check if the Network Information API is available
  if ('connection' in navigator && navigator.connection) {
    const conn = navigator.connection as any;
    if (conn.effectiveType) {
      return conn.effectiveType; // '4g', '3g', '2g', or 'slow-2g'
    }
  }
  
  // Fallback: just return online/offline status
  return navigator.onLine ? 'online' : 'offline';
}

function getBrowserInfo(): string {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  
  // Extract browser name and version
  if (ua.indexOf('Chrome') !== -1) {
    browser = 'Chrome';
  } else if (ua.indexOf('Safari') !== -1) {
    browser = 'Safari';
  } else if (ua.indexOf('Firefox') !== -1) {
    browser = 'Firefox';
  } else if (ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident') !== -1) {
    browser = 'Internet Explorer';
  } else if (ua.indexOf('Edge') !== -1) {
    browser = 'Edge';
  }
  
  return `${browser} on ${navigator.platform}`;
}