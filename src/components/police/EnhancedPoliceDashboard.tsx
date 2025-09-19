import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './map.css';
import MapControls from './MapControls';
import { 
  Shield, 
  MapPin, 
  Users, 
  Bell, 
  AlertTriangle, 
  ChevronRight,
  Calendar,
  TrendingUp,
  Clock,
  Search,
  Compass,
  BarChart3
} from 'lucide-react';

// Mock tourist data with Guwahati, India coordinates
const touristData = [
  { id: 'T001', name: 'Emma Wilson', location: [26.156, 91.731], status: 'normal', nationality: '🇺🇸 USA', checkInDate: '15 Sep', hotel: 'Grand Residency', lastActive: '5m ago' },
  { id: 'T002', name: 'Liu Wei', location: [26.158, 91.769], status: 'alert', nationality: '🇨🇳 China', checkInDate: '12 Sep', hotel: 'Hotel Himalaya', lastActive: '2m ago' },
  { id: 'T003', name: 'Sophie Martin', location: [26.142, 91.744], status: 'normal', nationality: '🇫🇷 France', checkInDate: '14 Sep', hotel: 'Taj Vivanta', lastActive: '18m ago' },
  { id: 'T004', name: 'Raj Mehta', location: [26.160, 91.758], status: 'warning', nationality: '🇬🇧 UK', checkInDate: '10 Sep', hotel: 'The Lily Hotel', lastActive: '1h ago' },
  { id: 'T005', name: 'Yuki Tanaka', location: [26.153, 91.762], status: 'normal', nationality: '🇯🇵 Japan', checkInDate: '16 Sep', hotel: 'Radisson Blu', lastActive: '30m ago' }
];

// Mock alert data
const alertsData = [
  { id: 'A001', type: 'Harassment', tourist: 'Liu Wei', location: 'Central Market', time: '10:15 AM', priority: 'high', status: 'active' },
  { id: 'A002', type: 'Lost Tourist', tourist: 'Raj Mehta', location: 'Old Town', time: '09:22 AM', priority: 'medium', status: 'active' },
  { id: 'A003', type: 'Theft', tourist: 'Anonymous', location: 'City Square', time: '08:45 AM', priority: 'high', status: 'investigating' },
  { id: 'A004', type: 'Medical', tourist: 'Carlos Silva', location: 'Temple Road', time: 'Yesterday', priority: 'medium', status: 'resolved' },
];

// Stats data
const statsData = [
  { title: 'Active Tourists', value: 267, change: '+15%', icon: <Users className="w-6 h-6" />, color: 'blue' },
  { title: 'Safety Score', value: '96.4%', change: '+2.3%', icon: <Shield className="w-6 h-6" />, color: 'emerald' },
  { title: 'Active Alerts', value: 13, change: '-4', icon: <AlertTriangle className="w-6 h-6" />, color: 'amber' },
  { title: 'Avg Response', value: '1.8m', change: '-14%', icon: <Clock className="w-6 h-6" />, color: 'purple' },
];

