import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'Officer' | 'Dispatcher' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  badgeNumber?: string;
  avatar?: string;
  department?: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const MOCK_USERS: Record<string, User> = {
  officer: {
    id: '1',
    name: 'Officer John Smith',
    email: 'john.smith@police.gov',
    role: 'Officer',
    badgeNumber: '12345',
    avatar: '/avatars/officer.jpg',
    department: 'Tourist Safety Division',
    permissions: ['view_incidents', 'create_reports', 'view_tourists'],
  },
  dispatcher: {
    id: '2',
    name: 'Dispatcher Sarah Johnson',
    email: 'sarah.johnson@police.gov',
    role: 'Dispatcher',
    badgeNumber: '67890',
    avatar: '/avatars/dispatcher.jpg',
    department: 'Command Center',
    permissions: [
      'view_incidents',
      'create_incidents',
      'assign_resources',
      'view_tourists',
      'view_analytics',
    ],
  },
  admin: {
    id: '3',
    name: 'Captain Michael Wong',
    email: 'michael.wong@police.gov',
    role: 'Admin',
    badgeNumber: '00001',
    avatar: '/avatars/admin.jpg',
    department: 'Command Center',
    permissions: [
      'view_incidents',
      'create_incidents',
      'assign_resources',
      'view_tourists',
      'manage_users',
      'view_analytics',
      'export_data',
      'configure_system',
    ],
  },
};

// For development purposes we'll auto-login as an admin
const DEFAULT_USER_TYPE = 'admin';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate token validation and user loading on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Simulate API call to validate token
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // In a real app, we would validate the token with the server
        // and retrieve the user data
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Auto-login for development
          setUser(MOCK_USERS[DEFAULT_USER_TYPE]);
          localStorage.setItem('user', JSON.stringify(MOCK_USERS[DEFAULT_USER_TYPE]));
        }
      } catch (error) {
        console.error('Failed to validate authentication token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real app, we would send the credentials to the server
      // and receive a token and user data
      
      // For demo, we'll just use the email prefix to determine the user type
      let userType: string;
      if (email.includes('admin')) {
        userType = 'admin';
      } else if (email.includes('dispatcher')) {
        userType = 'dispatcher';
      } else {
        userType = 'officer';
      }
      
      const loggedInUser = MOCK_USERS[userType];
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // In a real app, we would invalidate the token on the server
      
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if the user has a specific permission
  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  // Check if the user has one of the required roles
  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};