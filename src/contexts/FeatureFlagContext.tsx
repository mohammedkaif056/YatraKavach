import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define all available feature flags
interface FeatureFlags {
  enableIncidentDetail: boolean;
  enableAdvancedAnalytics: boolean;
  enableTouristMessaging: boolean;
  enableAIDispatch: boolean;
  enablePredictiveAlerts: boolean;
  enableBiometricAuth: boolean;
  enableDarkMode: boolean;
  enableMapLayers: boolean;
  enableBetaFeatures: boolean;
}

interface FeatureFlagContextType {
  flags: FeatureFlags;
  isEnabled: (flagName: keyof FeatureFlags) => boolean;
  updateFlag: (flagName: keyof FeatureFlags, value: boolean) => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

// Default feature flags
const DEFAULT_FLAGS: FeatureFlags = {
  enableIncidentDetail: true,
  enableAdvancedAnalytics: true, 
  enableTouristMessaging: true,
  enableAIDispatch: false,
  enablePredictiveAlerts: false,
  enableBiometricAuth: false,
  enableDarkMode: true,
  enableMapLayers: true,
  enableBetaFeatures: false,
};

export const FeatureFlagProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load flags from localStorage or use defaults
  const [flags, setFlags] = useState<FeatureFlags>(() => {
    const savedFlags = localStorage.getItem('feature-flags');
    return savedFlags ? JSON.parse(savedFlags) : DEFAULT_FLAGS;
  });
  
  // Update localStorage when flags change
  useEffect(() => {
    localStorage.setItem('feature-flags', JSON.stringify(flags));
  }, [flags]);
  
  // Check if a feature flag is enabled
  const isEnabled = (flagName: keyof FeatureFlags): boolean => {
    return flags[flagName];
  };
  
  // Update a single feature flag
  const updateFlag = (flagName: keyof FeatureFlags, value: boolean) => {
    setFlags((prev) => ({
      ...prev,
      [flagName]: value,
    }));
  };
  
  // In a real app, we might sync with a remote service
  useEffect(() => {
    const syncWithRemoteFlags = async () => {
      try {
        // Simulate API call to get feature flags
        // await fetch('/api/feature-flags')
        //   .then(res => res.json())
        //   .then(remoteFlags => {
        //     setFlags(prevFlags => ({
        //       ...prevFlags,
        //       ...remoteFlags,
        //     }));
        //   });
        
        console.log('Feature flags synced with remote service');
      } catch (error) {
        console.error('Failed to sync feature flags:', error);
      }
    };
    
    // Sync on mount
    syncWithRemoteFlags();
    
    // Sync every hour
    const interval = setInterval(syncWithRemoteFlags, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const value = {
    flags,
    isEnabled,
    updateFlag,
  };
  
  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};