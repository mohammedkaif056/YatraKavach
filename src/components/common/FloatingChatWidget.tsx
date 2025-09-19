import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  AlertTriangle, 
  MapPin, 
  QrCode, 
  Globe,
  Sparkles,
  X,
  Send,
  ArrowLeft
} from 'lucide-react';
import ResponsiveWrapper from './ResponsiveWrapper';

// Chatbot responses by language
const chatbotResponses = {
  en: {
    greeting: "Hi! I'm your AI safety assistant. How can I help you today?",
    emergency: "I've detected you need emergency help. Stay calm, I'm alerting nearby authorities immediately. Your location has been shared with emergency services.",
    map: "I can help you navigate safely! I'll show you the safest routes and highlight any areas to avoid. Where would you like to go?",
    download: "Great choice! The YatraKavach app provides 24/7 protection with real-time safety monitoring. Scan the QR code to download now.",
    stats: "Here are your current safety insights. Your safety score is excellent, indicating you're in a secure area with good coverage.",
    general: "I'm here to help with any safety concerns, navigation, or information about YatraKavach features. What would you like to know?"
  },
  hi: {
    greeting: "नमस्ते! मैं आपका AI सुरक्षा सहायक हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
    emergency: "मैंने देखा है कि आपको आपातकालीन सहायता चाहिए। शांत रहें, मैं तुरंत नजदीकी अधिकारियों को सूचित कर रहा हूं। आपका स्थान आपातकालीन सेवाओं के साथ साझा कर दिया गया है।",
    map: "मैं आपको सुरक्षित नेविगेशन में मदद कर सकता हूं! मैं आपको सबसे सुरक्षित रास्ते दिखाऊंगा और बचने वाले क्षेत्रों को हाइलाइट करूंगा। आप कहां जाना चाहते हैं?",
    download: "बेहतरीन विकल्प! YatraKavach ऐप वास्तविक समय सुरक्षा निगरानी के साथ 24/7 सुरक्षा प्रदान करता है। अभी डाउनलोड करने के लिए QR कोड स्कैन करें।",
    stats: "यहां आपकी वर्तमान सुरक्षा जानकारी है। आपका सुरक्षा स्कोर उत्कृष्ट है, जो दर्शाता है कि आप अच्छी कवरेज वाले सुरक्षित क्षेत्र में हैं।",
    general: "मैं किसी भी सुरक्षा चिंता, नेविगेशन, या YatraKavach सुविधाओं के बारे में जानकारी के लिए यहां हूं। आप क्या जानना चाहते हैं?"
  },
  as: {
    greeting: "নমস্কাৰ! মই আপোনাৰ AI সুৰক্ষা সহায়ক। আজি মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?",
    emergency: "মই দেখিছো যে আপোনাৰ জৰুৰীকালীন সহায়ৰ প্ৰয়োজন। শান্ত থাকক, মই তৎক্ষণাৎ ওচৰৰ কৰ্তৃপক্ষক সতৰ্ক কৰি আছো। আপোনাৰ অৱস্থান জৰুৰীকালীন সেৱাসমূহৰ সৈতে ভাগ-বতৰা কৰা হৈছে।",
    map: "মই আপোনাক সুৰক্ষিত নেভিগেশনত সহায় কৰিব পাৰো! মই আপোনাক আটাইতকৈ সুৰক্ষিত পথ দেখুৱাম আৰু এৰাই চলিবলগীয়া অঞ্চলসমূহ হাইলাইট কৰিম। আপুনি ক'লৈ যাব বিচাৰে?",
    download: "উৎকৃষ্ট পছন্দ! YatraKavach এপে ৰিয়েল-টাইম সুৰক্ষা নিৰীক্ষণৰ সৈতে ২৪/৭ সুৰক্ষা প্ৰদান কৰে। এতিয়াই ডাউনলোড কৰিবলৈ QR কোড স্কেন কৰক।",
    stats: "ইয়াত আপোনাৰ বৰ্তমান সুৰক্ষা অন্তৰ্দৃষ্টি আছে। আপোনাৰ সুৰক্ষা স্ক'ৰ উৎকৃষ্ট, যি দেখুৱায় যে আপুনি ভাল কভাৰেজ থকা এক সুৰক্ষিত এলেকাত আছে।",
    general: "মই যিকোনো সুৰক্ষা চিন্তা, নেভিগেশন, বা YatraKavach বৈশিষ্ট্যসমূহৰ বিষয়ে তথ্যৰ বাবে ইয়াত আছো। আপুনি কি জানিব বিচাৰে?"
  },
  bn: {
    greeting: "নমস্কার! আমি আপনার AI নিরাপত্তা সহায়ক। আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি?",
    emergency: "আমি দেখেছি আপনার জরুরি সাহায্যের প্রয়োজন। শান্ত থাকুন, আমি অবিলম্বে কাছাকাছি কর্তৃপক্ষকে সতর্ক করছি। আপনার অবস্থান জরুরি সেবার সাথে ভাগ করা হয়েছে।",
    map: "আমি আপনাকে নিরাপদ নেভিগেশনে সাহায্য করতে পারি! আমি আপনাকে সবচেয়ে নিরাপদ রুট দেখাব এবং এড়িয়ে চলার এলাকাগুলি হাইলাইট করব। আপনি কোথায় যেতে চান?",
    download: "চমৎকার পছন্দ! YatraKavach অ্যাপ রিয়েল-টাইম নিরাপত্তা নিরীক্ষণের সাথে ২৪/৭ সুরক্ষা প্রদান করে। এখনই ডাউনলোড করতে QR কোড স্ক্যান করুন।",
    stats: "এখানে আপনার বর্তমান নিরাপত্তা অন্তর্দৃষ্টি রয়েছে। আপনার নিরাপত্তা স্কোর চমৎকার, যা দেখায় আপনি ভাল কভারেজ সহ একটি নিরাপদ এলাকায় আছেন।",
    general: "আমি যেকোনো নিরাপত্তা উদ্বেগ, নেভিগেশন, বা YatraKavach বৈশিষ্ট্য সম্পর্কে তথ্যের জন্য এখানে আছি। আপনি কি জানতে চান?"
  }
};

