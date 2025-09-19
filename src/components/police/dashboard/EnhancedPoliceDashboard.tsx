import React, { useState, useEffect, useRef, createContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import custom components
import StatsOverview from './StatsOverview';
import AlertsPanel from './AlertsPanel';
import DashboardControls from './DashboardControls';

// Import icons
import {
  Bell,
  User,
  Shield,
  MapPin,
  Search,
  Menu,
  LogOut,
  Settings,
  ChevronDown,
  Sliders,
  BarChart3,
  Calendar
} from 'lucide-react';

// Mock data for demonstration
import { mockData } from '../../../services/mockData';

// Create context for theme state management
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleDarkMode: () => {}
});

// Create context for dashboard control state
interface DashboardContextType {
  speechEnabled: boolean;
  notificationsEnabled: boolean;
  isRefreshing: boolean;
  toggleSpeech: () => void;
  toggleNotifications: () => void;
  refreshData: () => void;
}

const DashboardContext = createContext<DashboardContextType>({
  speechEnabled: false,
  notificationsEnabled: true,
  isRefreshing: false,
  toggleSpeech: () => {},
  toggleNotifications: () => {},
  refreshData: () => {}
});

// Define interface for our tourist data based on mockData structure
interface TouristMapData {
  id: string;
  name: string;
  age: number;
  nationality: string;
  avatar: string;
  currentLocation: string;
  destination: string;
  safetyScore: number;
  status: 'active' | 'inactive' | 'emergency';
  lastSeen: string;
  emergencyContact: string;
  tripProgress: number;
  currentDay: number;
  totalDays: number;
  distanceTraveled: number;
}

// Helper component to update map when selected tourist changes
const MapUpdater = ({ selectedTourist, touristData }: { selectedTourist: string | null, touristData: TouristMapData[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedTourist) {
      const tourist = touristData.find(t => t.id === selectedTourist);
      if (tourist) {
        // For demo, we'll generate a position from the tourist's ID to simulate location
        // In a real app, you'd use actual geo coordinates from the tourist data
        const lat = 26.15 + (parseInt(tourist.id) * 0.01);
        const lng = 91.74 + (parseInt(tourist.id) * 0.008);
        
        map.flyTo([lat, lng], 15, {
          animate: true,
          duration: 1
        });
      }
    } else {
      // Reset to overview
      map.flyTo([26.15, 91.74], 13, {
        animate: true,
        duration: 1
      });
    }
  }, [selectedTourist, map, touristData]);
  
  return null;
};