// Helper component to update map when selected tourist changes
const MapUpdater = ({ selectedTourist, touristData }: { selectedTourist: string | null, touristData: any[] }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedTourist) {
      const tourist = touristData.find(t => t.id === selectedTourist);
      if (tourist) {
        map.flyTo([tourist.location[0], tourist.location[1]], 15, {
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

const PoliceDashboard: React.FC = () => {
  const [selectedTourist, setSelectedTourist] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const [mapLayer, setMapLayer] = useState<'osm' | 'satellite'>('osm');
  
  // Map control functions
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };
  
  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };
  
  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo([26.15, 91.74], 13, {
        animate: true,
        duration: 1
      });
    }
  };
  
  const handleLayerToggle = () => {
    setMapLayer(prev => prev === 'osm' ? 'satellite' : 'osm');
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        when: "beforeChildren"
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  // Mock map initialization
  useEffect(() => {
    // This is a simulation of Google Maps initialization
    // In a real app, you would use the actual Google Maps API
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Function to get status color class
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'alert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Function to get priority color class
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-700/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-700/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-700/5 rounded-full filter blur-3xl"></div>
        
        <motion.div 
          className="absolute top-20 left-20 w-2 h-2 bg-blue-400/80 rounded-full"
          animate={{ 
            y: [0, 40, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 right-80 w-3 h-3 bg-purple-400/80 rounded-full"
          animate={{ 
            y: [0, -50, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-40 right-40 w-2 h-2 bg-emerald-400/80 rounded-full"
          animate={{ 
            y: [0, 30, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          className="bg-gray-800/50 backdrop-blur-md border-b border-blue-500/20 py-4 px-6 sticky top-0 z-20"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Police Dashboard
                </h1>
                <p className="text-xs text-gray-400">Live monitoring system • Tourist protection</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                <Bell className="w-5 h-5 text-gray-300 hover:text-white transition-colors cursor-pointer" />
              </div>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-sm font-bold">PD</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="container mx-auto px-4 py-6">
          {/* Stats row */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {statsData.map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className={`bg-gray-800/50 backdrop-blur-sm border border-${stat.color}-500/20 rounded-xl p-5 shadow-lg hover:shadow-${stat.color}-900/20 transition-all duration-300 hover:translate-y-[-5px]`}
                style={{ boxShadow: '0 8px 20px rgba(15, 23, 42, 0.3)' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className={`text-${stat.color}-400 text-2xl font-bold mt-1`}>{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-700 p-3 rounded-lg shadow-md shadow-${stat.color}-900/20`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-center mt-4 text-xs font-medium">
                  <TrendingUp className={`w-3 h-3 mr-1 text-${stat.color}-400`} />
                  <span className={`text-${stat.color}-400`}>{stat.change} from yesterday</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map section */}
            <motion.div 
              className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center">
                  <MapPin className="w-5 h-5 text-blue-400 mr-2" />
                  Tourist Locations
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="bg-gray-900/50 px-3 py-1 text-xs rounded-full flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Live</span>
                  </div>
                  <button className="bg-blue-600/30 hover:bg-blue-600/50 p-1 rounded transition-colors">
                    <Compass className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Map container */}
              <div className="relative h-[400px] bg-slate-900/70 overflow-hidden">
                <MapContainer 
                  center={[26.15, 91.74]} 
                  zoom={13} 
                  style={{ height: '400px', width: '100%', background: '#1e293b' }}
                  whenReady={() => {
                    setIsMapLoaded(true);
                  }}
                  ref={(map) => { if (map) mapRef.current = map; }}
                >
                  {mapLayer === 'osm' ? (
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      className="map-tiles"
                    />
                  ) : (
                    <TileLayer
                      attribution='&copy; <a href="https://www.esri.com">Esri</a>'
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      className="map-tiles-satellite"
                    />
                  )}
                  
                  {/* Custom markers for tourists */}
                  {touristData.map((tourist) => {
                    // Create a custom icon based on tourist status
                    const customIcon = L.divIcon({
                      className: 'custom-marker',
                      html: `
                        <div class="${getStatusColor(tourist.status)} relative rounded-full w-3 h-3 border border-white">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${getStatusColor(tourist.status)} opacity-50"></span>
                        </div>
                      `,
                      iconSize: [12, 12],
                      iconAnchor: [6, 6]
                    });
                    
                    return (
                      <Marker 
                        key={tourist.id} 
                        position={[tourist.location[0], tourist.location[1]]} 
                        icon={customIcon}
                        eventHandlers={{
                          click: () => {
                            setSelectedTourist(tourist.id === selectedTourist ? null : tourist.id);
                          }
                        }}
                      >
                        <Popup className="custom-popup">
                          <div className="bg-gray-900/90 p-2 rounded-lg border border-gray-700 text-white">
                            <div className="font-medium text-sm">{tourist.name}</div>
                            <div className="text-xs text-gray-400 mt-1">{tourist.nationality}</div>
                            <div className="text-xs text-gray-400">Last active: {tourist.lastActive}</div>
                            <div className="mt-1 pt-1 border-t border-gray-700 text-xs">
                              <span className={`inline-block px-1.5 py-0.5 rounded-full text-xs ${
                                tourist.status === 'normal' ? 'bg-emerald-900/50 text-emerald-400' : 
                                tourist.status === 'warning' ? 'bg-amber-900/50 text-amber-400' : 
                                'bg-red-900/50 text-red-400'
                              }`}>
                                {tourist.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}

                  {/* MapUpdater component to handle map updates */}
                  <MapUpdater selectedTourist={selectedTourist} touristData={touristData} />
                </MapContainer>
                
                <div className="absolute bottom-3 left-3 z-[1000] bg-gray-900/80 backdrop-blur-sm p-2 rounded-lg border border-gray-700 text-xs">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
                      <span>Normal (3)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
                      <span>Warning (1)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                      <span>Alert (1)</span>
                    </div>
                  </div>
                </div>
                
                {!isMapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-[1000]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                )}
                
                <MapControls
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onRecenter={handleRecenter}
                  onLayerToggle={handleLayerToggle}
                />
              </div>
            </motion.div>
            
            {/* Right sidebar - Alerts & Tourist List */}
            <div className="space-y-6">
              {/* Alerts */}
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm border border-red-500/20 rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-semibold flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                    Active Alerts
                  </h2>
                  <Link 
                    to="/police/alerts"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center transition-colors"
                  >
                    View all <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                <div className="divide-y divide-gray-700/50">
                  {alertsData.filter(alert => alert.status !== 'resolved').map((alert, index) => (
                    <motion.div 
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="p-3 hover:bg-gray-700/20 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`${getPriorityColor(alert.priority)} p-2 rounded-lg mt-1`}>
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium text-sm">{alert.type}</h3>
                            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${alert.status === 'active' ? 'bg-red-900/50 text-red-400' : 'bg-amber-900/50 text-amber-400'}`}>
                              {alert.status}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs mt-1">Tourist: {alert.tourist}</p>
                          <div className="flex justify-between mt-1 text-xs text-gray-400">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" /> {alert.location}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" /> {alert.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Tourist List */}
              <motion.div 
                className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Users className="w-5 h-5 text-blue-400 mr-2" />
                    Active Tourists
                  </h2>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    <input 
                      type="text" 
                      className="bg-gray-900/50 border border-gray-700 rounded-full pl-8 pr-3 py-1 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="Search tourists..."
                    />
                  </div>
                </div>
                
                <div className="divide-y divide-gray-700/50 max-h-[240px] overflow-y-auto">
                  {touristData.map((tourist, index) => (
                    <motion.div 
                      key={tourist.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className={`p-3 hover:bg-gray-700/20 transition-colors cursor-pointer ${selectedTourist === tourist.id ? 'bg-blue-900/20 border-l-2 border-blue-500' : ''}`}
                      onClick={() => setSelectedTourist(tourist.id === selectedTourist ? null : tourist.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-lg font-bold">
                            {tourist.name.charAt(0)}
                          </div>
                          <span className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(tourist.status)} border-2 border-gray-800 rounded-full`}></span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-sm">{tourist.name}</h3>
                            <span className="text-xs text-gray-400">{tourist.lastActive}</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-gray-400 text-xs">{tourist.nationality}</span>
                            <span className="text-gray-400 text-xs flex items-center">
                              <Calendar className="w-3 h-3 mr-1" /> {tourist.checkInDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Action buttons */}
          <motion.div 
            className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Link 
              to="/police/analytics"
              className="bg-gradient-to-r from-indigo-600/70 to-purple-600/70 hover:from-indigo-600 hover:to-purple-600 p-4 rounded-xl flex items-center justify-center space-x-3 shadow-lg transition-all duration-300 hover:shadow-purple-900/20 hover:-translate-y-1"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Analytics</span>
            </Link>
            
            <Link 
              to="/police/alerts"
              className="bg-gradient-to-r from-red-600/70 to-orange-600/70 hover:from-red-600 hover:to-orange-600 p-4 rounded-xl flex items-center justify-center space-x-3 shadow-lg transition-all duration-300 hover:shadow-red-900/20 hover:-translate-y-1"
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">All Alerts</span>
            </Link>
            
            <Link 
              to="/police/tourists"
              className="bg-gradient-to-r from-blue-600/70 to-cyan-600/70 hover:from-blue-600 hover:to-cyan-600 p-4 rounded-xl flex items-center justify-center space-x-3 shadow-lg transition-all duration-300 hover:shadow-blue-900/20 hover:-translate-y-1"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Tourists</span>
            </Link>
            
            <Link 
              to="/police/map"
              className="bg-gradient-to-r from-emerald-600/70 to-teal-600/70 hover:from-emerald-600 hover:to-teal-600 p-4 rounded-xl flex items-center justify-center space-x-3 shadow-lg transition-all duration-300 hover:shadow-emerald-900/20 hover:-translate-y-1"
            >
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Full Map</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;