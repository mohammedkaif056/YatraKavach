import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Phone, MessageSquare, MapPin, Zap, 
  Shield, Clock, CheckCircle, Siren 
} from 'lucide-react';

const PanicButton: React.FC = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [emergencyStage, setEmergencyStage] = useState<'idle' | 'connecting' | 'active' | 'confirmed'>('idle');
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handlePanicPress = () => {
    if (isPressed || isConfirming) return;
    
    setIsConfirming(true);
    let count = 3;
    setCountdown(count);
    
    const countdownTimer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(countdownTimer);
        activateEmergency();
      }
    }, 1000);
    
    setTimer(countdownTimer);
  };

  const activateEmergency = () => {
    setIsConfirming(false);
    setEmergencyStage('connecting');
    
    // Simulate connection process
    setTimeout(() => {
      setEmergencyStage('active');
      setIsPressed(true);
      
      // Auto-reset after demo
      setTimeout(() => {
        setEmergencyStage('confirmed');
        setTimeout(() => {
          resetButton();
        }, 3000);
      }, 5000);
    }, 2000);
  };

  const cancelPanic = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setIsConfirming(false);
    setCountdown(3);
  };

  const resetButton = () => {
    setIsPressed(false);
    setIsConfirming(false);
    setEmergencyStage('idle');
    setCountdown(3);
  };

  // Emergency confirmed state
  if (emergencyStage === 'confirmed') {
    return (
      <motion.div
        className="text-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <motion.div
          className="w-28 h-28 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-glow border-4 border-emerald-300"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        <div className="mt-4 space-y-2">
          <div className="text-emerald-600 font-bold text-lg">Help Dispatched</div>
          <div className="text-sm text-gray-600">Emergency services notified</div>
          <div className="text-xs text-emerald-600 font-medium">ETA: 4-6 minutes</div>
        </div>
      </motion.div>
    );
  }

  // Emergency active state
  if (isPressed && emergencyStage === 'active') {
    return (
      <motion.div
        className="text-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        <motion.div
          className="w-28 h-28 bg-gradient-crimson rounded-full flex items-center justify-center shadow-glow border-4 border-crimson-300 relative"
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(220, 38, 38, 0.3)",
              "0 0 40px rgba(220, 38, 38, 0.6)",
              "0 0 20px rgba(220, 38, 38, 0.3)"
            ]
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="text-center">
            <Siren className="w-10 h-10 text-white mx-auto mb-1" />
            <div className="text-white text-xs font-bold">ACTIVE</div>
          </div>
          
          {/* Pulsing rings */}
          <motion.div
            className="absolute inset-0 border-2 border-crimson-400 rounded-full"
            animate={{ scale: [1, 1.5, 2], opacity: [1, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 border-2 border-crimson-400 rounded-full"
            animate={{ scale: [1, 1.5, 2], opacity: [1, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>
        
        <div className="mt-4 space-y-2">
          <div className="text-crimson-600 font-bold text-lg">Emergency Protocol Active</div>
          <div className="text-sm text-gray-600">Connecting to authorities...</div>
          
          <div className="bg-crimson-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-crimson-600" />
              <span className="text-crimson-700 font-medium">Location transmitted</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <Phone className="w-4 h-4 text-crimson-600" />
              <span className="text-crimson-700 font-medium">Calling emergency services</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <MessageSquare className="w-4 h-4 text-crimson-600" />
              <span className="text-crimson-700 font-medium">Notifying emergency contacts</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Connecting state
  if (emergencyStage === 'connecting') {
    return (
      <motion.div
        className="text-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        <motion.div
          className="w-28 h-28 bg-gradient-to-r from-orange-500 to-crimson-500 rounded-full flex items-center justify-center shadow-glow border-4 border-orange-300"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="w-10 h-10 text-white" />
        </motion.div>
        <div className="mt-4 space-y-2">
          <div className="text-orange-600 font-bold text-lg">Connecting...</div>
          <div className="text-sm text-gray-600">Establishing secure connection</div>
          <div className="flex justify-center">
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-orange-500 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Confirmation countdown state
  if (isConfirming) {
    return (
      <motion.div
        className="text-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        <motion.div
          className="w-28 h-28 bg-gradient-to-r from-orange-500 to-crimson-500 rounded-full flex items-center justify-center shadow-glow border-4 border-orange-300 relative"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className="text-center">
            <motion.div
              className="text-white text-3xl font-bold"
              key={countdown}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {countdown}
            </motion.div>
            <div className="text-white text-xs font-bold">ACTIVATING</div>
          </div>
          
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (countdown / 3)}` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
        </motion.div>
        
        <div className="mt-4 space-y-3">
          <div className="text-orange-600 font-bold text-lg">Emergency Activating</div>
          <motion.button 
            onClick={cancelPanic}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel Emergency
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Default state
  return (
    <motion.div
      className="text-center"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
    >
      <motion.button 
        onClick={handlePanicPress}
        className="w-28 h-28 bg-gradient-crimson rounded-full flex items-center justify-center shadow-large transition-all duration-200 border-4 border-crimson-300 relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          boxShadow: [
            "0 10px 25px rgba(220, 38, 38, 0.2)",
            "0 15px 35px rgba(220, 38, 38, 0.3)",
            "0 10px 25px rgba(220, 38, 38, 0.2)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-white mx-auto mb-1 group-hover:animate-bounce" />
          <div className="text-white text-sm font-bold">EMERGENCY</div>
        </div>
        
        {/* Subtle pulse ring */}
        <motion.div
          className="absolute inset-0 border-2 border-crimson-400 rounded-full opacity-50"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.button>
      
      <div className="mt-4 space-y-2">
        <div className="text-gray-900 font-bold text-lg">Emergency Response</div>
        <div className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
          Instantly connects you to emergency services and shares your location
        </div>
        
        <div className="flex items-center justify-center space-x-4 pt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Instant</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span>GPS Enabled</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PanicButton;