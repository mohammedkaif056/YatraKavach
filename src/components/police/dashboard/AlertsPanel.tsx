import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import { Alert } from '../../../services/mockData';
import { Link } from 'react-router-dom';

interface AlertCardProps {
  alert: Alert;
  onRespond: (alertId: string) => void;
  onViewDetails: (alertId: string) => void;
}

const severityToClasses = {
  high: {
    border: 'border-red-500/30',
    bg: 'bg-gradient-to-r from-red-950/40 to-red-900/20',
    dot: 'bg-red-500',
    badge: 'bg-red-900/70 text-red-300 border-red-500/30',
    button: 'bg-red-600/80 hover:bg-red-600'
  },
  medium: {
    border: 'border-amber-500/30',
    bg: 'bg-gradient-to-r from-amber-950/40 to-amber-900/20',
    dot: 'bg-amber-500',
    badge: 'bg-amber-900/70 text-amber-300 border-amber-500/30',
    button: 'bg-amber-600/80 hover:bg-amber-600'
  },
  low: {
    border: 'border-blue-500/30',
    bg: 'bg-gradient-to-r from-blue-950/40 to-blue-900/20',
    dot: 'bg-blue-500',
    badge: 'bg-blue-900/70 text-blue-300 border-blue-500/30',
    button: 'bg-blue-600/80 hover:bg-blue-600'
  }
};

const AlertCard: React.FC<AlertCardProps> = ({ alert, onRespond, onViewDetails }) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const severity = alert.severity;
  const classes = severityToClasses[severity];
  
  // Entry animation
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);
  
  // Special animation for high priority alerts
  useEffect(() => {
    if (severity === 'high') {
      const pulseAnimation = async () => {
        await controls.start({
          boxShadow: ['0 0 0 rgba(220, 38, 38, 0)', '0 0 8px rgba(220, 38, 38, 0.5)', '0 0 0 rgba(220, 38, 38, 0)'],
          transition: { duration: 2, repeat: Infinity, repeatType: 'loop' }
        });
      };
      pulseAnimation();
    }
  }, [severity, controls]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`p-4 rounded-xl border backdrop-blur-sm ${classes.border} ${classes.bg} relative`}
      role="article"
      aria-label={`${severity} priority alert: ${alert.type}`}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${classes.dot}`}></div>
            <div className={`w-3 h-3 rounded-full ${classes.dot} absolute inset-0 animate-ping opacity-70`}></div>
          </div>
          <div>
            <span className="font-semibold text-sm">{alert.type}</span>
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${classes.badge}`}>
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </span>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-medium flex items-center">
          <Clock size={12} className="mr-1 opacity-70" />
          {alert.time}
        </span>
      </div>
      
      <p className="text-sm text-slate-300 mb-4 leading-relaxed">{alert.message}</p>
      
      <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
        <span className="bg-slate-800/70 px-2 py-0.5 rounded text-slate-300">ID: {alert.touristId}</span>
        <span className="bg-slate-800/70 px-2 py-0.5 rounded text-slate-300">{alert.location}</span>
      </div>
      
      <div className="flex items-center justify-end gap-2">
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-white shadow-sm ${classes.button} transition-colors flex items-center gap-1.5`}
          onClick={() => onViewDetails(alert.id)}
          aria-label={`View details for ${alert.type} alert`}
        >
          <ExternalLink size={12} />
          Details
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium text-white shadow-sm ${classes.button} transition-colors`}
          onClick={() => onRespond(alert.id)}
          aria-label={`Respond to ${alert.type} alert`}
        >
          Respond
        </motion.button>
      </div>
      
      {/* Time indicator for high priority alerts */}
      {severity === 'high' && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full px-2.5 py-1 flex items-center shadow-lg border border-red-500/30">
          <Clock size={10} className="mr-1" />
          <span className="font-medium tracking-wider">URGENT</span>
        </div>
      )}
    </motion.div>
  );
};

interface AlertsPanelProps {
  alerts: Alert[];
  onRespondToAlert: (alertId: string) => void;
  className?: string;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onRespondToAlert, className = "" }) => {
  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  
  const handleViewDetails = (_alertId: string) => {
    // For now, just navigate to the alerts page
    // In a real app, you might want to open a modal or navigate to a specific route
    // Using _alertId to indicate it's intentionally unused for now
  };
  
  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden shadow-xl ${className}`}
    >
      <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/80 to-slate-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg shadow-inner shadow-red-900/50 border border-red-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Active Alerts</h3>
              <p className="text-xs text-slate-400">Requires immediate attention</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              to="/alerts"
              className="bg-red-600/20 border border-red-500/30 text-red-300 px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600/30 transition-all duration-200 shadow-sm"
              aria-label="View all active alerts"
            >
              {activeAlerts.length}
            </Link>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4 max-h-[460px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600/50 scrollbar-track-slate-800/30">
        {activeAlerts.length > 0 ? (
          activeAlerts.slice(0, 5).map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <AlertCard 
                alert={alert} 
                onRespond={onRespondToAlert}
                onViewDetails={handleViewDetails}
              />
            </motion.div>
          ))
        ) : (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-slate-700/30 border border-slate-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <AlertTriangle className="w-7 h-7 text-slate-500" />
            </div>
            <p className="text-slate-300 font-medium text-lg mb-1">All Clear</p>
            <p className="text-slate-400 text-sm">No active alerts at the moment</p>
          </motion.div>
        )}
      </div>
      
      <div className="bg-slate-800/70 border-t border-slate-700/50 py-3 px-4">
        <Link 
          to="/alerts"
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm rounded-lg
            bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 hover:text-white 
            transition-all duration-200 font-medium"
          aria-label="View all alerts"
        >
          View all alerts
          <ExternalLink size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

export default AlertsPanel;