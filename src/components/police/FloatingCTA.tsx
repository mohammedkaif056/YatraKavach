import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  AlertCircle, 
  MessageCircle, 
  MapPin, 
  FileText, 
  X, 
  Camera,
  PhoneCall,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface FloatingCTAProps {
  className?: string;
}

type IncidentType = 'emergency' | 'report' | 'message' | 'location' | 'evidence';

interface IncidentOption {
  id: IncidentType;
  icon: React.ElementType;
  label: string;
  color: string;
  permission?: string;
  description: string;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const { isDark } = useTheme();
  
  // Incident creation options
  const options: IncidentOption[] = [
    {
      id: 'emergency',
      icon: AlertCircle,
      label: 'Emergency',
      color: 'bg-red-500 hover:bg-red-600 text-white',
      permission: 'create_incidents',
      description: 'Create high-priority emergency incident'
    },
    {
      id: 'report',
      icon: FileText,
      label: 'Report',
      color: 'bg-blue-500 hover:bg-blue-600 text-white',
      permission: 'create_reports',
      description: 'Create incident report'
    },
    {
      id: 'message',
      icon: MessageCircle,
      label: 'Message',
      color: 'bg-purple-500 hover:bg-purple-600 text-white',
      permission: 'message_tourists',
      description: 'Send message to tourist'
    },
    {
      id: 'location',
      icon: MapPin,
      label: 'Location',
      color: 'bg-green-500 hover:bg-green-600 text-white',
      permission: 'track_tourists',
      description: 'Track tourist location'
    },
    {
      id: 'evidence',
      icon: Camera,
      label: 'Evidence',
      color: 'bg-amber-500 hover:bg-amber-600 text-white',
      permission: 'create_evidence',
      description: 'Add evidence to case'
    }
  ];
  
  // Filter options based on permissions
  const availableOptions = options.filter(option => 
    !option.permission || hasPermission(option.permission)
  );
  
  // Handle option click
  const handleOptionClick = (option: IncidentOption) => {
    setIsOpen(false);
    
    // Show feedback
    setFeedbackType('success');
    setShowFeedback(true);
    
    // Clear feedback after delay
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
    
    // Navigate based on option
    switch (option.id) {
      case 'emergency':
        navigate('/police/incidents/create?type=emergency');
        break;
      case 'report':
        navigate('/police/incidents/create?type=report');
        break;
      case 'message':
        navigate('/police/tourists?action=message');
        break;
      case 'location':
        navigate('/police/tourists?action=track');
        break;
      case 'evidence':
        navigate('/police/incidents?action=add-evidence');
        break;
      default:
        navigate('/police/incidents/create');
    }
  };
  
  return (
    <div className={cn("fixed bottom-6 right-6 z-40", className)}>
      {/* Success/Error Feedback */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute bottom-20 right-0 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2",
              feedbackType === 'success' 
                ? "bg-green-500 text-white" 
                : "bg-red-500 text-white"
            )}
          >
            {feedbackType === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>
              {feedbackType === 'success' 
                ? 'Creating new incident...' 
                : 'Failed to create incident'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Option Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-20 right-0 mb-2 flex flex-col space-y-3 items-end"
          >
            {availableOptions.map((option) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.15 }}
                className="flex items-center space-x-2"
              >
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-3 py-1.5 text-sm font-medium">
                  {option.label}
                </div>
                <button
                  onClick={() => handleOptionClick(option)}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-110",
                    option.color
                  )}
                  aria-label={option.label}
                >
                  <option.icon size={20} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main CTA Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all transform",
          isOpen
            ? "bg-gray-700 hover:bg-gray-800 rotate-45"
            : isDark
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        )}
        aria-label={isOpen ? "Close menu" : "Create incident"}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Plus size={24} className="text-white" />
        )}
        
        {/* Haptic feedback ripple */}
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-full bg-white"
          />
        )}
      </button>
    </div>
  );
};

export default FloatingCTA;