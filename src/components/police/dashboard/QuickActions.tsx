import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Users, 
  Phone, 
  Activity,
  ChevronRight,
  Bell,
  MessageCircle,
  Shield
} from 'lucide-react';

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  to?: string;
  bgColor: string;
  hoverColor: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon: Icon, 
  label, 
  to, 
  bgColor, 
  hoverColor,
  onClick 
}) => {
  // Enhanced button with more professional styling
  const commonProps = {
    className: `w-full bg-gradient-to-r ${bgColor} text-white p-3.5 rounded-lg flex items-center justify-center gap-3 
    transition-all duration-200 border border-white/10 shadow-md ${hoverColor} 
    hover:shadow-lg hover:border-white/20 relative overflow-hidden group`,
    "aria-label": label
  };

  // Content with subtle animation on hover
  const content = (
    <>
      <div className="relative z-10 p-1.5 rounded-lg bg-white/10 shadow-inner">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm font-medium relative z-10">{label}</span>
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
    </>
  );

  if (to) {
    return (
      <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} className="w-full">
        <Link to={to} {...commonProps}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} className="w-full">
      <button onClick={onClick} {...commonProps}>
        {content}
      </button>
    </motion.div>
  );
};

interface QuickActionsProps {
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ className = "" }) => {
  const [isEmergencyBroadcasting, setIsEmergencyBroadcasting] = useState(false);
  
  const handleEmergencyBroadcast = () => {
    setIsEmergencyBroadcasting(true);
    
    // Simulating broadcast completion after 2 seconds
    setTimeout(() => {
      setIsEmergencyBroadcasting(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-xl ${className}`}
    >
      <div className="px-4 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/90 to-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded shadow-inner">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold">Quick Actions</h3>
          </div>
          
          <Link 
            to="/settings"
            className="text-xs bg-slate-700/50 hover:bg-slate-700/70 px-2 py-1 rounded transition-colors flex items-center gap-1"
          >
            Customize
          </Link>
        </div>
      </div>
      
      <div className="p-4 grid grid-cols-1 gap-3.5">
        <ActionButton 
          icon={AlertTriangle} 
          label="Manage Alerts" 
          to="/alerts"
          bgColor="from-red-600 to-red-700" 
          hoverColor="hover:from-red-500 hover:to-red-700"
        />
        <ActionButton 
          icon={Users} 
          label="Tourist Database" 
          to="/tourists"
          bgColor="from-blue-600 to-blue-700" 
          hoverColor="hover:from-blue-500 hover:to-blue-700"
        />
        <ActionButton 
          icon={Activity} 
          label="Analytics" 
          to="/analytics"
          bgColor="from-indigo-600 to-purple-700" 
          hoverColor="hover:from-indigo-500 hover:to-purple-700"
        />
        <ActionButton 
          icon={Phone} 
          label={isEmergencyBroadcasting ? "Broadcasting..." : "Emergency Broadcast"}
          bgColor={isEmergencyBroadcasting ? "from-amber-600 to-amber-700" : "from-emerald-600 to-emerald-700"}
          hoverColor={isEmergencyBroadcasting ? "opacity-90" : "hover:from-emerald-500 hover:to-emerald-700"}
          onClick={handleEmergencyBroadcast}
        />
      </div>
      
      {/* Secondary actions */}
      <div className="bg-slate-800/50 border-t border-slate-700/30 p-3">
        <div className="grid grid-cols-3 gap-3">
          {[{icon: Bell, label: "Notifications"}, 
             {icon: MessageCircle, label: "Messages"}, 
             {icon: Shield, label: "Security"}].map((item, index) => (
            <motion.button 
              key={index}
              className="flex flex-col items-center justify-center py-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/60 transition-colors border border-slate-600/20"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-slate-600/30 p-1.5 rounded-full mb-2">
                <item.icon size={16} className="text-slate-300" />
              </div>
              <span className="text-xs font-medium text-slate-300">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-700/20 via-blue-600/10 to-purple-700/20 p-4 border-t border-blue-500/20">
        <Link 
          to="/profile"
          className="flex items-center justify-between text-sm font-medium px-3 py-2.5 rounded-lg
                     bg-slate-800/60 hover:bg-slate-800/80 text-slate-200 hover:text-white
                     transition-all duration-200 border border-slate-700/50 hover:border-blue-500/30 shadow-sm"
          aria-label="View your officer profile"
        >
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">P</div>
            <span>Officer Profile</span>
          </div>
          <ChevronRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
};

export default QuickActions;