import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Layers, Maximize } from 'lucide-react';
import PoliceMap from '../PoliceMap';
import { Tourist, Alert } from '../../../services/mockData';

interface LiveMapProps {
  tourists: Tourist[];
  alerts: Alert[];
  className?: string;
}

const LiveMap: React.FC<LiveMapProps> = ({ tourists, alerts, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`bg-gray-800 rounded-xl border border-gray-700 overflow-hidden ${className}`}
    >
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          <span>Live Tourist Tracking</span>
        </h3>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search locations..."
              className="bg-gray-700 border border-gray-600 rounded-lg pl-8 pr-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-36"
              aria-label="Search locations"
            />
            <Search className="absolute left-2 top-1.5 text-gray-400 w-4 h-4" />
          </div>
          <button className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors" aria-label="Toggle map layers">
            <Layers size={18} />
          </button>
          <button className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors" aria-label="View full screen map">
            <Maximize size={18} />
          </button>
        </div>
      </div>
      
      <div className="relative h-96">
        {/* Use the existing PoliceMap component */}
        <PoliceMap 
          tourists={tourists}
          alerts={alerts}
          className="h-full w-full"
        />
        
        {/* Status indicator */}
        <div className="absolute top-3 left-3 bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-white font-medium">Live View</span>
          </div>
        </div>
        
        {/* Alert count overlay */}
        <div className="absolute bottom-3 left-3 bg-red-900/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-red-700 flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-white font-medium">
            {alerts.filter(alert => alert.severity === 'high' && alert.status === 'active').length} High Priority Alerts
          </span>
        </div>
      </div>
      
      {/* Map stats */}
      <div className="grid grid-cols-3 border-t border-gray-700 divide-x divide-gray-700">
        <div className="p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Safe Zones</div>
          <div className="flex items-center justify-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-1.5"></div>
            <span className="font-medium">4</span>
          </div>
        </div>
        <div className="p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Caution Zones</div>
          <div className="flex items-center justify-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full mr-1.5"></div>
            <span className="font-medium">3</span>
          </div>
        </div>
        <div className="p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Alert Zones</div>
          <div className="flex items-center justify-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1.5"></div>
            <span className="font-medium">{alerts.filter(alert => alert.severity === 'high' && alert.status === 'active').length}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LiveMap;