interface Language {
  name: string;
  flag: string;
  nativeName?: string;
}

interface Languages {
  [key: string]: Language;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface FloatingChatWidgetProps {
  languages: Languages;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onChatToggle: () => void;
  onFeatureClick: (feature: 'map' | 'sos' | 'stats' | 'id') => void;
  onQRModalOpen: () => void;
  isOpen: boolean;
  hasNewMessage?: boolean;
  className?: string;
}

// Floating Button Component
const FloatingButton: React.FC<{
  onClick: () => void;
  isOpen: boolean;
  hasNewMessage?: boolean;
  currentLanguage: string;
  languages: Languages;
}> = ({ onClick, isOpen, hasNewMessage, currentLanguage, languages }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClick();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClick]);

  return (
    <div className="relative">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900/90 backdrop-blur-xl text-white text-sm rounded-xl border border-white/10 whitespace-nowrap shadow-2xl z-10"
            role="tooltip"
            id="chat-tooltip"
          >
            Chat with us
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        className="relative w-16 h-16 bg-gradient-to-br from-emerald-500/90 to-emerald-600/90 hover:from-emerald-400/90 hover:to-emerald-500/90 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)"
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: hasNewMessage ? [
            "0 0 0 0 rgba(16, 185, 129, 0.6)",
            "0 0 0 20px rgba(16, 185, 129, 0)",
            "0 0 0 0 rgba(16, 185, 129, 0.6)"
          ] : [
            "0 0 0 0 rgba(16, 185, 129, 0.4)",
            "0 0 0 15px rgba(16, 185, 129, 0)",
            "0 0 0 0 rgba(16, 185, 129, 0.4)"
          ]
        }}
        transition={{ 
          duration: hasNewMessage ? 1.5 : 2.5, 
          repeat: Infinity,
          scale: { type: "spring", stiffness: 300, damping: 20 }
        }}
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label={isOpen ? "Close AI assistant" : "Open multilingual AI assistant"}
        aria-describedby={showTooltip ? "chat-tooltip" : undefined}
        aria-expanded={isOpen}
        role="button"
        tabIndex={0}
      >
        {/* Main Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </motion.div>

        {/* New Message Indicator */}
        <AnimatePresence>
          {hasNewMessage && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 bg-white rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Online Status */}
        <div className="absolute -top-1 -left-1 w-4 h-4 bg-emerald-300 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
        </div>

        {/* Language Flag Badge */}
        <motion.div 
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-white/95 backdrop-blur-sm rounded-full border-2 border-white/50 flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
        >
          <span className="text-xs font-medium">
            {languages[currentLanguage]?.flag}
          </span>
        </motion.div>

        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
      </motion.button>
    </div>
  );
};

