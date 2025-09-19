import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, MapPin, AlertTriangle, Phone, Bell,
  CheckCircle, Volume2, VolumeX,
  ChevronDown, ChevronUp, Layers, RotateCcw, Target,
  WifiOff, Navigation2, Clock, Share2, RefreshCw,
  Settings, Users, MessageCircle, Camera, Star, HeartHandshake,
  Thermometer, CloudRain, Car, MessageSquare,
  BookOpen, TrendingUp, FileText, Heart, Search, X
} from 'lucide-react';
import MapComponent from '../common/MapComponent';
import WeatherForecast from './WeatherForecast';
import DestinationRatings from './DestinationRatings';
import FloatingChatWidget from '../common/FloatingChatWidget';
import { useMockData } from '../../contexts/MockDataContext';
import 'leaflet/dist/leaflet.css';

const TouristDashboard: React.FC = () => {
  const { currentUser } = useMockData();
  const [batteryLevel] = useState(87);
  const [isOnline, setIsOnline] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());
  const [offlineQueue, setOfflineQueue] = useState(0);
  const [panicConfirmation, setPanicConfirmation] = useState(false);
  const [sosStatus, setSosStatus] = useState<'idle' | 'sending' | 'sent' | 'confirmed'>('idle');
  const [gpsAccuracy, setGpsAccuracy] = useState(95);
  const [safetyScore] = useState(currentUser?.safetyScore || 87);
  const [lastKnownLocation] = useState(currentUser?.currentLocation || 'Shillong, Meghalaya');
  const [showRoutes, setShowRoutes] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [alertsExpanded, setAlertsExpanded] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);
  const [showIncidentReport, setShowIncidentReport] = useState(false);
  const [showCommunityChat, setShowCommunityChat] = useState(false);
  const [showWeatherForecast, setShowWeatherForecast] = useState(false);
  const [showTravelTips, setShowTravelTips] = useState(false);
  const [showDestinationRatings, setShowDestinationRatings] = useState(false);
  const [alertPreferences, setAlertPreferences] = useState({
    weather: true,
    crime: true,
    traffic: true,
    health: false,
    cultural: true
  });
  const [groupMode, setGroupMode] = useState(false);
  const [groupMembers] = useState([
    { id: 1, name: 'Alice', status: 'safe', distance: '50m', lastSeen: '2m ago' },
    { id: 2, name: 'Bob', status: 'checking-in', distance: '120m', lastSeen: '5m ago' }
  ]);
  const [activeTab, setActiveTab] = useState('popular');
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Enhanced mock data for better UI demonstration
  const allMockAlerts = [
    { 
      id: 1, 
      type: 'info', 
      category: 'safety',
      message: 'Entered safe tourist zone', 
      time: '2m ago', 
      action: 'Acknowledge',
      severity: 'low',
      location: 'Police Bazaar, Shillong',
      hasEvidence: false
    },
    { 
      id: 2, 
      type: 'warning', 
      category: 'weather',
      message: 'Weather alert: Light rain expected in 30 minutes', 
      time: '15m ago', 
      action: 'Details',
      severity: 'medium',
      location: 'Shillong City Center',
      hasEvidence: true
    },
    { 
      id: 3, 
      type: 'success', 
      category: 'safety',
      message: 'Regular check-in completed successfully', 
      time: '1h ago', 
      action: 'View',
      severity: 'low',
      location: 'Don Bosco Centre',
      hasEvidence: false
    },
    {
      id: 4,
      type: 'warning',
      category: 'traffic',
      message: 'Heavy traffic reported on GS Road. Consider alternate route',
      time: '25m ago',
      action: 'Navigate',
      severity: 'medium',
      location: 'GS Road Junction',
      hasEvidence: false
    },
    {
      id: 5,
      type: 'info',
      category: 'cultural',
      message: 'Local festival celebration nearby. Cultural experience opportunity!',
      time: '45m ago',
      action: 'Explore',
      severity: 'low',
      location: 'Khasi Heritage Village',
      hasEvidence: true
    }
  ];

  // Filter alerts based on user preferences
  const mockAlerts = allMockAlerts.filter(alert => {
    const category = alert.category as keyof typeof alertPreferences;
    return category in alertPreferences && alertPreferences[category];
  });

  const nearbyPlaces = [
    { id: 1, name: 'Police Station', distance: '0.8 km', type: 'safety', rating: 4.8, lat: 25.5698, lng: 91.8853 },
    { id: 2, name: 'Civil Hospital', distance: '1.2 km', type: 'medical', rating: 4.5, lat: 25.5678, lng: 91.8823 },
    { id: 3, name: 'Tourist Information Center', distance: '0.5 km', type: 'info', rating: 4.9, lat: 25.5818, lng: 91.8973 },
    { id: 4, name: 'Ward Lake', distance: '0.3 km', type: 'attraction', rating: 4.7, lat: 25.5738, lng: 91.8893 }
  ];

  const emergencyContacts = [
    { id: 1, name: 'Police Emergency', number: '100', type: 'police', distance: '0.8 km', responseTime: '3-5 min' },
    { id: 2, name: 'Medical Emergency', number: '108', type: 'medical', distance: '1.2 km', responseTime: '5-8 min' },
    { id: 3, name: 'Fire Emergency', number: '101', type: 'fire', distance: '1.5 km', responseTime: '4-7 min' },
    { id: 4, name: 'Tourist Helpline', number: '1363', type: 'tourist', distance: '0.5 km', responseTime: '24/7' },
    { id: 5, name: 'Women Helpline', number: '1091', type: 'women', distance: 'State-wide', responseTime: '24/7' }
  ];

  const travelTips = {
    cultural: [
      {
        id: 1,
        title: 'Local Customs & Etiquette',
        content: 'Khasi people are warm and welcoming. A simple "Kumno" (hello) will be appreciated. Remove shoes when entering homes.',
        icon: '🙏',
        category: 'Cultural'
      },
      {
        id: 2,
        title: 'Traditional Food Safety',
        content: 'Try local delicacies like Jadoh and Dohkhlieh, but ensure they\'re from clean establishments. Street food is generally safe in main tourist areas.',
        icon: '🍽️',
        category: 'Food'
      }
    ],
    safety: [
      {
        id: 3,
        title: 'Weather Preparedness',
        content: 'Shillong weather can change quickly. Always carry a light waterproof jacket and umbrella, especially during monsoon season.',
        icon: '🌧️',
        category: 'Weather'
      },
      {
        id: 4,
        title: 'Road Safety Tips',
        content: 'Hill roads can be narrow and winding. If driving, maintain safe distance and use headlights even during day time.',
        icon: '🚗',
        category: 'Transport'
      }
    ],
    attractions: [
      {
        id: 5,
        title: 'Best Photography Spots',
        content: 'Golden hour at Ward Lake, sunrise at Laitlum Canyons, and traditional architecture at Don Bosco Museum offer stunning photo opportunities.',
        icon: '📸',
        category: 'Photography'
      },
      {
        id: 6,
        title: 'Hidden Gems',
        content: 'Visit David Scott Trail for hiking, Sweet Falls for a peaceful retreat, and Khasi Heritage Village for authentic cultural experience.',
        icon: '💎',
        category: 'Attractions'
      }
    ]
  };

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate GPS accuracy fluctuation
      setGpsAccuracy(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(60, Math.min(100, prev + change));
      });
      
      // Update last sync if online
      if (isOnline) {
        setLastSync(new Date());
        setOfflineQueue(0);
      } else {
        setOfflineQueue(prev => prev + Math.floor(Math.random() * 3));
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOnline]);

  // Simulate connectivity changes
  useEffect(() => {
    const connectivityTimer = setInterval(() => {
      setIsOnline(Math.random() > 0.1); // 90% online simulation
    }, 30000);
    
    return () => clearInterval(connectivityTimer);
  }, []);

  const confirmPanic = () => {
    setSosStatus('sending');
    setPanicConfirmation(false);
    
    // Simulate SOS sending process
    setTimeout(() => setSosStatus('sent'), 2000);
    setTimeout(() => setSosStatus('confirmed'), 5000);
    setTimeout(() => setSosStatus('idle'), 10000);
  };

  const cancelPanic = () => {
    setPanicConfirmation(false);
  };

  const getSafetyStatusLabel = (score: number) => {
    if (score >= 80) return { label: 'Safe', color: 'emerald', description: 'All indicators normal' };
    if (score >= 60) return { label: 'Monitor', color: 'yellow', description: 'Minor concerns detected' };
    return { label: 'Help Required', color: 'red', description: 'Immediate attention needed' };
  };

  const safetyStatus = getSafetyStatusLabel(safetyScore);

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Enhanced Professional Navigation Bar */}
      <motion.div
        className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50 shadow-xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.320, 1] }}
      >
        {/* Main Navigation */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: User Profile Section */}
          <div className="flex items-center space-x-4">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* User Avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg border-2 border-emerald-300">
                  <span className="text-white font-bold text-lg">RS</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              
              {/* User Info */}
              <div>
                <h2 className="text-white font-bold text-lg">Rohit Sharma</h2>
                <p className="text-emerald-400 text-sm font-medium flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {lastKnownLocation}
                </p>
              </div>
            </motion.div>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-6 ml-8">
              <motion.button 
                onClick={() => setShowPreferences(true)}
                className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <Settings className="w-4 h-4" />
                <span>Dashboard</span>
              </motion.button>
              <motion.button 
                onClick={() => setShowTravelTips(true)}
                className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <MapPin className="w-4 h-4" />
                <span>My Travels</span>
              </motion.button>
              <motion.button 
                onClick={() => setShowDestinationRatings(true)}
                className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="w-4 h-4" />
                <span>Favourites</span>
              </motion.button>
              <motion.button 
                onClick={() => setShowCommunityChat(true)}
                className="text-gray-300 hover:text-emerald-400 font-medium transition-colors duration-200 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Community</span>
              </motion.button>
            </nav>
          </div>
          
          {/* Right: Yaatra Shield Logo & Actions */}
          <div className="flex items-center space-x-6">
            {/* Safety Score Display */}
            <motion.div 
              className="flex items-center space-x-3 bg-gray-800/60 rounded-xl px-4 py-2 border border-gray-700/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Shield className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-white font-semibold text-sm">{safetyScore}% Safe</p>
                <p className="text-gray-400 text-xs">Safety Score</p>
              </div>
            </motion.div>
            
            {/* Emergency Quick Access */}
            <motion.button
              onClick={() => {
                setShowEmergencyPopup(true);
                if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
              }}
              className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors duration-200 border border-red-500/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-5 h-5 text-red-400" />
            </motion.button>
            
            {/* Notifications */}
            <motion.button
              onClick={() => setShowIncidentReport(true)}
              className="relative p-3 bg-gray-800/70 hover:bg-gray-700/70 rounded-xl transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5 text-gray-300" />
              {mockAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"></span>
              )}
            </motion.button>
            
            {/* Yaatra Shield Logo */}
            <motion.div 
              className="flex items-center space-x-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl px-4 py-2 shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-white font-bold text-lg">Yaatra</h1>
                <p className="text-emerald-100 text-xs font-medium">Shield</p>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Enhanced Status Bar */}
        <div className="px-6 py-3 bg-gray-800/50 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <motion.div 
                  className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-gray-300 font-medium">
                  {isOnline ? 'Online' : 'Offline'} • Last sync: {formatLastSync(lastSync)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">GPS: {gpsAccuracy.toFixed(0)}% accuracy</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">{groupMode ? `${groupMembers.length + 12}` : '14'} nearby</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {groupMode && (
                <div className="flex items-center space-x-2 bg-emerald-500/20 px-3 py-1 rounded-lg">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">{groupMembers.length} members</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-lg font-medium text-xs ${
                  batteryLevel > 50 ? 'bg-emerald-500/20 text-emerald-400' : 
                  batteryLevel > 20 ? 'bg-yellow-500/20 text-yellow-400' : 
                  'bg-red-500/20 text-red-400'
                }`}>
                  {batteryLevel}% Battery
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Dashboard Content */}
      <div className="px-6 py-8">
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.h1 
                className="text-3xl font-bold text-white mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Hello Rohit Sharma!
              </motion.h1>
              <motion.p 
                className="text-gray-400 text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Welcome back and explore the North-East of India
              </motion.p>
            </div>
            
            <motion.div 
              className="text-right"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-gray-400 text-sm mb-1">LIVE CALENDAR</p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-gray-500 text-xs">MO</p>
                  <p className="text-gray-500 text-xs">16</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-xs">TU</p>
                  <p className="text-gray-500 text-xs">17</p>
                </div>
                <div className="text-center bg-emerald-500 rounded-lg px-2 py-1">
                  <p className="text-white text-xs font-bold">WE</p>
                  <p className="text-white text-xs font-bold">{new Date().getDate()}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-xs">TH</p>
                  <p className="text-gray-500 text-xs">{new Date().getDate() + 1}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-xs">FR</p>
                  <p className="text-gray-500 text-xs">{new Date().getDate() + 2}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Easy Visa Destinations */}
        <motion.section 
          className="mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Explore North East India</h2>
            <motion.button 
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              View All
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Assam Card */}
            <motion.div
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setShowDestinationRatings(true)}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-green-400 to-emerald-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">Assam</h3>
                  <p className="text-white/90 text-sm">Tea Gardens & Rhinos</p>
                  <p className="text-2xl font-bold">₹ 8,500</p>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    🦏 Wildlife
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Meghalaya Card */}
            <motion.div
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setShowDestinationRatings(true)}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-cyan-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">Meghalaya</h3>
                  <p className="text-white/90 text-sm">Clouds & Waterfalls</p>
                  <p className="text-2xl font-bold">₹ 7,200</p>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    🌧️ Monsoon
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Arunachal Pradesh Card */}
            <motion.div
              className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setShowDestinationRatings(true)}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-400 to-red-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">Arunachal</h3>
                  <p className="text-white/90 text-sm">Land of Dawn</p>
                  <p className="text-2xl font-bold">₹ 12,300</p>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    🏔️ Mountains
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Most Popular & Special Offers */}
          <div className="lg:col-span-2 space-y-8">
            {/* Navigation Tabs */}
            <motion.div 
              className="flex items-center space-x-8 border-b border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button 
                onClick={() => setActiveTab('popular')}
                className={`font-semibold pb-4 border-b-2 transition-all duration-200 ${
                  activeTab === 'popular' 
                    ? 'text-white border-emerald-500' 
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Most Popular
              </motion.button>
              <motion.button 
                onClick={() => setActiveTab('offers')}
                className={`font-medium pb-4 border-b-2 transition-all duration-200 ${
                  activeTab === 'offers' 
                    ? 'text-white border-emerald-500' 
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Special Offers
              </motion.button>
              <motion.button 
                onClick={() => setActiveTab('nearby')}
                className={`font-medium pb-4 border-b-2 transition-all duration-200 ${
                  activeTab === 'nearby' 
                    ? 'text-white border-emerald-500' 
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Near Me
              </motion.button>
            </motion.div>

            {/* Popular Destinations Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Manipur */}
              <motion.div 
                className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800/80 transition-all duration-300 cursor-pointer border border-gray-700/50"
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => setShowTravelTips(true)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl">🌸</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">Manipur</h3>
                    <p className="text-gray-400 text-sm">⭐ 4.8 rating</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold text-lg">₹ 6,500</p>
                    <p className="text-gray-400 text-xs">/person</p>
                  </div>
                </div>
              </motion.div>

              {/* Sikkim */}
              <motion.div 
                className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800/80 transition-all duration-300 cursor-pointer border border-gray-700/50"
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => setShowTravelTips(true)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl">�️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">Sikkim</h3>
                    <p className="text-gray-400 text-sm">⭐ 4.9 rating</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold text-lg">₹ 8,200</p>
                    <p className="text-gray-400 text-xs">/person</p>
                  </div>
                </div>
              </motion.div>

              {/* Nagaland */}
              <motion.div 
                className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800/80 transition-all duration-300 cursor-pointer border border-gray-700/50"
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => setShowTravelTips(true)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl">🎭</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">Nagaland</h3>
                    <p className="text-gray-400 text-sm">⭐ 4.7 rating</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold text-lg">₹ 7,800</p>
                    <p className="text-gray-400 text-xs">/person</p>
                  </div>
                </div>
              </motion.div>

              {/* Mizoram */}
              <motion.div 
                className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 hover:bg-gray-800/80 transition-all duration-300 cursor-pointer border border-gray-700/50"
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => setShowTravelTips(true)}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl">🌿</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">Mizoram</h3>
                    <p className="text-gray-400 text-sm">⭐ 4.6 rating</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-bold text-lg">₹ 9,200</p>
                    <p className="text-gray-400 text-xs">/person</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Bookings */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Bookings</h2>
              <motion.button 
                onClick={() => setShowAllBookings(true)}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-emerald-500/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
              </motion.button>
            </div>

            {/* Booking Cards */}
            <div className="space-y-4">
              {/* 2022 Bookings */}
              <div>
                <p className="text-gray-400 text-sm font-medium mb-3">2022</p>
                
                <motion.div 
                  className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 cursor-pointer hover:bg-gray-800/80 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowDestinationRatings(true)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">�</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">Assam Tea Gardens</h4>
                      <p className="text-gray-400 text-xs">15 Dec - 28 Dec</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* 2021 Bookings */}
              <div>
                <p className="text-gray-400 text-sm font-medium mb-3">2021</p>
                
                <motion.div 
                  className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 cursor-pointer hover:bg-gray-800/80 transition-all duration-300 mb-3"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowDestinationRatings(true)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">☁️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">Meghalaya Hills</h4>
                      <p className="text-gray-400 text-xs">05 Nov - 18 Nov</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 cursor-pointer hover:bg-gray-800/80 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowDestinationRatings(true)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">🏯</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">Tripura</h4>
                      <p className="text-gray-400 text-xs">20 Feb - 05 Mar</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Emergency SOS Button - Right Side, Above Chatbot */}
      <motion.div
        className="fixed bottom-32 right-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          delay: 1.2, 
          type: 'spring', 
          stiffness: 300, 
          damping: 15 
        }}
      >
        {/* Main SOS Button */}
        <motion.button
          onClick={() => {
            console.log('🚨 EMERGENCY SOS ACTIVATED!');
            setShowEmergencyPopup(true);
            // Enhanced emergency actions
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200, 100, 400]);
            }
          }}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-2xl transition-all duration-300 overflow-hidden border-2 border-white/20 ${
            sosStatus === 'sending' ? 'bg-gradient-to-br from-yellow-500 to-orange-500' :
            sosStatus === 'sent' || sosStatus === 'confirmed' ? 'bg-gradient-to-br from-emerald-500 to-green-500' :
            'bg-gradient-to-br from-red-500 to-red-600'
          }`}
          animate={{
            scale: safetyStatus.color === 'red' ? [1, 1.1, 1] : [1, 1.05, 1],
            boxShadow: [
              '0 0 0 0 rgba(239, 68, 68, 0.8)',
              '0 0 0 20px rgba(239, 68, 68, 0)',
              '0 0 0 0 rgba(239, 68, 68, 0)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ 
            scale: 1.15,
            rotate: [0, -3, 3, 0],
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Animated background pulse */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Icon */}
          <div className="relative z-10">
            {sosStatus === 'sending' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-8 h-8" />
              </motion.div>
            ) : sosStatus === 'sent' || sosStatus === 'confirmed' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CheckCircle className="w-8 h-8" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <AlertTriangle className="w-8 h-8" />
              </motion.div>
            )}
          </div>
        </motion.button>
        
        {/* Quick Action Ring - Smaller */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Mini action buttons around the main button */}
          {[
            { icon: Share2, angle: 0, action: () => console.log('Share location'), color: 'bg-blue-500' },
            { icon: Camera, angle: 90, action: () => setShowIncidentReport(true), color: 'bg-purple-500' },
            { icon: MessageCircle, angle: 180, action: () => setShowCommunityChat(true), color: 'bg-green-500' },
            { icon: AlertTriangle, angle: 270, action: () => setShowEmergencyContacts(true), color: 'bg-orange-500' }
          ].map((item, index) => (
            <motion.button
              key={index}
              onClick={item.action}
              className={`absolute w-8 h-8 ${item.color} rounded-full flex items-center justify-center text-white shadow-lg`}
              style={{
                transform: `rotate(${item.angle}deg) translateY(-35px) rotate(-${item.angle}deg)`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 1.8 + index * 0.1,
                type: 'spring',
                stiffness: 400
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <item.icon className="w-3 h-3" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="px-4 mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Map Header with Controls */}
          <div className="p-4 border-b border-gray-100/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Live Safety Map</h3>
                  <p className="text-sm text-gray-600">Real-time geolocation & zones</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setShowRoutes(!showRoutes)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    showRoutes ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Navigation2 className="w-3 h-3 mr-1 inline" />
                  Routes
                </motion.button>
                
                <motion.button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                    showHeatmap ? 'bg-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Layers className="w-3 h-3 mr-1 inline" />
                  Heatmap
                </motion.button>
              </div>
            </div>
            
            {/* Live Status Indicators */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-gray-600">GPS: {gpsAccuracy}% accuracy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-gray-600">Updated {formatLastSync(lastSync)}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button 
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {soundEnabled ? 
                    <Volume2 className="w-4 h-4 text-blue-600" /> : 
                    <VolumeX className="w-4 h-4 text-gray-400" />
                  }
                </motion.button>
                
                <div className="px-2 py-1 bg-white/70 rounded-lg text-xs font-medium">
                  {isOnline ? (
                    <span className="text-emerald-600">🟢 Live</span>
                  ) : (
                    <span className="text-yellow-600">📶 Offline • {offlineQueue} queued</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Interactive Map with Leaflet */}
          <div className="relative h-80">
            <MapComponent
              center={[25.5788, 91.8933]} // Shillong coordinates
              zoom={14}
              markers={[
                { 
                  id: 1, 
                  position: [25.5788, 91.8933], 
                  type: 'tourist', 
                  name: 'Your Location',
                  status: 'safe'
                },
                ...nearbyPlaces.map(place => ({
                  id: place.id + 100,
                  position: [place.lat, place.lng] as [number, number],
                  type: place.type as string,
                  name: place.name,
                  status: 'active' as string
                }))
              ]}
              showSafeZones={true}
              showAlertZones={showHeatmap}
              safeZones={[
                {
                  center: [25.5788, 91.8933],
                  radius: 1000,
                  color: '#10B981',
                  fillColor: '#10B981',
                  fillOpacity: 0.1
                }
              ]}
              alertZones={showHeatmap ? [
                {
                  center: [25.5700, 91.8800],
                  radius: 500,
                  color: '#F59E0B',
                  fillColor: '#F59E0B',
                  fillOpacity: 0.15
                }
              ] : []}
              className="rounded-b-3xl"
            />
            
            {/* Map Overlay Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[1000]">
              <motion.button
                className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center border border-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Target className="w-5 h-5 text-gray-700" />
              </motion.button>
              
              <motion.button
                className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center border border-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RotateCcw className="w-5 h-5 text-gray-700" />
              </motion.button>
            </div>
            
            {/* Zone Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/20 z-[1000]">
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full opacity-60" />
                  <span className="font-medium text-gray-700">Safe Zone</span>
                </div>
                {showHeatmap && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-60" />
                    <span className="font-medium text-gray-700">Monitor Zone</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="font-medium text-gray-700">Points of Interest</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Quick Actions Row - Apple Style */}
      <motion.div
        className="px-4 mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            { 
              icon: Phone, 
              label: 'Emergency', 
              color: 'red', 
              bgGradient: 'from-red-500 to-red-600',
              action: () => {
                setShowEmergencyPopup(true);
                // Enhanced haptic feedback for emergency
                if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
              }
            },
            { 
              icon: Star, 
              label: 'Rate & Review', 
              color: 'yellow', 
              bgGradient: 'from-yellow-500 to-orange-600',
              action: () => {
                setShowDestinationRatings(true);
                // Track analytics
                console.log('User opened ratings system');
              }
            },
            { 
              icon: Camera, 
              label: 'Report', 
              color: 'blue', 
              bgGradient: 'from-blue-500 to-blue-600',
              action: () => {
                setShowIncidentReport(true);
                // Initialize camera if available
                if (navigator.mediaDevices) {
                  console.log('Camera access available for incident reporting');
                }
              }
            },
            { 
              icon: CheckCircle, 
              label: 'Check-in', 
              color: 'emerald', 
              bgGradient: 'from-emerald-500 to-emerald-600',
              action: () => {
                // Implement check-in functionality
                const checkInData = {
                  location: lastKnownLocation,
                  timestamp: new Date().toISOString(),
                  safetyScore: safetyScore,
                  coordinates: [25.5788, 91.8933]
                };
                console.log('Check-in completed:', checkInData);
                
                // Show success feedback
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                
                // Could send to backend API
                // sendCheckIn(checkInData);
              }
            }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              onClick={action.action}
              className="group relative"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className={`w-full h-20 bg-gradient-to-br ${action.bgGradient} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center space-y-1 relative overflow-hidden`}>
                {/* Animated background overlay */}
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-2xl"
                  animate={{ 
                    opacity: [0, 0.3, 0],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                />
                
                <action.icon className="w-6 h-6 text-white relative z-10" />
                <span className="text-xs font-bold text-white relative z-10">{action.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
        
        {/* Secondary Actions Row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { 
              icon: Thermometer, 
              label: 'Weather', 
              color: 'blue', 
              bgGradient: 'from-blue-400 to-cyan-500',
              action: () => {
                setShowWeatherForecast(true);
                // Fetch latest weather data
                console.log('Fetching latest weather data for', lastKnownLocation);
              }
            },
            { 
              icon: BookOpen, 
              label: 'Travel Tips', 
              color: 'green', 
              bgGradient: 'from-green-500 to-emerald-600',
              action: () => {
                setShowTravelTips(true);
                // Track user engagement
                console.log('User accessing travel tips');
              }
            },
            { 
              icon: MessageCircle, 
              label: 'Community', 
              color: 'indigo', 
              bgGradient: 'from-indigo-500 to-indigo-600',
              action: () => {
                setShowCommunityChat(true);
                // Initialize chat connection
                console.log('Connecting to community chat...');
              }
            },
            { 
              icon: Settings, 
              label: 'Settings', 
              color: 'gray', 
              bgGradient: 'from-gray-500 to-gray-600',
              action: () => {
                setShowPreferences(true);
                // Save current preferences state
                console.log('Opening preferences with current settings:', alertPreferences);
              }
            }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              onClick={action.action}
              className="group relative"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <div className={`w-full h-16 bg-gradient-to-br ${action.bgGradient} rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center space-y-1 relative overflow-hidden`}>
                <action.icon className="w-5 h-5 text-white relative z-10" />
                <span className="text-xs font-semibold text-white relative z-10">{action.label}</span>
              </div>
            </motion.button>
          ))}
        </div>
        
        {/* Third Row - Enhanced Group Mode Toggle */}
        <div className="mt-4">
          <motion.button
            onClick={() => {
              const newGroupMode = !groupMode;
              setGroupMode(newGroupMode);
              
              // Implement group mode functionality
              if (newGroupMode) {
                console.log('Group mode activated - Starting location sharing with:', groupMembers);
                // Initialize group tracking
                // startGroupTracking(groupMembers);
                if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);
              } else {
                console.log('Group mode deactivated - Stopping location sharing');
                // Stop group tracking
                // stopGroupTracking();
                if (navigator.vibrate) navigator.vibrate(200);
              }
            }}
            className={`w-full h-14 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center space-x-3 font-semibold ${
              groupMode 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <motion.div
              animate={groupMode ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Users className={`w-5 h-5 ${groupMode ? 'text-white' : 'text-gray-600'}`} />
            </motion.div>
            <span>{groupMode ? 'Group Mode Active' : 'Enable Group Mode'}</span>
            {groupMode && (
              <motion.div
                className="ml-2 px-3 py-1 bg-white/20 rounded-full text-xs flex items-center space-x-1"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span>{groupMembers.length} members</span>
                <motion.div
                  className="w-2 h-2 bg-green-300 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Enhanced Alert Feed - Apple Style */}
      <motion.div
        className="px-4 mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-gray-900">Safety Alerts</h3>
                    {groupMode && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Group Mode
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Real-time notifications • {mockAlerts.length} active</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-emerald-600">Live</span>
                </div>
                
                <motion.button
                  onClick={() => setAlertsExpanded(!alertsExpanded)}
                  className="p-2 rounded-xl hover:bg-gray-100/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {alertsExpanded ? 
                    <ChevronUp className="w-4 h-4 text-gray-600" /> : 
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  }
                </motion.button>
              </div>
            </div>
          </div>
          
          <div className={`overflow-hidden transition-all duration-500 ${alertsExpanded ? 'max-h-96' : 'max-h-64'}`}>
            <div className="space-y-1">
              <AnimatePresence>
                {mockAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -50, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 50, height: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.5,
                      ease: [0.23, 1, 0.320, 1]
                    }}
                    className="group"
                  >
                    <div className="p-4 hover:bg-gray-50/50 transition-all duration-300 border-b border-gray-100/30 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <motion.div 
                          className={`p-3 rounded-2xl shadow-lg ${
                            alert.type === 'success' ? 'bg-gradient-to-br from-emerald-400 to-emerald-500' :
                            alert.type === 'warning' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                            'bg-gradient-to-br from-blue-400 to-blue-500'
                          }`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          {alert.type === 'success' ? 
                            <CheckCircle className="w-5 h-5 text-white" /> :
                            alert.type === 'warning' ?
                            <AlertTriangle className="w-5 h-5 text-white" /> :
                            <Bell className="w-5 h-5 text-white" />
                          }
                        </motion.div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                              {alert.message}
                            </h4>
                            {alert.hasEvidence && (
                              <motion.div
                                className="ml-2 px-2 py-1 bg-blue-100 rounded-full"
                                whileHover={{ scale: 1.05 }}
                              >
                                <span className="text-xs font-medium text-blue-600">📎 Evidence</span>
                              </motion.div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">{alert.location}</p>
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{alert.time}</span>
                                </span>
                                <span className={`px-2 py-1 rounded-full font-medium ${
                                  alert.severity === 'low' ? 'bg-emerald-100 text-emerald-700' :
                                  alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {alert.severity.toUpperCase()}
                                </span>
                              </div>
                            </div>
                            
                            <motion.button 
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl shadow-lg transition-all duration-200"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {alert.action}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>



      {/* Enhanced Emergency SOS Popup Modal with Quick Alert */}
      <AnimatePresence>
        {showEmergencyPopup && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-red-400/50 text-center"
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <motion.div
                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(255, 255, 255, 0.4)',
                    '0 0 0 20px rgba(255, 255, 255, 0)',
                    '0 0 0 0 rgba(255, 255, 255, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-3">🚨 Emergency SOS Alert</h3>
              <p className="text-white/90 leading-relaxed mb-6">
                Send immediate emergency alert with your live location to nearest response teams.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/20">
                <div className="text-white text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span>📍 Current Location:</span>
                    <span className="font-semibold">{lastKnownLocation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>⚡ Dispatch Time:</span>
                    <span className="font-semibold text-yellow-300">3 seconds</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>⏱️ Response ETA:</span>
                    <span className="font-semibold text-green-300">3-5 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>📞 Emergency Teams:</span>
                    <span className="font-semibold text-blue-300">Police, Medical, Fire</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <motion.button
                  onClick={() => {
                    setShowEmergencyPopup(false);
                    setSosStatus('sending');
                    // Enhanced haptic feedback for emergency
                    if (navigator.vibrate) {
                      navigator.vibrate([200, 100, 200, 100, 400]);
                    }
                    // Enhanced 3-second dispatch process
                    setTimeout(() => {
                      setSosStatus('sent');
                      // Show dispatch confirmation
                      console.log('🚨 EMERGENCY DISPATCH: Response team dispatched in 3 seconds!');
                    }, 3000);
                    setTimeout(() => {
                      setSosStatus('confirmed');
                      console.log('✅ DISPATCH CONFIRMED: Emergency response team en route - ETA 3-5 minutes');
                    }, 6000);
                    setTimeout(() => setSosStatus('idle'), 15000);
                  }}
                  className="w-full bg-white hover:bg-gray-100 text-red-600 font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span>🚨 SEND EMERGENCY ALERT</span>
                </motion.button>
                
                <motion.button
                  onClick={() => setShowEmergencyPopup(false)}
                  className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
              
              <p className="text-white/70 text-xs mt-4">
                ⚠️ Emergency services will be automatically notified with your exact location and safety profile.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Bookings Modal */}
      <AnimatePresence>
        {showAllBookings && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-gray-700/50 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">All Your Bookings</h3>
                    <p className="text-gray-400 text-sm">Complete travel history</p>
                  </div>
                </div>
                <motion.button 
                  onClick={() => setShowAllBookings(false)}
                  className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors flex items-center justify-center w-10 h-10 bg-gray-800/60 border border-gray-600/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {/* 2023 Bookings */}
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-3">2023</p>
                  {[
                    { name: 'Arunachal Pradesh Adventure', dates: '15 Mar - 28 Mar', icon: '🏔️', color: 'from-orange-400 to-red-500' },
                    { name: 'Sikkim Mountain Trek', dates: '10 Jun - 20 Jun', icon: '⛰️', color: 'from-blue-400 to-cyan-500' }
                  ].map((booking, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 mb-3"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${booking.color} rounded-lg flex items-center justify-center`}>
                          <span className="text-white text-lg">{booking.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{booking.name}</h4>
                          <p className="text-gray-400 text-xs">{booking.dates}</p>
                        </div>
                        <div className="text-emerald-400 font-bold">Completed</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 2022 Bookings */}
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-3">2022</p>
                  <motion.div
                    className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 mb-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg">🍃</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">Assam Tea Gardens</h4>
                        <p className="text-gray-400 text-xs">15 Dec - 28 Dec</p>
                      </div>
                      <div className="text-emerald-400 font-bold">Completed</div>
                    </div>
                  </motion.div>
                </div>

                {/* 2021 Bookings */}
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-3">2021</p>
                  {[
                    { name: 'Meghalaya Hills', dates: '05 Nov - 18 Nov', icon: '☁️', color: 'from-blue-400 to-cyan-500' },
                    { name: 'Tripura', dates: '20 Feb - 05 Mar', icon: '🏯', color: 'from-purple-400 to-pink-500' }
                  ].map((booking, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 mb-3"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${booking.color} rounded-lg flex items-center justify-center`}>
                          <span className="text-white text-lg">{booking.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{booking.name}</h4>
                          <p className="text-gray-400 text-xs">{booking.dates}</p>
                        </div>
                        <div className="text-emerald-400 font-bold">Completed</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={() => setShowAllBookings(false)}
                className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {panicConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-white/20"
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 0 0 rgba(239, 68, 68, 0.4)',
                      '0 0 0 20px rgba(239, 68, 68, 0)',
                      '0 0 0 0 rgba(239, 68, 68, 0)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <AlertTriangle className="w-10 h-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Emergency SOS</h3>
                <p className="text-gray-600 leading-relaxed">
                  This will share your live location and immediately contact the nearest emergency response unit.
                </p>
              </div>
              
              <div className="space-y-3">
                <motion.button
                  onClick={confirmPanic}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Emergency SOS
                </motion.button>
                
                <motion.button
                  onClick={cancelPanic}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced SOS Status Toast */}
      <AnimatePresence>
        {sosStatus !== 'idle' && (
          <motion.div
            className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div
              className={`px-8 py-4 rounded-2xl shadow-2xl text-white font-semibold backdrop-blur-xl border border-white/20 ${
                sosStatus === 'sending' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                sosStatus === 'sent' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                'bg-gradient-to-r from-emerald-500 to-green-500'
              }`}
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6">
                  {sosStatus === 'sending' ? (
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  ) : sosStatus === 'sent' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Shield className="w-6 h-6" />
                  )}
                </div>
                <span className="text-lg">
                  {sosStatus === 'sending' ? 'Dispatching response team...' :
                   sosStatus === 'sent' ? 'Response team dispatched in 3 seconds!' :
                   'Emergency team en route - ETA 3-5 min'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Offline Mode Banner */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            className="fixed top-20 left-4 right-4 z-40"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 shadow-xl border border-yellow-300/50 backdrop-blur-xl"
              animate={{ 
                boxShadow: [
                  '0 4px 6px -1px rgba(245, 158, 11, 0.4)',
                  '0 10px 15px -3px rgba(245, 158, 11, 0.3)',
                  '0 4px 6px -1px rgba(245, 158, 11, 0.4)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <WifiOff className="w-6 h-6 text-white" />
                </motion.div>
                
                <div className="flex-1">
                  <p className="text-white font-bold text-lg">Offline Mode Active</p>
                  <p className="text-yellow-100 text-sm">SMS fallback enabled • {offlineQueue} actions queued for sync</p>
                </div>
                
                <motion.button
                  onClick={() => setIsOnline(true)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RefreshCw className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Alert Preferences Modal */}
      <AnimatePresence>
        {showPreferences && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/20 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Alert Preferences</h3>
                </div>
                <motion.button 
                  onClick={() => setShowPreferences(false)}
                  className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors flex items-center justify-center w-10 h-10 bg-gray-800/60 border border-gray-600/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close preferences"
                >
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'weather', label: 'Weather Alerts', desc: 'Rain, storms, extreme weather', icon: CloudRain, color: 'blue' },
                  { key: 'crime', label: 'Security Alerts', desc: 'Safety zones, security incidents', icon: Shield, color: 'red' },
                  { key: 'traffic', label: 'Traffic Updates', desc: 'Road conditions, congestion', icon: Car, color: 'yellow' },
                  { key: 'health', label: 'Health Advisories', desc: 'Medical facilities, health tips', icon: HeartHandshake, color: 'green' },
                  { key: 'cultural', label: 'Cultural Events', desc: 'Festivals, local experiences', icon: Star, color: 'purple' }
                ].map((pref) => (
                  <motion.div
                    key={pref.key}
                    className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-${pref.color}-100 rounded-xl flex items-center justify-center`}>
                        <pref.icon className={`w-5 h-5 text-${pref.color}-600`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{pref.label}</p>
                        <p className="text-sm text-gray-600">{pref.desc}</p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setAlertPreferences(prev => ({ ...prev, [pref.key]: !prev[pref.key as keyof typeof prev] }))}
                      className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        alertPreferences[pref.key as keyof typeof alertPreferences] ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="w-5 h-5 bg-white rounded-full shadow-lg"
                        animate={{ x: alertPreferences[pref.key as keyof typeof alertPreferences] ? 28 : 2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={() => setShowPreferences(false)}
                className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save Preferences
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Emergency Contacts Modal */}
      <AnimatePresence>
        {showEmergencyContacts && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/20 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Emergency Contacts</h3>
                </div>
                <motion.button 
                  onClick={() => setShowEmergencyContacts(false)}
                  className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors flex items-center justify-center w-10 h-10 bg-gray-800/60 border border-gray-600/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close emergency contacts"
                >
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              <div className="space-y-3">
                {emergencyContacts.map((contact) => (
                  <motion.div
                    key={contact.id}
                    className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100/50 shadow-sm"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          contact.type === 'police' ? 'bg-blue-100' :
                          contact.type === 'medical' ? 'bg-red-100' :
                          contact.type === 'fire' ? 'bg-orange-100' :
                          contact.type === 'tourist' ? 'bg-green-100' :
                          'bg-purple-100'
                        }`}>
                          {contact.type === 'police' ? <Shield className="w-5 h-5 text-blue-600" /> :
                           contact.type === 'medical' ? <HeartHandshake className="w-5 h-5 text-red-600" /> :
                           contact.type === 'fire' ? <AlertTriangle className="w-5 h-5 text-orange-600" /> :
                           contact.type === 'tourist' ? <MapPin className="w-5 h-5 text-green-600" /> :
                           <Heart className="w-5 h-5 text-purple-600" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{contact.name}</p>
                          <p className="text-sm text-gray-600">{contact.distance} • {contact.responseTime}</p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => window.open(`tel:${contact.number}`)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Call {contact.number}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={() => setShowEmergencyContacts(false)}
                className="w-full mt-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-2xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incident Reporting Modal */}
      <AnimatePresence>
        {showIncidentReport && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/20 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Report Incident</h3>
                </div>
                <motion.button 
                  onClick={() => setShowIncidentReport(false)}
                  className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors flex items-center justify-center w-10 h-10 bg-gray-800/60 border border-gray-600/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close incident report"
                >
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Incident Type</label>
                  <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Safety Concern</option>
                    <option>Medical Emergency</option>
                    <option>Traffic Issue</option>
                    <option>Lost Property</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                    placeholder="Describe what happened..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700">{lastKnownLocation}</span>
                    <span className="ml-auto text-xs text-green-600 font-semibold">✓ Verified</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Add Photo</span>
                  </motion.button>
                  <motion.button
                    className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Voice Note</span>
                  </motion.button>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <motion.button
                  onClick={() => setShowIncidentReport(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-2xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-6 rounded-2xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Submit Report
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Community Hub - Discord-like Interface */}
      <AnimatePresence>
        {showCommunityChat && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-3xl w-full max-w-4xl h-[90vh] shadow-2xl border border-gray-700 overflow-hidden flex"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Sidebar - Channels */}
              <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">SmartYatra Hub</h3>
                        <p className="text-xs text-gray-400">34 tourists online</p>
                      </div>
                    </div>
                    <motion.button 
                      onClick={() => setShowCommunityChat(false)}
                      className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors flex items-center justify-center w-10 h-10 bg-gray-800/60 border border-gray-600/50"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Close community chat"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Channels List */}
                <div className="flex-1 p-4 space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tourist Channels</h4>
                    <div className="space-y-1">
                      {[
                        { name: 'general-chat', icon: '💬', active: true, unread: 0 },
                        { name: 'safety-alerts', icon: '🛡️', active: false, unread: 3 },
                        { name: 'local-tips', icon: '📍', active: false, unread: 0 },
                        { name: 'weather-updates', icon: '🌤️', active: false, unread: 1 },
                        { name: 'group-meetups', icon: '👥', active: false, unread: 0 }
                      ].map((channel) => (
                        <motion.button
                          key={channel.name}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between ${
                            channel.active ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-sm">{channel.icon}</span>
                            <span className="text-sm font-medium"># {channel.name}</span>
                          </div>
                          {channel.unread > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {channel.unread}
                            </span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Direct Messages</h4>
                    <div className="space-y-1">
                      {[
                        { name: 'Sarah_T', status: 'online', avatar: '👩‍🦱', lastMsg: 'Great weather today!' },
                        { name: 'Local_Guide_Mike', status: 'online', avatar: '👨‍💼', lastMsg: 'Check out Ward Lake' },
                        { name: 'Emergency_Support', status: 'online', avatar: '🚨', lastMsg: 'How can I help?' }
                      ].map((user) => (
                        <motion.button
                          key={user.name}
                          className="w-full text-left px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <span className="text-lg">{user.avatar}</span>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                                user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{user.name}</p>
                              <p className="text-xs text-gray-500 truncate">{user.lastMsg}</p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <span className="text-2xl">🧳</span>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">You (Tourist)</p>
                      <p className="text-xs text-green-400">Online • Shillong</p>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <Settings className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-700 bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">💬</span>
                      <div>
                        <h3 className="font-bold text-white"># general-chat</h3>
                        <p className="text-xs text-gray-400">34 members • Share tips and connect with fellow tourists</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                        <Users className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                        <Search className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-900">
                  {[
                    {
                      id: 1,
                      user: 'Sarah_T',
                      avatar: '👩‍🦱',
                      time: '2:34 PM',
                      message: 'Amazing weather at Ward Lake today! Perfect for photography 📸',
                      reactions: [{ emoji: '❤️', count: 8 }, { emoji: '📸', count: 3 }],
                      isOwn: false
                    },
                    {
                      id: 2,
                      user: 'Local_Guide_Mike',
                      avatar: '👨‍💼',
                      time: '2:36 PM',
                      message: 'Pro tip: Visit Don Bosco Museum before 4 PM to avoid crowds. Also, try the local momos at Police Bazaar! 🥟',
                      reactions: [{ emoji: '👍', count: 12 }, { emoji: '🙏', count: 5 }],
                      isOwn: false,
                      isVerified: true
                    },
                    {
                      id: 3,
                      user: 'You',
                      avatar: '🧳',
                      time: '2:38 PM',
                      message: 'Thanks for the tip! Just arrived at Ward Lake and it\'s absolutely beautiful 🌊',
                      reactions: [{ emoji: '🌊', count: 4 }],
                      isOwn: true
                    },
                    {
                      id: 4,
                      user: 'Weather_Bot',
                      avatar: '🤖',
                      time: '2:40 PM',
                      message: '🌧️ Light rain expected in 30 minutes. Don\'t forget your umbrellas!',
                      reactions: [{ emoji: '☂️', count: 15 }],
                      isOwn: false,
                      isBot: true
                    }
                  ].map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`flex space-x-3 group ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex-shrink-0">
                        <span className="text-xl">{msg.avatar}</span>
                      </div>
                      
                      <div className={`flex-1 max-w-lg ${msg.isOwn ? 'text-right' : ''}`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`font-semibold text-sm ${
                            msg.isOwn ? 'text-blue-400' : 
                            msg.isBot ? 'text-purple-400' :
                            msg.isVerified ? 'text-green-400' : 'text-gray-300'
                          }`}>
                            {msg.user}
                          </span>
                          {msg.isVerified && <CheckCircle className="w-3 h-3 text-green-400" />}
                          {msg.isBot && <span className="bg-purple-500 text-white text-xs px-1 py-0.5 rounded">BOT</span>}
                          <span className="text-xs text-gray-500">{msg.time}</span>
                        </div>
                        
                        <div className={`p-3 rounded-2xl ${msg.isOwn ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'} shadow-lg`}>
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                        </div>
                        
                        {/* Reactions */}
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex items-center space-x-1 mt-2 flex-wrap">
                            {msg.reactions.map((reaction, index) => (
                              <motion.button
                                key={index}
                                className="bg-gray-800 hover:bg-gray-700 rounded-full px-2 py-1 flex items-center space-x-1 text-xs transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <span>{reaction.emoji}</span>
                                <span className="text-gray-300">{reaction.count}</span>
                              </motion.button>
                            ))}
                            <motion.button
                              className="bg-gray-800 hover:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors opacity-0 group-hover:opacity-100"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <span>+</span>
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-700 bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                      <Camera className="w-5 h-5 text-gray-400" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Message #general-chat"
                        className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                        <span className="text-lg">😊</span>
                      </button>
                    </div>
                    <motion.button
                      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageSquare className="w-5 h-5" />
                    </motion.button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2 mt-3">
                    {[
                      { label: 'Share Location', icon: MapPin, color: 'bg-green-600' },
                      { label: 'Weather Update', icon: CloudRain, color: 'bg-blue-600' },
                      { label: 'Safety Alert', icon: AlertTriangle, color: 'bg-red-600' },
                      { label: 'Local Tip', icon: Star, color: 'bg-yellow-600' }
                    ].map((action) => (
                      <motion.button
                        key={action.label}
                        className={`${action.color} hover:opacity-80 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 transition-all`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <action.icon className="w-3 h-3" />
                        <span>{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Online Users Sidebar */}
              <div className="w-60 bg-gray-800 border-l border-gray-700 p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-4">Online Now — 34</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Sarah_T', avatar: '👩‍🦱', status: 'Exploring Ward Lake', role: 'Tourist' },
                    { name: 'Local_Guide_Mike', avatar: '👨‍💼', status: 'Available for help', role: 'Local Guide' },
                    { name: 'Alex_Photo', avatar: '📸', status: 'Photography tour', role: 'Tourist' },
                    { name: 'Emergency_Support', avatar: '🚨', status: 'Always here', role: 'Support' },
                    { name: 'Weather_Bot', avatar: '🤖', status: 'Monitoring weather', role: 'Bot' }
                  ].map((user) => (
                    <motion.div
                      key={user.name}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="relative">
                        <span className="text-sm">{user.avatar}</span>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-gray-800" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.status}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather Forecast Component */}
      <WeatherForecast
        isVisible={showWeatherForecast}
        onClose={() => setShowWeatherForecast(false)}
        location={lastKnownLocation}
      />

      {/* Travel Tips Modal */}
      <AnimatePresence>
        {showTravelTips && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-700/50 max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
               <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Travel Tips</h3>
                    <p className="text-sm text-gray-400">Local insights & safety</p>
                  </div>
                </div>
                <motion.button 
                  onClick={() => setShowTravelTips(false)}
                  className="p-2 rounded-xl hover:bg-gray-700/50 transition-colors flex items-center justify-center w-10 h-10 bg-gray-800/60 border border-gray-600/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close travel tips"
                >
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>

              {/* Tips Categories */}
              <div className="space-y-6">
                {Object.entries(travelTips).map(([category, tips]) => (
                  <div key={category}>
                    <h4 className="font-bold text-gray-900 mb-3 capitalize flex items-center space-x-2">
                      {category === 'cultural' && <Star className="w-4 h-4 text-purple-500" />}
                      {category === 'safety' && <Shield className="w-4 h-4 text-red-500" />}
                      {category === 'attractions' && <Camera className="w-4 h-4 text-blue-500" />}
                      <span>{category} Tips</span>
                    </h4>
                    
                    <div className="space-y-3">
                      {tips.map((tip) => (
                        <motion.div
                          key={tip.id}
                          className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100/50"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl">{tip.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-gray-900">{tip.title}</h5>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                  {tip.category}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">{tip.content}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 flex space-x-3">
                <motion.button
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>More Tips</span>
                </motion.button>
                <motion.button
                  onClick={() => setShowTravelTips(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Destination Ratings Component */}
      <DestinationRatings
        isVisible={showDestinationRatings}
        onClose={() => setShowDestinationRatings(false)}
        currentLocation={lastKnownLocation}
      />

      {/* Group Mode Indicator */}
      <AnimatePresence>
        {groupMode && (
          <motion.div
            className="fixed top-32 right-4 z-40"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div
              className="bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl p-4 shadow-xl border border-green-300/50 backdrop-blur-xl min-w-[200px]"
              animate={{ 
                boxShadow: [
                  '0 4px 6px -1px rgba(34, 197, 94, 0.4)',
                  '0 10px 15px -3px rgba(34, 197, 94, 0.3)',
                  '0 4px 6px -1px rgba(34, 197, 94, 0.4)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Users className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <p className="text-white font-bold text-sm">Group Mode Active</p>
                  <p className="text-green-100 text-xs">{groupMembers.length} members tracked</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {groupMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between text-xs">
                    <span className="text-white font-medium">{member.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        member.status === 'safe' ? 'bg-green-200' : 'bg-yellow-200'
                      }`} />
                      <span className="text-green-100">{member.distance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating Chat Widget */}
      <FloatingChatWidget
        languages={{
          en: { name: 'English', flag: '🇬🇧', nativeName: 'English' },
          hi: { name: 'हिंदी', flag: '🇮🇳', nativeName: 'हिंदी' },
          as: { name: 'অসমীয়া', flag: '🇮🇳', nativeName: 'অসমীয়া' },
          bn: { name: 'বাংলা', flag: '🇧🇩', nativeName: 'বাংলা' }
        }}
        currentLanguage={currentLanguage}
        onLanguageChange={(lang) => {
          setCurrentLanguage(lang);
          setHasNewMessage(false);
        }}
        onChatToggle={() => {
          setShowChatbot(!showChatbot);
          setHasNewMessage(false);
        }}
        onFeatureClick={(feature) => {
          // Handle quick action clicks from chatbot
          if (feature === 'sos') {
            setShowEmergencyPopup(true);
          } else if (feature === 'map') {
            setShowRoutes(true);
          }
        }}
        onQRModalOpen={() => {
          // Handle QR modal if needed
          console.log('QR Modal requested from chatbot');
        }}
        isOpen={showChatbot}
        hasNewMessage={hasNewMessage && !showChatbot}
      />
    </div>
  );
};

export default TouristDashboard;