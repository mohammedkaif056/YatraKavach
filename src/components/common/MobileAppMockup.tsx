import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, Shield, Wifi, Battery, SignalMedium,
  ChevronRight, Menu, BarChart3, UserCircle, MapPin
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface MobileAppMockupProps {
  darkMode?: boolean;
  safetyScore?: number;
  onReport?: () => void;
  onViewMap?: () => void;
  className?: string;
}

const MobileAppMockup: React.FC<MobileAppMockupProps> = ({
  darkMode = true,
  safetyScore = 99.8,
  onReport,
  onViewMap,
  className
}) => {
  // Get current time for the status bar
  const now = new Date();
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).toLowerCase();

  return (
    <div className={cn(
      "max-w-[320px] rounded-[40px] overflow-hidden shadow-2xl border-8 border-gray-800",
      darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900",
      className
    )}>
      {/* Notch */}
      <div className="mx-auto w-1/3 h-6 bg-gray-800 rounded-b-lg mb-1"></div>

      {/* Screen content */}
      <div className="relative h-[600px] overflow-hidden">
        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 py-1 text-xs">
          <div>{formattedTime}</div>
          <div className="flex space-x-2">
            <SignalMedium className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* App header */}
        <div className={cn(
          "px-4 py-3 flex justify-between items-center",
          darkMode ? "bg-gray-900" : "bg-white"
        )}>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold">YatriShield</h1>
              <p className="text-xs opacity-70">Protection active</p>
            </div>
          </div>
          <Menu className="w-6 h-6" />
        </div>

        {/* Safety Score Display */}
        <div className={cn(
          "text-center p-8",
          darkMode ? "bg-gray-900" : "bg-gray-50"
        )}>
          <div className="mx-auto w-24 h-24 rounded-full flex items-center justify-center relative">
            {/* Background circles */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none" 
                stroke={safetyScore > 90 ? "#10b981" : safetyScore > 70 ? "#f59e0b" : "#dc2626"}
                strokeWidth="4"
                strokeDasharray="100"
                strokeDashoffset={100 - safetyScore}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Score text */}
            <div>
              <p className="text-2xl font-bold">{safetyScore}</p>
              <p className="text-xs opacity-70">out of 100</p>
            </div>
          </div>
          
          <p className="mt-3 text-sm opacity-80">Your safety score is {safetyScore > 90 ? 'excellent' : safetyScore > 70 ? 'good' : 'concerning'}</p>
          <p className="text-xs opacity-50 mt-1">Last updated: {now.toLocaleTimeString()}</p>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 px-4 pt-4">
          <motion.button
            onClick={onReport}
            whileTap={{ scale: 0.95 }}
            className="flex-1 p-4 rounded-2xl bg-red-500 text-white flex flex-col items-center"
          >
            <AlertTriangle className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">Report Emergency</span>
          </motion.button>
          
          <motion.button
            onClick={onViewMap}
            whileTap={{ scale: 0.95 }}
            className="flex-1 p-4 rounded-2xl bg-blue-500 text-white flex flex-col items-center"
          >
            <MapPin className="w-8 h-8 mb-2" />
            <span className="text-sm font-medium">View Safe Map</span>
          </motion.button>
        </div>
        
        {/* Live Activity Feed */}
        <div className="p-4">
          <h2 className="text-sm font-bold mb-2 opacity-80">• Live Activity</h2>
          
          <div className="space-y-2">
            {[
              { time: '8:30 AM', message: 'Location check verified', icon: Shield },
              { time: '7:45 AM', message: 'High street reported unsafe', icon: AlertTriangle },
              { time: '7:15 AM', message: 'Image Upheld', icon: Shield }
            ].map((activity, i) => (
              <div 
                key={i} 
                className={cn(
                  "px-4 py-3 rounded-xl flex items-center justify-between",
                  darkMode ? "bg-gray-800" : "bg-gray-100"
                )}
              >
                <div className="flex items-center">
                  <activity.icon className={cn(
                    "w-5 h-5 mr-3",
                    activity.icon === AlertTriangle ? "text-red-500" : "text-green-500"
                  )} />
                  <div>
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs opacity-60">{activity.time}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 flex justify-around p-4 border-t",
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        )}>
          <button className="flex flex-col items-center">
            <Shield className="w-6 h-6 text-blue-500" />
            <span className="text-xs mt-1 opacity-80">Protect</span>
          </button>
          <button className="flex flex-col items-center opacity-60">
            <MapPin className="w-6 h-6" />
            <span className="text-xs mt-1">Map</span>
          </button>
          <button className="flex flex-col items-center opacity-60">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs mt-1">Stats</span>
          </button>
          <button className="flex flex-col items-center opacity-60">
            <UserCircle className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAppMockup;