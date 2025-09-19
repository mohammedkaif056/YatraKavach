import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Alert types
export interface Alert {
  id: string;
  type: 'emergency' | 'incident' | 'information';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  timestamp: Date;
  status: 'new' | 'acknowledged' | 'resolved';
  assignedTo?: string;
  metadata?: Record<string, any>;
}

// Tourist location update
export interface TouristLocation {
  userId: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
  safetyScore: number;
  status: 'safe' | 'warning' | 'danger' | 'unknown';
}

// WebSocket message types
type WebSocketMessage =
  | { type: 'alert'; payload: Alert }
  | { type: 'tourist_location'; payload: TouristLocation }
  | { type: 'connection_status'; payload: { status: 'connected' | 'disconnected' } }
  | { type: 'authentication'; payload: { status: 'authenticated' | 'unauthenticated'; message?: string } };

interface WebSocketContextType {
  isConnected: boolean;
  alerts: Alert[];
  touristLocations: TouristLocation[];
  sendMessage: (message: any) => void;
  acknowledgeAlert: (alertId: string) => void;
  clearAlerts: () => void;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// Mock data for development
const MOCK_ALERTS: Alert[] = [
  {
    id: 'alert-001',
    type: 'emergency',
    priority: 'high',
    title: 'Tourist medical emergency',
    description: 'Tourist reported chest pain near Central Park. Medical assistance requested.',
    location: {
      lat: 40.785091,
      lng: -73.968285,
      address: 'Central Park, New York, NY',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    status: 'new',
  },
  {
    id: 'alert-002',
    type: 'incident',
    priority: 'medium',
    title: 'Pickpocketing reported',
    description: 'Tourist reported wallet stolen near Times Square. Suspect description provided.',
    location: {
      lat: 40.758896,
      lng: -73.985130,
      address: 'Times Square, New York, NY',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    status: 'acknowledged',
    assignedTo: 'Officer Johnson',
  },
  {
    id: 'alert-003',
    type: 'information',
    priority: 'low',
    title: 'Increased tourist activity',
    description: 'Higher than usual tourist concentration detected at Empire State Building.',
    location: {
      lat: 40.748817,
      lng: -73.985428,
      address: 'Empire State Building, New York, NY',
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: 'new',
  },
];

const MOCK_TOURIST_LOCATIONS: TouristLocation[] = [
  {
    userId: 'tourist-001',
    name: 'John Doe',
    location: {
      lat: 40.785091,
      lng: -73.968285,
    },
    timestamp: new Date(),
    safetyScore: 85,
    status: 'safe',
  },
  {
    userId: 'tourist-002',
    name: 'Jane Smith',
    location: {
      lat: 40.758896,
      lng: -73.985130,
    },
    timestamp: new Date(),
    safetyScore: 65,
    status: 'warning',
  },
  {
    userId: 'tourist-003',
    name: 'Alice Johnson',
    location: {
      lat: 40.748817,
      lng: -73.985428,
    },
    timestamp: new Date(),
    safetyScore: 45,
    status: 'danger',
  },
];

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [touristLocations, setTouristLocations] = useState<TouristLocation[]>(MOCK_TOURIST_LOCATIONS);

  // Mock WebSocket connection
  useEffect(() => {
    if (!isAuthenticated) {
      setIsConnected(false);
      return;
    }

    // Simulate connecting to WebSocket
    console.log('Connecting to WebSocket server...');
    const connectTimeout = setTimeout(() => {
      setIsConnected(true);
      console.log('WebSocket connected');
    }, 1000);

    // Simulate receiving periodic updates
    const updateInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of receiving a new alert
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          type: Math.random() > 0.3 ? 'incident' : Math.random() > 0.5 ? 'emergency' : 'information',
          priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
          title: `New ${Math.random() > 0.5 ? 'incident' : 'alert'} reported`,
          description: `A tourist has reported an issue near ${
            Math.random() > 0.5 ? 'Times Square' : 'Central Park'
          }.`,
          location: {
            lat: 40.758896 + (Math.random() - 0.5) * 0.02,
            lng: -73.985130 + (Math.random() - 0.5) * 0.02,
            address: Math.random() > 0.5 ? 'Times Square area' : 'Central Park area',
          },
          timestamp: new Date(),
          status: 'new',
        };

        setAlerts((prevAlerts) => [newAlert, ...prevAlerts].slice(0, 50)); // Keep only last 50 alerts
      }

      // Update tourist locations
      setTouristLocations((prevLocations) =>
        prevLocations.map((loc) => ({
          ...loc,
          location: {
            lat: loc.location.lat + (Math.random() - 0.5) * 0.001,
            lng: loc.location.lng + (Math.random() - 0.5) * 0.001,
          },
          timestamp: new Date(),
          safetyScore: Math.max(10, Math.min(100, loc.safetyScore + (Math.random() - 0.5) * 5)),
        }))
      );
    }, 30000); // Every 30 seconds

    return () => {
      clearTimeout(connectTimeout);
      clearInterval(updateInterval);
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };
  }, [isAuthenticated]);

  // Mock sending a message
  const sendMessage = (message: any) => {
    if (!isConnected) {
      console.error('Cannot send message: WebSocket not connected');
      return;
    }

    console.log('Sending message via WebSocket:', message);
    // In a real app, we would send the message to the server
  };

  // Acknowledge an alert
  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'acknowledged',
              assignedTo: user?.name,
            }
          : alert
      )
    );

    // In a real app, we would also send this update to the server
    sendMessage({
      type: 'alert_acknowledgement',
      payload: { alertId, officerId: user?.id },
    });
  };

  // Clear all alerts (for development purposes)
  const clearAlerts = () => {
    setAlerts([]);
  };

  // Reconnect WebSocket
  const reconnect = () => {
    setIsConnected(false);
    setTimeout(() => {
      setIsConnected(true);
    }, 1000);
  };

  const value = {
    isConnected,
    alerts,
    touristLocations,
    sendMessage,
    acknowledgeAlert,
    clearAlerts,
    reconnect,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};