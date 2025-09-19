import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockData, Tourist, Alert, Stats, Weather } from '../services/mockData';

interface MockDataContextType {
  currentUser: Tourist | null;
  tourists: Tourist[];
  alerts: Alert[];
  stats: Stats;
  weather: Weather;
  updateTourist: (id: string, updates: Partial<Tourist>) => void;
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const MockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Tourist | null>(mockData.currentUser);
  const [tourists, setTourists] = useState<Tourist[]>(mockData.tourists);
  const [alerts, setAlerts] = useState<Alert[]>(mockData.alerts);
  const [stats, setStats] = useState<Stats>(mockData.stats);
  const [weather, setWeather] = useState<Weather>(mockData.weather);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update safety scores randomly
      setTourists(prev => prev.map(tourist => ({
        ...tourist,
        safetyScore: Math.max(60, Math.min(100, tourist.safetyScore + (Math.random() - 0.5) * 10)),
        distanceTraveled: tourist.distanceTraveled + Math.random() * 2
      })));

      // Occasionally add new alerts
      if (Math.random() < 0.1) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          touristId: tourists[Math.floor(Math.random() * tourists.length)].id,
          type: 'System Update',
          message: 'Routine safety check completed',
          severity: 'low',
          status: 'active',
          time: 'Just now',
          location: 'Various locations'
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 19)]); // Keep only last 20 alerts
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [tourists]);

  const updateTourist = (id: string, updates: Partial<Tourist>) => {
    setTourists(prev => prev.map(tourist => 
      tourist.id === id ? { ...tourist, ...updates } : tourist
    ));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const addAlert = (alert: Omit<Alert, 'id'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString()
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const updateAlert = (id: string, updates: Partial<Alert>) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, ...updates } : alert
    ));
  };

  return (
    <MockDataContext.Provider value={{
      currentUser,
      tourists,
      alerts,
      stats,
      weather,
      updateTourist,
      addAlert,
      updateAlert
    }}>
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};