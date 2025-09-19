import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  MicOff, 
  Settings, 
  VolumeX, 
  Volume2, 
  Moon,
  Sun,
  RefreshCcw,
  Filter
} from 'lucide-react';

interface DashboardControlsProps {
  speechEnabled: boolean;
  notificationsEnabled: boolean;
  darkMode?: boolean;
  isRefreshing?: boolean;
  onToggleSpeech: () => void;
  onToggleNotifications: () => void;
  onToggleDarkMode?: () => void;
  onRefresh?: () => void;
  onFilterChange?: () => void;
  className?: string;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
  speechEnabled,
  notificationsEnabled,
  darkMode = true,
  isRefreshing = false,
  onToggleSpeech,
  onToggleNotifications,
  onToggleDarkMode = () => {},
  onRefresh = () => {},
  onFilterChange = () => {},
  className = ""
}) => {
  // Button hover animation
  const buttonHoverAnimation = {
    scale: 1.05,
    transition: { duration: 0.2 }
  };
  
  // Button tap animation
  const buttonTapAnimation = {
    scale: 0.95,
    transition: { duration: 0.1 }
  };
  
  // Active state animation
  const activeStateAnimation = {
    y: [-1, 1, -1],
    transition: { repeat: 1, duration: 0.3 }
  };
  
  // Tooltip component for buttons
  const Tooltip = ({ children, text }: { children: React.ReactNode, text: string }) => (
    <div className="group relative">
      {children}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 bg-slate-800 
        text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {text}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800"></div>
      </div>
    </div>
  );
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 p-1.5 bg-slate-800/60 backdrop-blur-sm rounded-full border border-slate-700/50 shadow-md">
        <Tooltip text={speechEnabled ? "Disable Voice Commands" : "Enable Voice Commands"}>
          <motion.button
            whileHover={buttonHoverAnimation}
            whileTap={buttonTapAnimation}
            onClick={onToggleSpeech}
            className={`relative rounded-full p-2 focus:outline-none focus:ring-1 focus:ring-blue-500/50 ${
              speechEnabled 
                ? 'bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white shadow-inner' 
                : 'bg-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            aria-label={speechEnabled ? 'Disable voice announcements' : 'Enable voice announcements'}
            aria-pressed={speechEnabled}
          >
            {speechEnabled ? <Volume2 size={16} /> : <MicOff size={16} />}
            {speechEnabled && (
              <motion.span 
                className="absolute inset-0 rounded-full bg-blue-400/20"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            )}
          </motion.button>
        </Tooltip>
        
        <Tooltip text={notificationsEnabled ? "Disable Notifications" : "Enable Notifications"}>
          <motion.button
            whileHover={buttonHoverAnimation}
            whileTap={buttonTapAnimation}
            onClick={onToggleNotifications}
            className={`relative rounded-full p-2 focus:outline-none focus:ring-1 focus:ring-blue-500/50 ${
              notificationsEnabled 
                ? 'bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white shadow-inner' 
                : 'bg-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            aria-label={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
            aria-pressed={notificationsEnabled}
          >
            {notificationsEnabled ? <Bell size={16} /> : <VolumeX size={16} />}
            {notificationsEnabled && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </motion.button>
        </Tooltip>
        
        <div className="h-4 w-px bg-slate-700/50"></div>
        
        <Tooltip text="Refresh Data">
          <motion.button
            whileHover={buttonHoverAnimation}
            whileTap={buttonTapAnimation}
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`rounded-full p-2 ${isRefreshing ? 'bg-blue-600/90 text-white shadow-inner' : 'bg-slate-700/60 text-slate-400 hover:text-slate-200'} focus:outline-none focus:ring-1 focus:ring-blue-500/50 relative`}
            aria-label="Refresh data"
          >
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
              transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
            >
              <RefreshCcw size={16} />
            </motion.div>
            {isRefreshing && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-blue-300 rounded-full animate-pulse" />
            )}
          </motion.button>
        </Tooltip>
        
        <Tooltip text="Filter Options">
          <motion.button
            whileHover={buttonHoverAnimation}
            whileTap={buttonTapAnimation}
            onClick={onFilterChange}
            className="rounded-full p-2 bg-slate-700/60 text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            aria-label="Filter options"
          >
            <Filter size={16} />
          </motion.button>
        </Tooltip>
        
        <Tooltip text={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <motion.button
            whileHover={buttonHoverAnimation}
            whileTap={buttonTapAnimation}
            animate={darkMode ? {} : activeStateAnimation}
            onClick={onToggleDarkMode}
            className={`rounded-full p-2 relative overflow-hidden focus:outline-none focus:ring-1 focus:ring-blue-500/50 ${darkMode ? 'bg-slate-700/60 text-slate-400 hover:text-slate-200' : 'bg-amber-500/80 text-white shadow-inner'}`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait">
              {darkMode ? (
                <motion.div
                  key="moon"
                  initial={{ rotate: -30, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 30, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={16} />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ rotate: -30, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 30, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={16} />
                </motion.div>
              )}
            </AnimatePresence>
            {!darkMode && (
              <motion.span 
                className="absolute inset-0 bg-amber-400/20"
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.8, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </motion.button>
        </Tooltip>
        
        <Tooltip text="Settings">
          <motion.button
            whileHover={buttonHoverAnimation}
            whileTap={buttonTapAnimation}
            className="rounded-full p-2 bg-slate-700/60 text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            aria-label="Dashboard settings"
          >
            <Settings size={16} />
          </motion.button>
        </Tooltip>
      </div>
    </div>
  );
};

export default DashboardControls;