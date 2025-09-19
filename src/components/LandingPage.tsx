import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Smartphone, 
  Monitor, 
  UserCheck, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Zap, 
  Globe, 
  Brain, 
  Lock,
  ArrowRight, 
  TrendingUp, 
  Wifi, 
  WifiOff,
  X, 
  Download, 
  QrCode, 
  Camera, 
  Battery, 
  SignalMedium, 
  Menu,
  BarChart3
} from 'lucide-react';

import QRCode from 'qrcode';
import Button from './ui/Button';
import Card from './ui/Card';
import MapComponent from './common/MapComponent';
import MobileAppMockup from './common/MobileAppMockup';
import FloatingChatWidget from './common/FloatingChatWidget';
import StatsSection from './common/StatsSection';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue when using real maps
import L from 'leaflet';

// Fix Leaflet default icon paths (use CDN or local paths as needed)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LandingPage: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -25]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);

  // Interactive Mockup State
  const [mockupState, setMockupState] = useState({
    activeFeature: 'map' as 'map' | 'sos' | 'stats' | 'id',
    userMode: 'tourist' as 'tourist' | 'authority',
    sosCountdown: null as number | null,
    isOnline: true,
    threatLevel: 'LOW' as 'LOW' | 'MODERATE' | 'HIGH',
    safetyScore: 87,
    isEmergencyActive: false,
    showQRModal: false,
    showChatbot: false,
    showMapControls: false,
    selectedMarker: null as string | null,
    currentLanguage: 'en' as 'en' | 'hi' | 'as' | 'bn',
    mapView: 'street' as 'street' | 'satellite' | 'terrain',
    chatMessages: [] as Array<{id: string, text: string, sender: 'user' | 'bot', timestamp: Date}>,
    mapMarkers: [
      { id: 1, position: [25.5788, 91.8933] as [number, number], type: 'tourist', name: 'Rahul Sharma', status: 'safe' },
      { id: 2, position: [25.5698, 91.8853] as [number, number], type: 'authority', name: 'Police Station', status: 'active' },
      { id: 3, position: [25.5678, 91.8823] as [number, number], type: 'emergency', name: 'Medical Center', status: 'standby' }
    ],
    userName: 'Rohit Sharma',
    userPhone: '+91-98765-43210',
    userEmergencyContact: 'Amit Patel (+91-98765-43211)'
  });

  // QR Code state
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  // Language options
  const languages = {
    en: { name: 'English', flag: '🇬🇧', nativeName: 'English' },
    hi: { name: 'हिंदी', flag: '🇮🇳', nativeName: 'हिंदी' },
    as: { name: 'অসমীয়া', flag: '🇮🇳', nativeName: 'অসমীয়া' },
    bn: { name: 'বাংলা', flag: '🇧🇩', nativeName: 'বাংলা' }
  };

  // Chatbot responses by language - use useMemo to prevent recreation on each render
  const chatbotResponses = useMemo(() => ({
    en: {
      greeting: "Hi! I'm your AI safety assistant. How can I help you today?",
      emergency: "I've detected an emergency situation. Help is on the way. Stay calm.",
      safety: "Your current safety score is excellent. Enjoy your trip!",
      weather: "Weather conditions are favorable for outdoor activities."
    },
    hi: {
      greeting: "नमस्ते! मैं आपका AI सुरक्षा सहायक हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
      emergency: "मैंने आपातकालीन स्थिति का पता लगाया है। सहायता आ रही है। शांत रहें।",
      safety: "आपका वर्तमान सुरक्षा स्कोर उत्कृष्ट है। अपनी यात्रा का आनंद लें!",
      weather: "मौसमी स्थितियां बाहरी गतिविधियों के लिए अनुकूल हैं।"
    },
    as: {
      greeting: "নমস্কাৰ! মই আপোনাৰ AI সুৰক্ষা সহায়ক। আজি মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?",
      emergency: "মই এক জৰুৰীকালীন অৱস্থা চিনাক্ত কৰিছো। সহায় আহি আছে। শান্ত থাকক।",
      safety: "আপোনাৰ বৰ্তমান সুৰক্ষা স্ক'ৰ উৎকৃষ্ট। আপোনাৰ যাত্ৰা উপভোগ কৰক!",
      weather: "বতৰৰ অৱস্থা বাহিৰৰ কাৰ্যকলাপৰ বাবে অনুকূল।"
    },
    bn: {
      greeting: "নমস্কার! আমি আপনার AI নিরাপত্তা সহায়ক। আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি?",
      emergency: "আমি একটি জরুরি অবস্থা শনাক্ত করেছি। সাহায্য আসছে। শান্ত থাকুন।",
      safety: "আপনার বর্তমান নিরাপত্তা স্কোর চমৎকার। আপনার ভ্রমণ উপভোগ করুন!",
      weather: "আবহাওয়া পরিস্থিতি বহিরঙ্গন কার্যক্রমের জন্য অনুকূল।"
    }
  }), []);

  // Generate QR Code
  useEffect(() => {
    const generateQR = async () => {
      try {
        const appUrl = 'https://yatrakavach.app/download';
        const url = await QRCode.toDataURL(appUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#10b981',
            light: '#ffffff'
          }
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error('QR Code generation failed:', err);
      }
    };
    generateQR();
  }, []);

  // Add initial chatbot message
  useEffect(() => {
    if (mockupState.showChatbot && mockupState.chatMessages.length === 0) {
      const welcomeMessage = {
        id: 'welcome-' + Date.now(),
        text: chatbotResponses[mockupState.currentLanguage].greeting,
        sender: 'bot' as const,
        timestamp: new Date()
      };
      setMockupState(prev => ({
        ...prev,
        chatMessages: [welcomeMessage]
      }));
    }
  }, [mockupState.showChatbot, mockupState.currentLanguage, mockupState.chatMessages.length, chatbotResponses]);

  // Simulate new message for demo purposes
  const [hasNewMessage, setHasNewMessage] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNewMessage(true);
    }, 10000); // Show new message indicator after 10 seconds
    
    return () => clearTimeout(timer);
  }, []);

  // SOS Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mockupState.sosCountdown !== null && mockupState.sosCountdown > 0) {
      interval = setInterval(() => {
        setMockupState(prev => ({
          ...prev,
          sosCountdown: prev.sosCountdown! - 1
        }));
      }, 1000);
    } else if (mockupState.sosCountdown === 0) {
      setMockupState(prev => ({
        ...prev,
        isEmergencyActive: true,
        sosCountdown: null
      }));
    }
    return () => clearInterval(interval);
  }, [mockupState.sosCountdown]);

  // Feature Content Renderer
  const renderFeatureContent = () => {
    const { activeFeature, sosCountdown, isEmergencyActive } = mockupState;

    if (activeFeature === 'sos' && (sosCountdown !== null || isEmergencyActive)) {
      return renderSOSView();
    }

    switch (activeFeature) {
      case 'map':
        return renderMapView();
      case 'sos':
        return renderSOSView();
      case 'stats':
        return renderStatsView();
      case 'id':
        return renderIDView();
      default:
        return renderMapView();
    }
  };

  const renderMapView = () => {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="absolute inset-0 flex flex-col bg-gray-900"
      >
        <div className="flex flex-col bg-black text-white">
          {/* iPhone-style Status Bar */}
          <div className="flex justify-between items-center px-4 h-6 text-[10px] font-semibold">
            <span>9:41</span>
            <div className="flex items-center space-x-1">
              {/* WiFi Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 15a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm0-4a3.5 3.5 0 012.45 1.02.75.75 0 001.06-1.06A5 5 0 0010 9a5 5 0 00-3.5 1.46.75.75 0 001.06 1.06A3.5 3.5 0 0110 11zm0-4a7.5 7.5 0 015.3 2.2.75.75 0 001.06-1.06A9 9 0 0010 5a9 9 0 00-6.36 2.64.75.75 0 001.06 1.06A7.5 7.5 0 0110 7z" />
              </svg>
              {/* Battery Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 10h1a1 1 0 011 1v2a1 1 0 01-1 1h-1v-4z" />
                <path
                  fillRule="evenodd"
                  d="M2 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm2 0h14v10H4V7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="bg-gray-800 px-4 py-3 flex justify-between items-center border-b border-gray-700 flex-shrink-0">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
              <div className="ml-2 text-left">
                <h3 className="text-white font-bold text-xs">YatraKavach</h3>
              </div>
            </div>
            <Menu className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Safety Score Card */}
          <div className="bg-emerald-500/10 backdrop-blur-sm rounded-xl p-3 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-xs font-medium">Safety Score</p>
                <p className="text-white text-lg font-bold">{mockupState.safetyScore}%</p>
              </div>
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Map Container - Contained Box */}
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 h-32">
            <div className="relative w-full h-full">
              <MapComponent 
                markers={mockupState.mapMarkers} 
                showSafeZones={true}
                showAlertZones={true}
                safeZones={[
                  {
                    center: [25.5788, 91.8933] as [number, number],
                    radius: 500,
                    color: '#10B981',
                    fillColor: '#10B981',
                    fillOpacity: 0.2
                  }
                ]}
                alertZones={[
                  {
                    center: [25.5738, 91.8893] as [number, number],
                    radius: 300,
                    color: '#EF4444',
                    fillColor: '#EF4444',
                    fillOpacity: 0.2
                  }
                ]}
              />
              
              {/* Map Controls Overlay */}
              <div className="absolute top-1 left-1 z-[500]">
                <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                  🗺️ Live Map
                </div>
              </div>
              
              {/* Zone Legend */}
              <div className="absolute top-1 right-1 bg-black/70 backdrop-blur-sm rounded-lg p-1 text-xs text-white z-[500]">
                <div className="flex items-center gap-1 mb-0.5">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  <span className="text-xs">Safe</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  <span className="text-xs">Risk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/10">
              <p className="text-white/70 text-xs">Location</p>
              <p className="text-white text-xs font-medium">Shillong, ML</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/10">
              <p className="text-white/70 text-xs">Status</p>
              <p className="text-emerald-300 text-xs font-medium">Protected</p>
            </div>
          </div>

          {/* Emergency Button */}
          <motion.button
            className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-xl p-2 flex items-center justify-center gap-2 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleFeatureClick('sos')}
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-xs font-medium">Emergency SOS</span>
          </motion.button>
        </div>
      </motion.div>
    );
  };

  // Note: Previous renderTouristMapContent and renderAuthorityMapContent functions removed as they were not used

  // Note: Previous renderTouristMapContent and renderAuthorityMapContent functions removed as they were not used

  const renderSOSView = () => {
    const { sosCountdown, isEmergencyActive, userMode } = mockupState;

    if (userMode === 'authority') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 p-4 flex flex-col"
        >
          <div className="text-center mb-6">
            <h3 className="text-white font-bold text-lg">Emergency Alerts</h3>
            <p className="text-crimson-300 text-sm">Incoming SOS Signals</p>
          </div>

          <div className="space-y-4 flex-1">
            <motion.div 
              className="bg-crimson-500/20 backdrop-blur-md rounded-xl p-4 border border-crimson-500/30"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-crimson-400 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-medium text-sm">Tourist #T247</p>
                  <p className="text-white/80 text-xs">Location: Police Bazaar • 2 min ago</p>
                </div>
              </div>
            </motion.div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <p className="text-white text-sm mb-2">Dispatch Status</p>
                <p className="text-emerald-300 font-bold">Unit 12 En Route</p>
                <p className="text-white/70 text-xs">ETA: 3 minutes</p>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (sosCountdown !== null) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 p-4 flex flex-col items-center justify-center"
        >
          <motion.div
            className="w-32 h-32 rounded-full border-4 border-crimson-400 flex items-center justify-center mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="text-4xl font-bold text-white">{sosCountdown}</span>
          </motion.div>
          <h3 className="text-white font-bold text-xl mb-2">Emergency Activating</h3>
          <p className="text-crimson-300 text-sm text-center">Release to cancel • Help will be dispatched</p>
        </motion.div>
      );
    }

    if (isEmergencyActive) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 p-4 flex flex-col items-center justify-center"
        >
          <motion.div
            className="w-16 h-16 bg-crimson-500 rounded-full flex items-center justify-center mb-6"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <AlertTriangle className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-crimson-300 font-bold text-xl mb-2">🚨 EMERGENCY ACTIVE</h3>
          <p className="text-white text-sm text-center mb-4">Help is on the way</p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 w-full">
            <div className="text-center">
              <p className="text-emerald-300 font-bold">✅ Officer Sarah M.</p>
              <p className="text-white/80 text-xs">Distance: 2.3km • ETA: 4 minutes</p>
            </div>
          </div>

          <motion.button
            className="mt-4 px-6 py-2 bg-white/20 rounded-lg text-white text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMockupState(prev => ({ ...prev, isEmergencyActive: false, activeFeature: 'map' }))}
          >
            Cancel Emergency
          </motion.button>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute inset-0 p-4 flex flex-col items-center justify-center"
      >
        <motion.div
          className="w-24 h-24 bg-crimson-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-crimson-500/50"
          whileHover={{ scale: 1.1 }}
        >
          <AlertTriangle className="w-12 h-12 text-crimson-400" />
        </motion.div>
        <h3 className="text-white font-bold text-xl mb-2">Emergency SOS</h3>
        <p className="text-white/80 text-sm text-center mb-6">Press and hold for 3 seconds to send emergency alert</p>
        <p className="text-emerald-300 text-xs text-center">Help will arrive in &lt;90 seconds</p>
      </motion.div>
    );
  };

  const renderStatsView = () => {
    const { userMode } = mockupState;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="absolute inset-0 p-4"
      >
        <div className="text-center mb-6">
          <h3 className="text-white font-bold text-lg">
            {userMode === 'tourist' ? 'Safety Analytics' : 'District Analytics'}
          </h3>
          <p className="text-primary-300 text-sm">
            {userMode === 'tourist' ? 'Your safety insights' : 'Real-time metrics'}
          </p>
        </div>

        {userMode === 'tourist' ? (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h4 className="text-white font-semibold mb-3">Safety Score Breakdown</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">🌤️ Weather</span>
                  <span className="text-emerald-300 font-bold">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">👥 Crowd Density</span>
                  <span className="text-emerald-300 font-bold">82%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">📊 History</span>
                  <span className="text-emerald-300 font-bold">88%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80 text-sm">🛡️ Coverage</span>
                  <span className="text-emerald-300 font-bold">94%</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h4 className="text-white font-semibold mb-3">Recent Activity</h4>
              <div className="space-y-2 text-sm">
                <div className="text-white/80">• 12 tourists checked in safely</div>
                <div className="text-white/80">• 0 incidents in past 24h</div>
                <div className="text-emerald-300">• Response time: &lt;90s average</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h4 className="text-white font-semibold mb-3">District Overview</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-300">247</div>
                  <div className="text-xs text-white/70">Active Tourists</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-300">15</div>
                  <div className="text-xs text-white/70">Response Units</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h4 className="text-white font-semibold mb-3">Today's Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="text-white/80">• 3 incidents resolved</div>
                <div className="text-white/80">• 84s avg response time</div>
                <div className="text-emerald-300">• 99.2% safety score</div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const renderIDView = () => {
    const { userMode, userName, userPhone, userEmergencyContact } = mockupState;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="absolute inset-0 p-4"
      >
        <div className="text-center mb-6">
          <h3 className="text-white font-bold text-lg">
            {userMode === 'tourist' ? 'Digital Passport' : 'ID Verification'}
          </h3>
          <p className="text-golden-300 text-sm">
            {userMode === 'tourist' ? 'Your travel identity' : 'Verify tourist IDs'}
          </p>
        </div>

        {userMode === 'tourist' ? (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-golden-500/20 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-golden-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Digital Tourist ID</p>
                  <p className="text-emerald-300 text-xs">✅ Verified</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Name:</span>
                  <span className="text-white">{userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Phone:</span>
                  <span className="text-white">{userPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Emergency:</span>
                  <span className="text-white text-xs">{userEmergencyContact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Languages:</span>
                  <span className="text-white">English, हिंदी, অসমীয়া</span>
                </div>
              </div>
            </div>

            {/* Enhanced QR Code Section */}
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMockupState(prev => ({ ...prev, showQRModal: true }))}
            >
              <div className="w-20 h-20 bg-white/20 rounded-lg mx-auto mb-2 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <p className="text-white font-medium text-sm mb-1">Tap to show QR</p>
              <p className="text-white/70 text-xs">Valid until: Dec 15, 2025</p>
              <p className="text-emerald-300 text-xs mt-1">📱 Download App</p>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h4 className="text-white font-semibold mb-3">Verification Scanner</h4>
              <div className="text-center py-8">
                <div className="w-16 h-16 border-2 border-golden-400 rounded-lg mx-auto mb-4 flex items-center justify-center relative">
                  <Camera className="w-8 h-8 text-golden-400" />
                  {/* Scanning animation */}
                  <motion.div
                    className="absolute inset-0 border-2 border-emerald-400 rounded-lg"
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0.8, 1.1, 0.8]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <p className="text-white/80 text-sm">Scan tourist QR code</p>
                <p className="text-golden-300 text-xs">Ready to verify</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <h4 className="text-white font-semibold mb-3">Recent Verifications</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">• Rohit Sharma</span>
                  <span className="text-emerald-300 text-xs">✅ Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">• Rahul Sharma</span>
                  <span className="text-emerald-300 text-xs">✅ Verified</span>
                </div>
                <div className="text-emerald-300 text-center pt-2 border-t border-white/10">
                  47 verifications today
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  const handleFeatureClick = (feature: 'map' | 'sos' | 'stats' | 'id') => {
    if (feature === 'sos' && mockupState.userMode === 'tourist') {
      // Start SOS countdown
      setMockupState(prev => ({ 
        ...prev, 
        activeFeature: feature,
        sosCountdown: 3,
        isEmergencyActive: false
      }));
    } else {
      setMockupState(prev => ({ 
        ...prev, 
        activeFeature: feature,
        sosCountdown: null,
        isEmergencyActive: false
      }));
    }
  };

  const handleModeToggle = (mode: 'tourist' | 'authority') => {
    setMockupState(prev => ({ 
      ...prev, 
      userMode: mode,
      activeFeature: 'map',
      sosCountdown: null,
      isEmergencyActive: false
    }));
  };

  // QR Modal Component
  const renderQRModal = () => {
    if (!mockupState.showQRModal) return null;

    return (
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setMockupState(prev => ({ ...prev, showQRModal: false }))}
      >
        <motion.div
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center max-w-sm w-full relative"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            onClick={() => setMockupState(prev => ({ ...prev, showQRModal: false }))}
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">YatraKavach App</h3>
            <p className="text-white/70 text-sm">Download for complete protection</p>
          </div>

          <div className="bg-white rounded-2xl p-6 mb-6">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="Download QR Code" className="w-32 h-32 mx-auto" />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          <div className="space-y-3 mb-6">
            <motion.a
              href="https://apps.apple.com/app/yatrakavach"
              className="flex items-center justify-center gap-3 bg-black/50 rounded-xl p-3 text-white hover:bg-black/70 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Download for iOS</span>
            </motion.a>
            <motion.a
              href="https://play.google.com/store/apps/details?id=com.yatrakavach"
              className="flex items-center justify-center gap-3 bg-emerald-600 rounded-xl p-3 text-white hover:bg-emerald-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5" />
              <span className="font-medium">Download for Android</span>
            </motion.a>
          </div>

          <div className="text-left space-y-2">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>24/7 AI Protection</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <MapPin className="w-4 h-4 text-primary-400" />
              <span>Real-time Location Tracking</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <AlertTriangle className="w-4 h-4 text-golden-400" />
              <span>Instant Emergency Response</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-primary-800 relative overflow-hidden">
      {/* Subtle Background Element */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16 relative z-10">
        {/* Interactive iPhone Mockup Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Left Column - Compelling Copy & CTAs */}
          <motion.div
            className="text-left space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Trust Badges */}
            <motion.div
              className="flex flex-wrap items-center gap-3"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 bg-emerald-500/10 backdrop-blur-xl px-4 py-2 rounded-full border border-emerald-500/20 shadow-lg">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-300 font-medium">Government Certified</span>
              </div>
              <div className="flex items-center gap-2 bg-primary-500/10 backdrop-blur-xl px-4 py-2 rounded-full border border-primary-500/20 shadow-lg">
                <Lock className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-primary-300 font-medium">Blockchain Secured</span>
              </div>
            </motion.div>

            {/* Urgent, Emotionally Grounded Headline */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight"
              variants={itemVariants}
            >
              <span className="text-emerald-300">Never Travel Alone</span>
              <br />
              Without Yatra Kavach
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-primary-400 bg-clip-text text-transparent text-3xl md:text-4xl lg:text-5xl">
                AI Protects You 24/7
              </span>
            </motion.h1>

            {/* Pain Point → Solution Mapping */}
            <motion.p
              className="text-xl md:text-2xl text-primary-200 max-w-2xl leading-relaxed"
              variants={itemVariants}
            >
              Smart safety tech protecting <span className="text-emerald-300 font-semibold">50,000+ travelers</span>  
              across Northeast India — in real time.
            </motion.p>



            {/* Key Feature Promise */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              variants={itemVariants}
              role="list"
              aria-label="Key safety features"
            >
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300" role="listitem">
                <div className="w-10 h-10 bg-emerald-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Live GPS Tracking</h4>
                  <p className="text-primary-300 text-sm">Never get lost again</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl rounded-lg p-4 border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300" role="listitem">
                <div className="w-10 h-10 bg-crimson-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-crimson-400" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">90s Emergency Response</h4>
                  <p className="text-primary-300 text-sm">Help arrives instantly</p>
                </div>
              </div>
            </motion.div>

            {/* Primary & Secondary CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
              role="group"
              aria-label="Main action buttons"
            >
              <Button 
                size="xl" 
                className="group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-2xl hover:shadow-emerald-500/25 min-w-[260px] backdrop-blur-xl border border-emerald-400/20"
                aria-describedby="start-journey-desc"
              >
                <Link to="/tourist/onboarding" className="flex items-center" aria-label="Start your protected journey">
                  <Shield className="mr-2 w-5 h-5" aria-hidden="true" />
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Link>
              </Button>
              <span id="start-journey-desc" className="sr-only">Begin your safe travel experience with AI-powered protection</span>
              
              <Button 
                variant="outline" 
                size="xl" 
                className="text-white border-white/60 hover:bg-white/10 backdrop-blur-xl min-w-[220px] border-2 hover:border-white/80 transition-all duration-300"
                aria-describedby="command-center-desc"
              >
                <Link to="/police/dashboard" className="flex items-center" aria-label="Access command center">
                  <Monitor className="mr-2 w-5 h-5" aria-hidden="true" />
                  Command Center
                </Link>
              </Button>
              <span id="command-center-desc" className="sr-only">Access the law enforcement dashboard for monitoring and response</span>
            </motion.div>

            {/* Impact Snapshot */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-primary-400 mb-16 md:mb-20"
              style={{ y: y1 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              role="region"
              aria-label="Key performance statistics"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>50,000+ Tourists Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>99.8% Safety Score</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary-400" />
                <span>&lt;90s Avg. Response</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>247 Coverage Areas</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Interactive iPhone Mockup */}
          <motion.div
            className="relative flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* User Mode Toggle */}
            <motion.div 
              className="absolute -top-24 left-1/2 transform -translate-x-1/2 z-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      mockupState.userMode === 'tourist' 
                        ? 'bg-emerald-500 text-white shadow-lg' 
                        : 'text-white/70 hover:text-white'
                    }`}
                    onClick={() => handleModeToggle('tourist')}
                  >
                    🧳 Tourist
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      mockupState.userMode === 'authority' 
                        ? 'bg-primary-500 text-white shadow-lg' 
                        : 'text-white/70 hover:text-white'
                    }`}
                    onClick={() => handleModeToggle('authority')}
                  >
                    🛡️ Authority
                  </button>
                </div>
              </div>
            </motion.div>

            {/* iPhone Mockup Container */}
            <div className="relative mt-10">
              {/* iPhone Frame */}
              <div className="relative w-[300px] h-[600px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl">
                {/* iPhone Screen */}
                <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                  {/* Status Bar - AquaShield Style */}
                  <div className="absolute top-0 left-0 right-0 bg-gray-900 z-50">
                    <div className="flex justify-between items-center px-6 py-1 text-xs">
                      <div>9:41 AM</div>
                      <div className="flex space-x-2">
                        <SignalMedium className="w-4 h-4" />
                        {mockupState.isOnline ? (
                          <Wifi className="w-4 h-4" />
                        ) : (
                          <WifiOff className="w-4 h-4 text-white/50" />
                        )}
                        <Battery className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* App Content Area - AquaShield Style */}
                  <div className="pt-6 pb-16 h-full bg-gray-900 relative overflow-hidden">
                    {/* Dynamic Content Switcher */}
                    <AnimatePresence mode="wait">
                      {renderFeatureContent()}
                    </AnimatePresence>

                    {/* Connection Status */}
                    {!mockupState.isOnline && (
                      <motion.div
                        className="absolute top-12 left-4 right-4 bg-crimson-500/90 backdrop-blur-md rounded-lg p-2 border border-crimson-400/50"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="flex items-center gap-2">
                          <WifiOff className="w-4 h-4 text-white" />
                          <span className="text-white text-xs">Offline - Emergency SOS still works</span>
                        </div>
                      </motion.div>
                    )}

                    {/* Bottom Navigation - AquaShield Style */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
                      <div className="flex justify-around p-3">
                        <button 
                          className="flex flex-col items-center"
                          onClick={() => handleFeatureClick('map')}
                        >
                          <MapPin className={`w-5 h-5 ${mockupState.activeFeature === 'map' ? 'text-emerald-500' : 'text-white/60'}`} />
                          <span className={`text-xs mt-1 ${mockupState.activeFeature === 'map' ? 'text-emerald-400' : 'text-white/60'}`}>Map</span>
                        </button>
                        
                        <button 
                          className="flex flex-col items-center"
                          onClick={() => handleFeatureClick('stats')}
                        >
                          <BarChart3 className={`w-5 h-5 ${mockupState.activeFeature === 'stats' ? 'text-emerald-500' : 'text-white/60'}`} />
                          <span className={`text-xs mt-1 ${mockupState.activeFeature === 'stats' ? 'text-emerald-400' : 'text-white/60'}`}>Stats</span>
                        </button>
                        
                        <button 
                          className="flex flex-col items-center"
                          onClick={() => handleFeatureClick('id')}
                        >
                          <UserCheck className={`w-5 h-5 ${mockupState.activeFeature === 'id' ? 'text-emerald-500' : 'text-white/60'}`} />
                          <span className={`text-xs mt-1 ${mockupState.activeFeature === 'id' ? 'text-emerald-400' : 'text-white/60'}`}>
                            {mockupState.userMode === 'tourist' ? 'Profile' : 'Verify'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Tooltips */}
                    {/* {mockupState.activeFeature === 'map' && mockupState.userMode === 'tourist' && (
                      <motion.div
                        className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-crimson-500/90 backdrop-blur-md px-3 py-2 rounded-lg border border-crimson-400/50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: [0, 1, 1, 0], y: [-10, 0, 0, -10] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 5 }}
                      >
                        <p className="text-white text-xs font-medium">Tap SOS for instant help</p>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-crimson-500/90 rotate-45"></div>
                      </motion.div>
                    )} */}
                  </div>
                </div>

                {/* iPhone Home Indicator */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
              </div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -right-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full p-3 shadow-2xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full p-3 shadow-2xl"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>

              {/* Connection Toggle (Demo) */}
              <motion.button
                className="absolute -left-16 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMockupState(prev => ({ ...prev, isOnline: !prev.isOnline }))}
              >
                {mockupState.isOnline ? (
                  <Wifi className="w-5 h-5 text-emerald-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-crimson-400" />
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Interface Showcase */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
              Multi-Platform Ecosystem
            </h2>
            <p className="text-lg md:text-xl text-primary-300 max-w-3xl mx-auto leading-relaxed">
              Seamlessly integrated interfaces for tourists, law enforcement, and emergency responders
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link to="/tourist/onboarding">
                <Card variant="glass" className="h-full group cursor-pointer">
                  <div className="text-center">
                    <div className="bg-gradient-emerald p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                      <Smartphone className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Tourist App</h3>
                    <p className="text-primary-300 mb-4 text-sm md:text-base">
                      AI-powered safety companion with real-time monitoring and predictive alerts
                    </p>
                    <div className="flex items-center justify-center text-emerald-400 group-hover:translate-x-2 transition-transform">
                      <span className="font-medium">Launch App</span>
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link to="/police/dashboard">
                <Card variant="glass" className="h-full group cursor-pointer">
                  <div className="text-center">
                    <div className="bg-gradient-primary p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                      <Monitor className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Command Center</h3>
                    <p className="text-primary-300 mb-4 text-sm md:text-base">
                      Mission-critical dashboard for real-time monitoring and rapid response coordination
                    </p>
                    <div className="flex items-center justify-center text-primary-400 group-hover:translate-x-2 transition-transform">
                      <span className="font-medium">Access Dashboard</span>
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link to="/registration/welcome">
                <Card variant="glass" className="h-full group cursor-pointer">
                  <div className="text-center">
                    <div className="bg-gradient-primary p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                      <UserCheck className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Smart Kiosk</h3>
                    <p className="text-primary-300 mb-4 text-sm md:text-base">
                      Blockchain-secured registration with biometric authentication and digital ID
                    </p>
                    <div className="flex items-center justify-center text-primary-400 group-hover:translate-x-2 transition-transform">
                      <span className="font-medium">Register Now</span>
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link to="/emergency/response">
                <Card variant="glass" className="h-full group cursor-pointer">
                  <div className="text-center">
                    <div className="bg-gradient-emerald p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                      <AlertTriangle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Emergency Hub</h3>
                    <p className="text-primary-300 mb-4 text-sm md:text-base">
                      Instant emergency response with AI-powered threat assessment and coordination
                    </p>
                    <div className="flex items-center justify-center text-emerald-400 group-hover:translate-x-2 transition-transform">
                      <span className="font-medium">Emergency Access</span>
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Advanced Capabilities */}
        <motion.div
          className="mb-20"
          style={{ y: y2 }}
        >
          <Card variant="glass" className="p-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                Next-Generation Safety Technology
              </h2>
              <p className="text-lg md:text-xl text-primary-300 max-w-3xl mx-auto leading-relaxed">
                Powered by artificial intelligence, blockchain security, and real-time analytics to create 
                an unprecedented safety ecosystem for Indian tourism
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  icon: Brain,
                  title: 'AI Prediction Engine',
                  description: 'Machine learning algorithms predict and prevent incidents before they occur',
                  color: 'bg-gradient-emerald'
                },
                {
                  icon: Globe,
                  title: 'Real-time Tracking',
                  description: 'GPS monitoring with intelligent geo-fence alerts and route optimization',
                  color: 'bg-gradient-primary'
                },
                {
                  icon: Lock,
                  title: 'Blockchain Security',
                  description: 'Immutable digital identity and privacy-first data protection',
                  color: 'bg-gradient-emerald'
                },
                {
                  icon: TrendingUp,
                  title: 'Predictive Analytics',
                  description: 'Advanced data science for risk assessment and resource allocation',
                  color: 'bg-gradient-primary'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <div className={`${feature.color} p-3 md:p-4 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:shadow-glow transition-all duration-300`}>
                    <feature.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{feature.title}</h3>
                  <p className="text-primary-300 text-xs md:text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Mobile App Showcase - Based on AquaShield Reference */}
        <motion.div
          className="mb-20"
          style={{ y: y2 }}
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                Safety in Your <span className="text-emerald-400">Pocket</span>
              </h2>
              <p className="text-lg md:text-xl text-primary-300 max-w-3xl mx-auto leading-relaxed">
                YatraKavach puts powerful safety features right in your hand with our intuitive mobile app
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Mobile Device Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex justify-center relative"
            >
              <div className="relative">
                <MobileAppMockup 
                  darkMode={true}
                  safetyScore={99.8}
                  onReport={() => setMockupState(prev => ({ ...prev, activeFeature: 'sos', sosCountdown: 3 }))}
                  onViewMap={() => setMockupState(prev => ({ ...prev, activeFeature: 'map' }))}
                />
                
                {/* Shadow and glow effects */}
                <div className="absolute -bottom-10 -left-10 w-64 h-32 bg-blue-500/20 blur-3xl rounded-full -z-10"></div>
              </div>
            </motion.div>
            
            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-2xl font-bold text-white">
                Key Mobile Features
              </h3>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Real-time Safety Score",
                    icon: Shield,
                    description: "AI-powered safety analysis that updates in real-time based on your location and surroundings."
                  },
                  {
                    title: "One-Touch Emergency Response",
                    icon: AlertTriangle,
                    description: "One-tap emergency alert with automatic location sharing and emergency contact notification."
                  },
                  {
                    title: "Interactive Safety Maps",
                    icon: MapPin,
                    description: "View safety zones, find secure routes, and avoid high-risk areas with our interactive maps."
                  }
                ].map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="flex gap-4 items-start"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-emerald-500/20 p-3 rounded-xl">
                      <feature.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{feature.title}</h4>
                      <p className="text-primary-300">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setMockupState(prev => ({ ...prev, showQRModal: true }))}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-full shadow-lg shadow-emerald-500/30"
                >
                  Download App
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Statistics Section - Moved up to replace the gray box */}
        <StatsSection />
      </div>

      {/* Global Modals and Overlays */}
      <AnimatePresence>
        {renderQRModal()}
      </AnimatePresence>

      {/* Enhanced Floating Chat Widget */}
      <FloatingChatWidget
        languages={languages}
        currentLanguage={mockupState.currentLanguage}
        onLanguageChange={(lang) => {
          setMockupState(prev => ({ ...prev, currentLanguage: lang as 'en' | 'hi' | 'as' | 'bn' }));
          setHasNewMessage(false); // Clear new message indicator when language is changed
        }}
        onChatToggle={() => {
          setMockupState(prev => ({ ...prev, showChatbot: !prev.showChatbot }));
          setHasNewMessage(false); // Clear new message indicator when chat is toggled
        }}
        onFeatureClick={(feature) => {
          // Handle quick action clicks - this will open the chatbot with context
          handleFeatureClick(feature);
        }}
        onQRModalOpen={() => setMockupState(prev => ({ ...prev, showQRModal: true }))}
        isOpen={mockupState.showChatbot}
        hasNewMessage={hasNewMessage && !mockupState.showChatbot}
      />
    </div>
  );
};

export default LandingPage;