const EnhancedPoliceDashboard: React.FC = () => {
  // State
  const [selectedTourist, setSelectedTourist] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const mapRef = useRef<L.Map | null>(null);
  
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(currentDate);
  
  // Toggle functions with visual feedback
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
    showToastMessage(`${!isDarkMode ? 'Dark' : 'Light'} mode activated`);
  };
  
  const toggleSpeech = () => {
    setSpeechEnabled(prev => !prev);
    showToastMessage(`Voice commands ${!speechEnabled ? 'enabled' : 'disabled'}`);
  };
  
  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
    showToastMessage(`Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`);
  };
  
  const refreshData = () => {
    setIsRefreshing(true);
    showToastMessage('Refreshing data...');
    
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
      showToastMessage('Data refreshed successfully');
    }, 1500);
  };
  
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  
  // Context values
  const themeContextValue = {
    isDarkMode,
    toggleDarkMode
  };
  
  const dashboardContextValue = {
    speechEnabled,
    notificationsEnabled,
    isRefreshing,
    toggleSpeech,
    toggleNotifications,
    refreshData
  };
  
  // Animation variants
  // We'll use these animation variants in a future implementation
  // const pageAnimationVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.1,
  //       when: "beforeChildren"
  //     }
  //   }
  // };

  // We'll use inline status color handling instead of this function

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <DashboardContext.Provider value={dashboardContextValue}>
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-100 text-slate-900'} relative overflow-hidden flex transition-colors duration-300`}>
          {/* Subtle background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isDarkMode ? 'bg-blue-700/5' : 'bg-blue-500/5'} rounded-full filter blur-3xl transition-colors duration-300`}></div>
            <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] ${isDarkMode ? 'bg-purple-700/5' : 'bg-purple-500/5'} rounded-full filter blur-3xl transition-colors duration-300`}></div>
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] ${isDarkMode ? 'bg-indigo-700/5' : 'bg-indigo-500/5'} rounded-full filter blur-3xl transition-colors duration-300`}></div>
          </div>

          {/* Sidebar */}
          <motion.div 
            className={`h-screen ${isDarkMode ? 'bg-slate-800/80' : 'bg-white/90'} backdrop-blur-md border-r ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'} transition-all duration-300 z-20 flex flex-col ${sidebarOpen ? 'w-60' : 'w-20'}`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
        {/* Logo and menu toggle */}
            <div className="p-4 border-b border-slate-700/50 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2.5 rounded-lg shadow-lg shadow-blue-900/20">
                  <Shield className="w-5 h-5" />
                </div>
                {sidebarOpen && (
                  <motion.h1 
                    className="ml-3 font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    PoliceHub
                  </motion.h1>
                )}
              </div>
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-400 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
        
        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto pt-4">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Dashboard', to: '/police/dashboard' },
            { id: 'alerts', icon: Bell, label: 'Alerts', to: '/police/alerts', badge: 3 },
            { id: 'tourists', icon: User, label: 'Tourists', to: '/police/tourists' },
            { id: 'map', icon: MapPin, label: 'Full Map', to: '/police/map' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics', to: '/police/analytics' },
            { id: 'settings', icon: Settings, label: 'Settings', to: '/police/settings' },
          ].map(item => (
            <Link
              key={item.id}
              to={item.to}
              className={`flex items-center px-4 py-3 mb-1 mx-2 rounded-lg transition-all duration-200 relative group
                ${activeTab === item.id 
                  ? isDarkMode 
                    ? 'bg-blue-600/20 text-white' 
                    : 'bg-blue-100 text-blue-800' 
                  : isDarkMode 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-slate-700/50 group-hover:bg-slate-700'}`}>
                <item.icon className="w-4 h-4" />
              </div>
              {sidebarOpen && (
                <span className="ml-3 text-sm font-medium">{item.label}</span>
              )}
              
              {item.badge && (
                <span className={`absolute ${sidebarOpen ? 'right-4' : 'right-0 -top-1'} bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
        
        {/* User profile */}
        <div className={`p-4 border-t border-slate-700/50 ${sidebarOpen ? 'flex justify-between items-center' : 'flex flex-col items-center'}`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-9 h-9 flex items-center justify-center shadow-md border border-white/10">
              <span className="text-sm font-bold">JD</span>
            </div>
            
            {sidebarOpen && (
              <div className="ml-3">
                <div className="text-sm font-medium">John Doe</div>
                <div className="text-xs text-slate-400">Senior Officer</div>
              </div>
            )}
          </div>
          
          {sidebarOpen && (
            <button className="text-slate-400 hover:text-white">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden flex flex-col h-screen z-10 relative">
        {/* Header */}
        <motion.header 
          className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'} backdrop-blur-md border-b ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'} py-4 px-6 flex items-center justify-between transition-colors duration-300`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">Police Dashboard</h2>
            <span className="mx-3 text-slate-500">|</span>
            <div className="flex items-center text-sm text-slate-400">
              <Calendar className="w-4 h-4 mr-1.5" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`relative ${isSearchFocused ? 'w-64' : 'w-48'} transition-all duration-300`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tourists, alerts..."
                className={`w-full ${isDarkMode ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400' : 'bg-slate-100/90 border-slate-300 text-slate-900 placeholder-slate-500'} border rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-colors duration-300`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
            
            <DashboardControls 
              speechEnabled={speechEnabled}
              notificationsEnabled={notificationsEnabled}
              darkMode={isDarkMode}
              isRefreshing={isRefreshing}
              onToggleSpeech={toggleSpeech}
              onToggleNotifications={toggleNotifications}
              onToggleDarkMode={toggleDarkMode}
              onRefresh={refreshData}
              onFilterChange={() => showToastMessage('Filter options opened')}
            />
            
            <div className="relative">
              <button className="relative">
                <Bell className="w-5 h-5 text-slate-300 hover:text-white transition-colors" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            
            <div className="relative">
              <button className="flex items-center space-x-1">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-8 h-8 flex items-center justify-center shadow-md border border-white/10">
                  <span className="text-sm font-bold">JD</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </motion.header>
        
        {/* Main content area */}
        <motion.div 
          className={`flex-1 overflow-y-auto p-6 ${isDarkMode ? '' : 'text-slate-800'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Stats overview */}
          <StatsOverview stats={{ 
            totalTourists: 284, 
            activeTourists: 267, 
            safetyScore: 96.4, 
            incidentsResolved: 48,
            averageResponseTime: 1.8,
            activeCases: 13,
            recentIncidents: 3
          }} />
          
          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Map section */}
            <motion.div 
              className={`lg:col-span-2 ${isDarkMode ? 'bg-slate-800/70' : 'bg-white/70'} backdrop-blur-sm border ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200'} rounded-xl shadow-xl overflow-hidden transition-colors duration-300`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="p-4 border-b border-slate-700/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded shadow-inner shadow-blue-900/20">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Tourist Locations</h3>
                    <p className="text-xs text-slate-400">Real-time tracking</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select 
                    className="bg-slate-700/50 text-slate-300 text-sm rounded border border-slate-600/50 px-2 py-1 focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="all">All Tourists</option>
                    <option value="alert">Alert Only</option>
                    <option value="warning">Warning Only</option>
                    <option value="normal">Normal Only</option>
                  </select>
                  <button className="bg-blue-600/20 hover:bg-blue-600/40 p-1.5 rounded text-blue-400 hover:text-blue-300 transition-colors">
                    <Sliders className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Map container */}
              <div className="relative h-[500px] bg-slate-900/70 overflow-hidden">
                <MapContainer 
                  center={[26.15, 91.74]} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%', background: isDarkMode ? '#0f172a' : '#f8fafc' }}
                  whenReady={() => setIsMapLoaded(true)}
                  ref={(map) => { if (map) mapRef.current = map; }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="map-tiles"
                  />
                  
                  {/* Custom markers for tourists */}
                  {mockData.tourists.map((tourist) => {
                    // Generate a position from the tourist's ID to simulate location
                    // In a real app, you'd use actual geo coordinates from the tourist data
                    const lat = 26.15 + (parseInt(tourist.id) * 0.01);
                    const lng = 91.74 + (parseInt(tourist.id) * 0.008);
                    
                    // Create a custom icon based on tourist status
                    const customIcon = L.divIcon({
                      className: 'custom-marker',
                      html: `
                        <div class="relative">
                          <div class="${tourist.status === 'active' ? 'bg-emerald-500' : tourist.status === 'inactive' ? 'bg-amber-500' : 'bg-red-500'} w-3 h-3 rounded-full border border-white">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${tourist.status === 'active' ? 'bg-emerald-500' : tourist.status === 'inactive' ? 'bg-amber-500' : 'bg-red-500'} opacity-50"></span>
                          </div>
                        </div>
                      `,
                      iconSize: [12, 12],
                      iconAnchor: [6, 6]
                    });
                    
                    return (
                      <Marker 
                        key={tourist.id} 
                        position={[lat, lng]} 
                        icon={customIcon}
                        eventHandlers={{
                          click: () => {
                            setSelectedTourist(tourist.id === selectedTourist ? null : tourist.id);
                          }
                        }}
                      >
                        <Popup className="custom-popup">
                          <div className="bg-slate-900/95 p-3 rounded-lg border border-slate-700/70 text-white">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">{tourist.name}</div>
                              <div className={`px-1.5 py-0.5 rounded-full text-xs ${
                                tourist.status === 'active' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30' : 
                                tourist.status === 'inactive' ? 'bg-amber-900/50 text-amber-400 border border-amber-500/30' : 
                                'bg-red-900/50 text-red-400 border border-red-500/30'
                              }`}>
                                {tourist.status.toUpperCase()}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-xs text-slate-300 mb-2">
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400">Nationality:</span> {tourist.nationality}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400">Location:</span> {tourist.currentLocation}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400">Destination:</span> {tourist.destination}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400">Last seen:</span> {tourist.lastSeen}
                              </div>
                            </div>
                            <div className="flex justify-end mt-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                                onClick={() => alert(`Contacting ${tourist.name}`)}
                              >
                                Contact Tourist
                              </motion.button>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}

                  {/* MapUpdater component to handle map updates */}
                  <MapUpdater selectedTourist={selectedTourist} touristData={mockData.tourists} />
                </MapContainer>
                
                {!isMapLoaded && (
                  <div className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'bg-slate-900/80' : 'bg-slate-100/80'} z-[1000] transition-colors duration-300`}>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}
                
                {/* Map legend */}
                <div className={`absolute bottom-3 left-3 z-[1000] ${isDarkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/90 border-slate-300'} backdrop-blur-sm p-2.5 rounded-lg border text-xs transition-colors duration-300`}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></span>
                      <span>Active (4)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-1.5"></span>
                      <span>Inactive (0)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                      <span>Emergency (0)</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Right sidebar - Alerts Panel */}
            <div>
              <AlertsPanel 
                alerts={mockData.alerts} 
                onRespondToAlert={(alertId) => console.log(`Responding to alert ${alertId}`)} 
              />
            </div>
          </div>
        </motion.div>
          </div>
          
          {/* Toast Notification */}
          <AnimatePresence>
            {showToast && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-slate-900'} border ${isDarkMode ? 'border-slate-600' : 'border-gray-200'} z-50 flex items-center space-x-2`}
              >
                <span className="text-sm font-medium">{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DashboardContext.Provider>
    </ThemeContext.Provider>
  );
};

export default EnhancedPoliceDashboard;