// Language Switcher Component - Enhanced UI
const LanguageSwitcher: React.FC<{
  languages: Languages;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}> = ({ languages, currentLanguage, onLanguageChange }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-gray-600" />
          <h4 className="text-gray-800 font-semibold text-sm">Choose Language</h4>
        </div>
        <p className="text-gray-500 text-xs">Select your preferred language</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(languages).map(([code, lang]) => (
          <motion.button
            key={code}
            className={`relative flex items-center gap-3 p-4 rounded-2xl transition-all text-sm border-2 ${
              currentLanguage === code
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300'
            }`}
            whileHover={{ scale: currentLanguage === code ? 1 : 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onLanguageChange(code)}
            aria-label={`Switch to ${lang.name}`}
          >
            {/* Flag Circle */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-medium ${
              currentLanguage === code ? 'bg-white/20' : 'bg-gray-200'
            }`}>
              {lang.flag}
            </div>
            
            <div className="text-left flex-1">
              <div className="font-semibold leading-tight text-xs">
                {code.toUpperCase()}
              </div>
              <div className={`text-xs leading-tight ${
                currentLanguage === code ? 'text-white/90' : 'text-gray-600'
              }`}>
                {lang.nativeName || lang.name}
              </div>
            </div>
            
            {/* Selected Indicator */}
            {currentLanguage === code && (
              <motion.div
                layoutId="selectedLanguage"
                className="absolute top-2 right-2"
                initial={false}
              >
                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                </div>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Full Chat Interface Component
const ChatInterface: React.FC<{
  languages: Languages;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onBack: () => void;
  initialContext?: string;
}> = ({ languages, currentLanguage, onLanguageChange, onBack, initialContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat with context-based message
  useEffect(() => {
    const getInitialMessage = () => {
      const responses = chatbotResponses[currentLanguage as keyof typeof chatbotResponses];
      switch (initialContext) {
        case 'sos':
          return responses.emergency;
        case 'map':
          return responses.map;
        case 'download':
          return responses.download;
        case 'stats':
          return responses.stats;
        default:
          return responses.greeting;
      }
    };

    setMessages([{
      id: 'initial-' + Date.now(),
      text: getInitialMessage(),
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, [currentLanguage, initialContext]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const responses = chatbotResponses[currentLanguage as keyof typeof chatbotResponses];
      const botMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        text: responses.general,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  }, [inputValue, currentLanguage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <motion.div
      className="absolute bottom-20 right-0 w-80 max-w-[calc(100vw-2rem)] h-96 bg-white/98 backdrop-blur-2xl rounded-3xl border border-gray-200/50 shadow-2xl overflow-hidden flex flex-col"
      initial={{ opacity: 0, scale: 0.8, y: 20, originX: 1, originY: 1 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              aria-label="Back to menu"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
            <div>
              <h3 className="font-semibold text-lg">AI Assistant</h3>
              <div className="flex items-center gap-2 text-emerald-100">
                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                <span className="text-sm">Online • {languages[currentLanguage]?.name}</span>
              </div>
            </div>
          </div>
          
          {/* Language Selector */}
          <select
            className="bg-white/20 text-white text-xs px-3 py-2 rounded-xl border-none outline-none cursor-pointer backdrop-blur-sm"
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            {Object.entries(languages).map(([code, lang]) => (
              <option key={code} value={code} className="bg-gray-800 text-white">
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm ${
              message.sender === 'user' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white text-gray-800 border border-gray-100'
            }`}>
              <p className="leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-2 ${
                message.sender === 'user' ? 'text-emerald-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white/80">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              currentLanguage === 'hi' ? 'मसेज लिखें...' : 
              currentLanguage === 'as' ? 'মেচেজ লিখক...' :
              currentLanguage === 'bn' ? 'মেসেজ লিখুন...' :
              'Type a message...'
            }
            className="flex-1 bg-gray-100 text-gray-800 placeholder-gray-500 rounded-xl px-4 py-2 text-sm outline-none border-2 border-transparent focus:border-emerald-400 transition-colors"
          />
          <motion.button
            className="bg-emerald-500 hover:bg-emerald-600 rounded-xl px-4 py-2 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
const QuickActions: React.FC<{
  onFeatureClick: (feature: 'map' | 'sos' | 'stats' | 'id') => void;
  onQRModalOpen: () => void;
  onActionSelect: (action: string) => void;
}> = ({ onFeatureClick, onQRModalOpen, onActionSelect }) => {
  const actions = [
    {
      id: 'sos' as const,
      icon: AlertTriangle,
      label: 'Emergency',
      color: 'text-red-500 hover:text-red-600',
      bgColor: 'hover:bg-red-50',
      description: 'Get immediate help',
      onClick: () => {
        onFeatureClick('sos');
        onActionSelect('sos');
      }
    },
    {
      id: 'map' as const,
      icon: MapPin,
      label: 'Navigation',
      color: 'text-blue-500 hover:text-blue-600',
      bgColor: 'hover:bg-blue-50',
      description: 'Find your way',
      onClick: () => {
        onFeatureClick('map');
        onActionSelect('map');
      }
    },
    {
      id: 'download' as const,
      icon: QrCode,
      label: 'Download',
      color: 'text-emerald-500 hover:text-emerald-600',
      bgColor: 'hover:bg-emerald-50',
      description: 'Get the app',
      onClick: () => {
        onQRModalOpen();
        onActionSelect('download');
      }
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-gray-600" />
        <h4 className="text-gray-800 font-semibold text-sm">Quick Actions</h4>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            className={`group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all bg-white border-2 border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-200/50 ${action.bgColor}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={action.onClick}
            aria-label={action.description}
            title={action.description}
          >
            <div className={`p-3 rounded-xl transition-colors ${action.color} bg-gray-50 group-hover:bg-gray-100`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 text-center leading-tight">
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Main Chat Panel Component
const ChatPanel: React.FC<{
  isOpen: boolean;
  languages: Languages;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  onFeatureClick: (feature: 'map' | 'sos' | 'stats' | 'id') => void;
  onQRModalOpen: () => void;
  onClose: () => void;
}> = ({ 
  isOpen, 
  languages, 
  currentLanguage, 
  onLanguageChange, 
  onFeatureClick, 
  onQRModalOpen,
  onClose
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatContext, setChatContext] = useState<string>('');

  // Focus management
  useEffect(() => {
    if (isOpen && panelRef.current) {
      const firstFocusable = panelRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Reset state when panel closes
  useEffect(() => {
    if (!isOpen) {
      setShowChat(false);
      setChatContext('');
    }
  }, [isOpen]);

  const handleActionSelect = useCallback((action: string) => {
    setChatContext(action);
    setShowChat(true);
  }, []);

  const handleStartChatClick = useCallback(() => {
    setChatContext('general');
    setShowChat(true);
  }, []);

  const handleBackToMenu = useCallback(() => {
    setShowChat(false);
    setChatContext('');
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div ref={panelRef}>
          {showChat ? (
            <ChatInterface
              languages={languages}
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
              onBack={handleBackToMenu}
              initialContext={chatContext}
            />
          ) : (
            <motion.div
              className="absolute bottom-20 right-0 w-80 max-w-[calc(100vw-2rem)] bg-white/98 backdrop-blur-2xl rounded-3xl border border-gray-200/50 shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, y: 20, originX: 1, originY: 1 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="chat-panel-title"
            >
              {/* Header - Cleaner Design */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 text-white relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 id="chat-panel-title" className="font-semibold text-lg">AI Assistant</h3>
                      <div className="flex items-center gap-2 text-emerald-100">
                        <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                        <span className="text-sm">Online • Ready to help</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Close Button */}
                  <motion.button
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    aria-label="Close chat panel"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Content - Better Spacing and Typography */}
              <div className="p-6 space-y-6 max-h-80 overflow-y-auto">
                {/* Language Switcher */}
                <LanguageSwitcher 
                  languages={languages}
                  currentLanguage={currentLanguage}
                  onLanguageChange={onLanguageChange}
                />

                {/* Start Chat Button - More Prominent */}
                <motion.button
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold text-sm transition-all shadow-lg hover:shadow-emerald-500/25 border border-emerald-400/20 flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartChatClick}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Start Conversation</span>
                </motion.button>

                {/* Quick Actions - Refined Design */}
                <div className="border-t border-gray-100 pt-6">
                  <QuickActions 
                    onFeatureClick={onFeatureClick}
                    onQRModalOpen={onQRModalOpen}
                    onActionSelect={handleActionSelect}
                  />
                </div>
              </div>

              {/* Subtle Bottom Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white/50 to-transparent pointer-events-none rounded-b-3xl" />
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};

// Main FloatingChatWidget Component
const FloatingChatWidget: React.FC<FloatingChatWidgetProps> = ({
  languages,
  currentLanguage,
  onLanguageChange,
  onChatToggle,
  onFeatureClick,
  onQRModalOpen,
  isOpen,
  hasNewMessage = false,
  className = ""
}) => {
  const handleClose = useCallback(() => {
    if (isOpen) {
      onChatToggle();
    }
  }, [isOpen, onChatToggle]);

  return (
    <ResponsiveWrapper className={className}>
      {/* Chat Panel */}
      <ChatPanel
        isOpen={isOpen}
        languages={languages}
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        onFeatureClick={onFeatureClick}
        onQRModalOpen={onQRModalOpen}
        onClose={handleClose}
      />

      {/* Floating Button */}
      <FloatingButton
        onClick={onChatToggle}
        isOpen={isOpen}
        hasNewMessage={hasNewMessage}
        currentLanguage={currentLanguage}
        languages={languages}
      />
    </ResponsiveWrapper>
  );
};

export default FloatingChatWidget;