import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, Clock, Phone, User, Radio, Shield, Navigation, Battery, Signal, Cloud } from 'lucide-react';
import EmergencyMap from './EmergencyMap';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

const EmergencyActive: React.FC = () => {
  const [emergencyDuration, setEmergencyDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setEmergencyDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-red-50">
      {/* Emergency Header */}
      <div className="bg-red-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-3 rounded-full animate-pulse">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ACTIVE EMERGENCY</h1>
              <p className="text-red-100">Tourist in Distress - Immediate Response Required</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold">{formatDuration(emergencyDuration)}</div>
            <div className="text-sm text-red-200">Emergency Duration</div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Emergency Details */}
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-red-500 mb-6">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-red-800 mb-2">Geo-fence Breach - High Risk Area</h2>
                <p className="text-red-700">Tourist has moved outside designated safe zone near Kaziranga National Park</p>
              </div>
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                CRITICAL
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">Tourist Details</span>
                </div>
                <p className="text-sm text-red-700">Sarah Johnson</p>
                <p className="text-xs text-red-600">ID: TSI-000003</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Last Location</span>
                </div>
                <p className="text-sm text-blue-700">26.7461°N, 93.9544°E</p>
                <p className="text-xs text-blue-600">Kaziranga National Park</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Time Elapsed</span>
                </div>
                <p className="text-sm text-yellow-700">{formatDuration(emergencyDuration)}</p>
                <p className="text-xs text-yellow-600">Since alert triggered</p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-800">Response Status</span>
                </div>
                <p className="text-sm text-emerald-700">Team Dispatched</p>
                <p className="text-xs text-emerald-600">ETA: 8 minutes</p>
              </div>
            </div>

            {/* Additional Rich Details */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Incident Meta */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Incident</div>
                <div className="text-sm text-gray-700">ID: INC-2025-0031</div>
                <div className="text-sm text-gray-700">Category: Geo-fence Breach</div>
                <div className="text-sm text-gray-700">Priority: Critical</div>
              </div>

              {/* Tourist Contact */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Tourist Contact</div>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-500" />
                  +91 •••• ••342
                </div>
                <div className="text-sm text-gray-700">Language: English</div>
                <div className="text-sm text-gray-700">Medical: None on record</div>
              </div>

              {/* Environment */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Environment</div>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-blue-500" />
                  Weather: Light rain
                </div>
                <div className="text-sm text-gray-700">Visibility: Moderate</div>
                <div className="text-sm text-gray-700">Terrain: Forest</div>
              </div>

              {/* Device Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Device Status</div>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <Battery className="w-4 h-4 text-emerald-600" />
                  Battery: 62%
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-2">
                  <Signal className="w-4 h-4 text-yellow-600" />
                  Signal: Weak
                </div>
                <div className="text-sm text-gray-700">Last Ping: {formatDuration(Math.max(0, emergencyDuration - 12))} ago</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Call Tourist</span>
              </button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Radio className="w-4 h-4" />
                <span>Contact Response Team</span>
              </button>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                <Navigation className="w-4 h-4" />
                <span>Track Location</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Map and Response Coordination */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Live Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span>Live Emergency Tracking</span>
                </h3>
              </div>
              <div className="p-4">
                {/* Real-time Leaflet Map */}
                <EmergencyMap
                  userRole="operator"
                  userId="emergency_operator"
                  initialCenter={[26.7461, 93.9544]} // Kaziranga National Park coordinates
                  initialZoom={14}
                  height="400px"
                  showControls={true}
                  onIncidentSelect={(incident) => {
                    console.log('Selected incident:', incident);
                    // Handle incident selection for active emergency
                  }}
                  onResponderSelect={(responder) => {
                    console.log('Selected responder:', responder);
                    // Handle responder selection for coordination
                  }}
                  className="rounded-lg overflow-hidden border-2 border-red-300"
                />
                
                {/* Quick Stats Below Map */}
                <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                  <div className="bg-red-100 rounded-lg p-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                    <div className="text-xs text-red-600">Tourist</div>
                    <div className="text-red-500 font-bold text-sm">ALERT</div>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-xs text-blue-600">Response Team</div>
                    <div className="text-blue-500 font-bold text-sm">8 min</div>
                  </div>
                  <div className="bg-emerald-100 rounded-lg p-3">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-xs text-emerald-600">Safe Zone</div>
                    <div className="text-emerald-500 font-bold text-sm">2.3 km</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Response Coordination */}
          <div className="space-y-6">
            {/* Response Team Status */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span>Response Team</span>
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-800">Bravo Team</span>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">DISPATCHED</span>
                  </div>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• 4 officers deployed</p>
                    <p>• ETA: 8 minutes</p>
                    <p>• Distance: 3.2 km</p>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-emerald-800">Medical Support</span>
                    <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs">STANDBY</span>
                  </div>
                  <div className="text-sm text-emerald-700 space-y-1">
                    <p>• Ambulance ready</p>
                    <p>• ETA: 12 minutes</p>
                    <p>• Nearest hospital: 15 km</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Communication Log */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Radio className="w-5 h-5 text-purple-500" />
                  <span>Communication Log</span>
                </h3>
              </div>
              <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                <div className="text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-red-600">Emergency Alert</span>
                    <span className="text-xs text-gray-500">{formatDuration(emergencyDuration)} ago</span>
                  </div>
                  <p className="text-gray-700">Geo-fence breach detected</p>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-blue-600">Team Dispatch</span>
                    <span className="text-xs text-gray-500">{formatDuration(Math.max(0, emergencyDuration - 30))} ago</span>
                  </div>
                  <p className="text-gray-700">Bravo Team dispatched to location</p>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-purple-600">Contact Attempt</span>
                    <span className="text-xs text-gray-500">{formatDuration(Math.max(0, emergencyDuration - 60))} ago</span>
                  </div>
                  <p className="text-gray-700">Calling tourist mobile - No response</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyActive;