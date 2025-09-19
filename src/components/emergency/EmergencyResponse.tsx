import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, Clock, Users, Shield, Activity, 
         Map, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMockData } from '../../contexts/MockDataContext';
import EmergencyMap from './EmergencyMap';

// Import Leaflet CSS for proper map styling
import 'leaflet/dist/leaflet.css';

const EmergencyResponse: React.FC = () => {
  const { alerts } = useMockData();
  const [activeEmergencies] = useState(3);
  const [responseTeams] = useState(5);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedView, setSelectedView] = useState<'dashboard' | 'map'>('dashboard');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const emergencyAlerts = alerts.filter(alert => alert.severity === 'high' && alert.status === 'active');

  const statsData = [
    {
      title: 'Active Incidents',
      value: activeEmergencies,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      status: 'Critical',
      trend: '+2 today'
    },
    {
      title: 'Response Teams',
      value: responseTeams,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      status: 'Deployed',
      trend: '5 of 8 active'
    },
    {
      title: 'Response Time',
      value: '1.2min',
      icon: Clock,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      status: 'Optimal',
      trend: '15% faster'
    },
    {
      title: 'Coverage',
      value: '98.2%',
      icon: Shield,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      status: 'Excellent',
      trend: '24/7 active'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Refined Header - Apple-style minimal */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-xl bg-white/80">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                  Emergency Command
                </h1>
                <p className="text-gray-500 text-sm font-medium">Tourist Safety Coordination</p>
              </div>
            </div>
            
            {/* Clean View Toggle */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setSelectedView('dashboard')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedView === 'dashboard'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setSelectedView('map')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedView === 'map'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Live Map
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-600">All Systems Operational</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-semibold text-gray-900">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {selectedView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Apple-style Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 leading-none">{stat.value}</div>
                        <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{stat.status}</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{stat.title}</h3>
                      <p className="text-sm text-gray-500">{stat.trend}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main Content Grid - Apple-style layout */}
              <div className="grid lg:grid-cols-5 gap-8">
                {/* Emergency Incidents - Takes more space */}
                <div className="lg:col-span-3">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                    className="bg-white rounded-2xl border border-gray-200"
                  >
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Active Emergencies</h2>
                          <p className="text-gray-500 text-sm mt-1">Real-time incident monitoring</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                            <Activity className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="text-sm font-semibold text-red-600">{emergencyAlerts.length} Active</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {emergencyAlerts.length > 0 ? (
                        <div className="space-y-4">
                          {emergencyAlerts.map((alert, index) => (
                            <motion.div
                              key={alert.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                              className="group p-4 border border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50/50 transition-all duration-300 cursor-pointer"
                            >
                              <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h3 className="font-semibold text-gray-900 group-hover:text-red-900 transition-colors">
                                        {alert.type}
                                      </h3>
                                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{alert.message}</p>
                                    </div>
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold ml-4 flex-shrink-0">
                                      CRITICAL
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-4 h-4" />
                                      <span>{alert.time}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="w-4 h-4" />
                                      <span className="truncate">{alert.location}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                                      Tourist ID: {alert.touristId}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12"
                        >
                          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-emerald-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-emerald-700 mb-2">All Clear</h3>
                          <p className="text-emerald-600">No active emergency situations detected.</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Sidebar - Apple-style compact info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Response Teams */}
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                    className="bg-white rounded-2xl border border-gray-200"
                  >
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900 flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span>Response Teams</span>
                      </h3>
                    </div>
                    <div className="p-6 space-y-3">
                      {[
                        { name: 'Alpha', status: 'Available', location: 'Shillong', active: true },
                        { name: 'Bravo', status: 'En Route', location: 'Kaziranga', active: false },
                        { name: 'Charlie', status: 'Available', location: 'Gangtok', active: true },
                        { name: 'Delta', status: 'Deployed', location: 'Guwahati', active: false },
                        { name: 'Echo', status: 'Available', location: 'Imphal', active: true }
                      ].map((team, index) => (
                        <motion.div
                          key={team.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${team.active ? 'bg-emerald-500' : 'bg-yellow-500'}`}></div>
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{team.name} Team</div>
                              <div className="text-xs text-gray-500">{team.location}</div>
                            </div>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                            team.active 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {team.status}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Quick Navigation */}
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                    className="bg-white rounded-2xl border border-gray-200"
                  >
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900">Quick Access</h3>
                    </div>
                    <div className="p-6 space-y-3">
                      <Link 
                        to="/emergency/active"
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-red-50 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="font-medium text-gray-900">Active Incidents</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                      </Link>
                      
                      <button 
                        onClick={() => setSelectedView('map')}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors group w-full"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Map className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">Live Map View</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </button>

                      <Link 
                        to="/police/dashboard"
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-900">Police Coordination</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {selectedView === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Live Emergency Map</h2>
                    <p className="text-gray-500 text-sm mt-1">Real-time incident tracking and response coordination</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-emerald-600">Live</span>
                  </div>
                </div>
              </div>
              
              <div className="h-[70vh] relative">
                <EmergencyMap
                  userRole="operator"
                  userId="current_user"
                  height="100%"
                  initialCenter={[25.5788, 91.8933]}
                  initialZoom={13}
                  showControls={true}
                  onIncidentSelect={(incident) => console.log('Selected incident:', incident)}
                  onResponderSelect={(responder) => console.log('Selected responder:', responder)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmergencyResponse;