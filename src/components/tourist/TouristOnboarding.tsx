import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, CheckCircle, Lock, ArrowRight, Info,
  WifiOff, Zap, Smartphone, UserCheck, FileText,
  Play, Clock
} from 'lucide-react';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

// Types and Interfaces
interface ConsentSettings {
  locationTracking: boolean;
  dataSharing: boolean;
  emergencySharing: boolean;
  analytics: boolean;
  timestamp: string;
}

interface UserProfile {
  name: string;
  emergencyContact: string;
  language: string;
  localEmergencyNumber: string;
}

interface DigitalID {
  id: string;
  expiryDate: string;
  isActive: boolean;
}

interface OnboardingStep {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  component: string;
  skipable: boolean;
  required: boolean;
}

interface CopyText {
  title: string;
  subtitle?: string;
  description?: string;
  cta: string;
  skipCta?: string;
  trustMarkers?: string[];
  toggles?: Record<string, { title: string; description: string }>;
  retention?: string;
  revoke?: string;
  manageCta?: string;
  cards?: Array<{ title: string; description: string; details: string }>;
  fields?: Record<string, string>;
  placeholders?: Record<string, string>;
  preview?: string;
  details?: string;
  expiry?: string;
  steps?: string[];
  demoBadge?: string;
  warning?: string;
  tips?: string[];
  settingsCta?: string;
}

// Supported Languages
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' }
];

// Component declarations moved to bottom of file to avoid duplicates

// Localized Copy
const COPY = {
  en: {
    welcome: {
      title: "Welcome to YatraKavach",
      subtitle: "Safeguarding your journey",
      description: "Your AI-powered travel safety companion, designed to protect and assist you throughout your journey across India.",
      trustMarkers: ["Government Certified", "Privacy First", "Offline Ready"],
      cta: "Get Started",
      skipCta: "Skip Setup"
    },
    consent: {
      title: "Privacy & Permissions",
      subtitle: "Your data, your choice",
      description: "We need your permission to keep you safe. You can change these settings anytime.",
      toggles: {
        locationTracking: {
          title: "Location Tracking",
          description: "Share live location during active trips only"
        },
        dataSharing: {
          title: "Data Analytics", 
          description: "Help improve safety features with anonymous usage data"
        },
        emergencySharing: {
          title: "Emergency Sharing",
          description: "Share data with authorities during emergencies"
        }
      },
      retention: "Data retained for 30 days maximum",
      revoke: "You can revoke consent anytime",
      cta: "Accept & Continue",
      manageCta: "Manage Settings"
    },
    features: {
      title: "Your Safety Toolkit",
      subtitle: "Everything you need in one app",
      cards: [
        {
          title: "Digital ID",
          description: "Verifiable, time-limited identification",
          details: "Secure blockchain-based ID for quick verification"
        },
        {
          title: "Safety Score",
          description: "Real-time risk assessment",
          details: "AI-powered alerts about area safety and travel conditions"
        },
        {
          title: "Panic Button",
          description: "One tap emergency response",
          details: "Instant alert to nearest responders with live location"
        },
        {
          title: "Offline Mode",
          description: "Works without internet",
          details: "SMS fallback and offline maps for remote areas"
        }
      ],
      cta: "Continue",
      skipCta: "Skip Tour"
    },
    profile: {
      title: "Quick Setup",
      subtitle: "Just the essentials",
      fields: {
        name: "Your Name",
        emergencyContact: "Emergency Contact",
        language: "Preferred Language",
        localEmergency: "Local Emergency Number"
      },
      placeholders: {
        name: "Enter your name",
        emergencyContact: "+1 234 567 8900",
        localEmergency: "112 (Default)"
      },
      cta: "Continue",
      skipCta: "Skip for now"
    },
    digitalId: {
      title: "Your Digital ID",
      subtitle: "Secure & Private",
      description: "Your encrypted identification expires automatically for security.",
      preview: "Preview ID",
      details: "Stored securely using blockchain technology",
      expiry: "Expires:",
      cta: "Issue Demo ID",
      skipCta: "Skip Demo"
    },
    demo: {
      title: "Try It Out",
      subtitle: "Safe demo mode",
      description: "Experience core features without sending real alerts.",
      steps: [
        "Explore the safety dashboard",
        "Check your safety score", 
        "Test the panic button (demo only)",
        "View your digital ID"
      ],
      demoBadge: "DEMO MODE",
      warning: "No real alerts will be sent",
      cta: "Start Demo",
      skipCta: "Skip Demo"
    },
    success: {
      title: "You're All Set!",
      subtitle: "Ready to travel safely",
      description: "Location sharing active until",
      tips: [
        "Tap panic button anytime for help",
        "Tap ID to share with authorities",
        "Check safety score before traveling"
      ],
      cta: "Open Dashboard",
      settingsCta: "Manage Settings"
    }
  }
};

const TouristOnboarding: React.FC = () => {
  // Core State
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState('en');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(false);
  
  // User Data State
  const [consentSettings, setConsentSettings] = useState<ConsentSettings>({
    locationTracking: false,
    dataSharing: false, 
    emergencySharing: false,
    analytics: false,
    timestamp: new Date().toISOString()
  });
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    emergencyContact: '',
    language: 'en',
    localEmergencyNumber: '112'
  });
  
  const [digitalId, setDigitalId] = useState<DigitalID>({
    id: '',
    expiryDate: '',
    isActive: false
  });

  const navigate = useNavigate();
  const copy = COPY[language as keyof typeof COPY] || COPY.en;

  // Onboarding Steps Configuration
  const steps: OnboardingStep[] = [
    { id: 'welcome', title: 'Welcome', component: 'WelcomeScreen', skipable: false, required: true },
    { id: 'consent', title: 'Privacy', component: 'ConsentScreen', skipable: false, required: true },
    { id: 'features', title: 'Features', component: 'FeaturesScreen', skipable: true, required: false },
    { id: 'profile', title: 'Profile', component: 'ProfileScreen', skipable: true, required: false },
    { id: 'digitalId', title: 'Digital ID', component: 'DigitalIdScreen', skipable: true, required: false },
    { id: 'demo', title: 'Demo', component: 'DemoScreen', skipable: true, required: false },
    { id: 'success', title: 'Complete', component: 'SuccessScreen', skipable: false, required: true }
  ];

  // Effects
  useEffect(() => {
    // Detect user language
    const browserLang = navigator.language.split('-')[0];
    const supportedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang);
    if (supportedLang) {
      setLanguage(supportedLang.code);
      setUserProfile(prev => ({ ...prev, language: supportedLang.code }));
    }

    // Check accessibility preferences
    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    setIsAccessibilityMode(hasReducedMotion || hasHighContrast);

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    const progressTimer = setInterval(() => {
      setProgress(prev => prev < 100 ? prev + 5 : 100);
    }, 100);
    
    // Online/offline detection
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Analytics tracking
  const trackEvent = (eventName: string, properties: Record<string, unknown> = {}) => {
    // Analytics implementation would go here
    console.log('Analytics:', eventName, { ...properties, timestamp: new Date().toISOString() });
  };

  // Navigation functions
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      trackEvent('onboarding_step_completed', { step: steps[currentStep].id });
    } else {
      completeOnboarding();
    }
  };

  // Previous step functionality removed as not used in this implementation

  const completeOnboarding = () => {
    trackEvent('onboarding_completed', { 
      consent: consentSettings,
      profile: userProfile,
      digitalId: digitalId.isActive,
      demoCompleted: isDemoMode
    });
    navigate('/tourist/dashboard');
  };

  const skipOnboarding = () => {
    trackEvent('onboarding_skipped');
    navigate('/tourist/dashboard');
  };

  // Consent management
  const updateConsent = (key: keyof ConsentSettings, value: boolean) => {
    setConsentSettings(prev => ({
      ...prev,
      [key]: value,
      timestamp: new Date().toISOString()
    }));
    trackEvent('consent_updated', { [key]: value });
  };

  const revokeAllConsent = () => {
    setConsentSettings({
      locationTracking: false,
      dataSharing: false,
      emergencySharing: false,
      analytics: false,
      timestamp: new Date().toISOString()
    });
    trackEvent('consent_revoked');
  };

  // Profile management
  const updateProfile = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Digital ID generation
  const generateDigitalId = () => {
    const id = Math.random().toString(36).substring(2, 15);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    setDigitalId({
      id,
      expiryDate: expiryDate.toISOString(),
      isActive: true
    });
    trackEvent('digital_id_generated', { expiryDate: expiryDate.toISOString() });
  };

  if (isLoading) {
    return (
      <LoadingScreen progress={progress} />
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* Accessibility Banner */}
      {isAccessibilityMode && (
        <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm">
          High contrast mode enabled • Screen reader optimized
        </div>
      )}

      {/* Offline Banner */}
      {isOffline && (
        <motion.div 
          className="bg-orange-500 text-white px-4 py-2 text-center text-sm flex items-center justify-center gap-2"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
        >
          <WifiOff className="w-4 h-4" />
          Offline mode • SMS fallback available
        </motion.div>
      )}

      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-50">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Select language"
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Progress Header */}
        <OnboardingProgress 
          currentStep={currentStep} 
          totalSteps={steps.length}
          stepTitle={currentStepData.title}
        />

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  function renderCurrentStep() {
    switch (currentStepData.component) {
      case 'WelcomeScreen':
        return <WelcomeScreen onNext={nextStep} onSkip={skipOnboarding} copy={copy.welcome} />;
      case 'ConsentScreen':
        return (
          <ConsentScreen 
            consent={consentSettings}
            onUpdate={updateConsent}
            onNext={nextStep}
            onRevoke={revokeAllConsent}
            copy={copy.consent}
          />
        );
      case 'FeaturesScreen':
        return <FeaturesScreen onNext={nextStep} onSkip={nextStep} copy={copy.features} />;
      case 'ProfileScreen':
        return (
          <ProfileScreen 
            profile={userProfile}
            onUpdate={updateProfile}
            onNext={nextStep}
            onSkip={nextStep}
            copy={copy.profile}
            languages={SUPPORTED_LANGUAGES}
          />
        );
      case 'DigitalIdScreen':
        return (
          <DigitalIdScreen 
            digitalId={digitalId}
            onGenerate={generateDigitalId}
            onNext={nextStep}
            onSkip={nextStep}
            copy={copy.digitalId}
          />
        );
      case 'DemoScreen':
        return (
          <DemoScreen 
            onNext={nextStep}
            onSkip={nextStep}
            onStartDemo={() => setIsDemoMode(true)}
            copy={copy.demo}
          />
        );
      case 'SuccessScreen':
        return (
          <SuccessScreen 
            digitalId={digitalId}
            onComplete={completeOnboarding}
            copy={copy.success}
          />
        );
      default:
        return <WelcomeScreen onNext={nextStep} onSkip={skipOnboarding} copy={copy.welcome} />;
    }
  }
};

// Loading Screen Component
const LoadingScreen: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 flex items-center justify-center relative overflow-hidden">
    {/* Animated Background */}
    <div className="absolute inset-0">
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>

    <div className="text-center relative z-10">
      <motion.div
        className="mb-12"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
      >
        <motion.div
          className="inline-block"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <Logo size="xl" variant="white" showText={false} />
        </motion.div>
      </motion.div>

      <motion.h1
        className="text-5xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
          YatraKavach
        </span>
      </motion.h1>

      <motion.p
        className="text-xl text-blue-200 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        Initializing your safety companion...
      </motion.p>

      {/* Progress Bar */}
      <motion.div
        className="w-64 mx-auto mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-400 to-indigo-400 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <p className="text-blue-300 text-sm mt-2">{progress}% Complete</p>
      </motion.div>

      {/* Loading Dots */}
      <motion.div
        className="flex justify-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-400 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  </div>
);

// Progress Component
const OnboardingProgress: React.FC<{ 
  currentStep: number; 
  totalSteps: number; 
  stepTitle: string;
}> = ({ currentStep, totalSteps, stepTitle }) => (
  <motion.div
    className="mb-8"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">{stepTitle}</h2>
      <span className="text-sm text-gray-500">
        {currentStep + 1} of {totalSteps}
      </span>
    </div>
    
    <div className="w-full bg-gray-200 rounded-full h-1">
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
    
    <p className="text-xs text-gray-500 mt-2 text-center">
      {Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete
    </p>
  </motion.div>
);

// Welcome Screen Component
const WelcomeScreen: React.FC<{
  onNext: () => void;
  onSkip: () => void;
  copy: CopyText;
}> = ({ onNext, onSkip, copy }) => (
  <motion.div
    className="text-center py-8"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="mb-8">
      <div className="flex justify-center mb-6">
        <Logo size="lg" variant="default" showText={false} />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        {copy.title}
      </h1>
      
      <p className="text-lg text-blue-600 font-medium mb-4">
        {copy.subtitle}
      </p>
      
      <p className="text-gray-600 leading-relaxed px-4">
        {copy.description}
      </p>
    </div>

    {/* Trust Markers */}
    <div className="grid grid-cols-1 gap-3 mb-8">
      {copy.trustMarkers?.map((marker, index) => (
        <motion.div
          key={index}
          className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">{marker}</span>
        </motion.div>
      ))}
    </div>

    {/* Action Buttons */}
    <div className="space-y-3">
      <Button
        size="lg"
        onClick={onNext}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 text-lg"
        aria-label="Start onboarding process"
      >
        {copy.cta}
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
      
      <button
        onClick={onSkip}
        className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm font-medium transition-colors"
        aria-label="Skip onboarding setup"
      >
        {copy.skipCta}
      </button>
    </div>
  </motion.div>
);

// Consent Screen Component
const ConsentScreen: React.FC<{
  consent: ConsentSettings;
  onUpdate: (key: keyof ConsentSettings, value: boolean) => void;
  onNext: () => void;
  onRevoke: () => void;
  copy: CopyText;
}> = ({ consent, onUpdate, onNext, onRevoke, copy }) => (
  <motion.div
    className="py-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="text-center mb-8">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-lg">
        <Lock className="w-8 h-8 text-white mx-auto" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {copy.title}
      </h1>
      
      <p className="text-purple-600 font-medium mb-3">
        {copy.subtitle}
      </p>
      
      <p className="text-gray-600 text-sm px-4">
        {copy.description}
      </p>
    </div>

    {/* Consent Toggles */}
    <div className="space-y-4 mb-6">
      {copy.toggles && Object.entries(copy.toggles).map(([key, toggle]) => (
        <motion.div
          key={key}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {toggle.title}
              </h3>
              <p className="text-sm text-gray-600">
                {toggle.description}
              </p>
            </div>
            
            <button
              onClick={() => onUpdate(key as keyof ConsentSettings, !consent[key as keyof ConsentSettings])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                consent[key as keyof ConsentSettings] ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Toggle ${toggle.title}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  consent[key as keyof ConsentSettings] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Legal Info */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">{copy.retention}</p>
          <p>{copy.revoke}</p>
        </div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="space-y-3">
      <Button
        size="lg"
        onClick={onNext}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4"
        disabled={!Object.values(consent).some(Boolean)}
      >
        {copy.cta}
        <CheckCircle className="ml-2 w-5 h-5" />
      </Button>
      
      <button
        onClick={onRevoke}
        className="w-full text-red-600 hover:text-red-700 py-2 text-sm font-medium transition-colors"
      >
        Revoke All Consent
      </button>
    </div>
  </motion.div>
);

// Features Screen Component  
const FeaturesScreen: React.FC<{
  onNext: () => void;
  onSkip: () => void;
  copy: CopyText;
}> = ({ onNext, onSkip, copy }) => (
  <motion.div
    className="py-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {copy.title}
      </h1>
      <p className="text-blue-600 font-medium">
        {copy.subtitle}
      </p>
    </div>

    {/* Feature Cards */}
    <div className="space-y-4 mb-8">
      {copy.cards?.map((card, index: number) => {
        const icons = [Shield, Zap, Smartphone, WifiOff];
        const IconComponent = icons[index] || Shield;
        const gradients = [
          'from-blue-500 to-indigo-600',
          'from-green-500 to-emerald-600', 
          'from-red-500 to-pink-600',
          'from-purple-500 to-violet-600'
        ];
        
        return (
          <motion.div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start gap-4">
              <div className={`bg-gradient-to-r ${gradients[index]} p-3 rounded-lg shadow-md flex-shrink-0`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {card.description}
                </p>
                <p className="text-xs text-gray-500">
                  {card.details}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>

    {/* Action Buttons */}
    <div className="space-y-3">
      <Button
        size="lg"
        onClick={onNext}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4"
      >
        {copy.cta}
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
      
      <button
        onClick={onSkip}
        className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm font-medium transition-colors"
      >
        {copy.skipCta}
      </button>
    </div>
  </motion.div>
);

// Profile Screen Component
const ProfileScreen: React.FC<{
  profile: UserProfile;
  onUpdate: (field: keyof UserProfile, value: string) => void;
  onNext: () => void;
  onSkip: () => void;
  copy: CopyText;
  languages: Array<{ code: string; name: string; flag: string }>;
}> = ({ profile, onUpdate, onNext, onSkip, copy, languages }) => (
  <motion.div
    className="py-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="text-center mb-8">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-lg">
        <UserCheck className="w-8 h-8 text-white mx-auto" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {copy.title}
      </h1>
      <p className="text-green-600 font-medium">
        {copy.subtitle}
      </p>
    </div>

    {/* Form Fields */}
    <div className="space-y-4 mb-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {copy.fields?.name}
        </label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => onUpdate('name', e.target.value)}
          placeholder={copy.placeholders?.name}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Enter your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {copy.fields?.emergencyContact}
        </label>
        <input
          type="tel"
          value={profile.emergencyContact}
          onChange={(e) => onUpdate('emergencyContact', e.target.value)}
          placeholder={copy.placeholders?.emergencyContact}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Enter emergency contact number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {copy.fields?.language}
        </label>
        <select
          value={profile.language}
          onChange={(e) => onUpdate('language', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Select preferred language"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {copy.fields?.localEmergency}
        </label>
        <input
          type="tel"
          value={profile.localEmergencyNumber}
          onChange={(e) => onUpdate('localEmergencyNumber', e.target.value)}
          placeholder={copy.placeholders?.localEmergency}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Enter local emergency number"
        />
      </div>
    </div>

    {/* Action Buttons */}
    <div className="space-y-3">
      <Button
        size="lg"
        onClick={onNext}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4"
        disabled={!profile.name.trim()}
      >
        {copy.cta}
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
      
      <button
        onClick={onSkip}
        className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm font-medium transition-colors"
      >
        {copy.skipCta}
      </button>
    </div>
  </motion.div>
);

// Digital ID Screen Component
const DigitalIdScreen: React.FC<{
  digitalId: DigitalID;
  onGenerate: () => void;
  onNext: () => void;
  onSkip: () => void;
  copy: CopyText;
}> = ({ digitalId, onGenerate, onNext, onSkip, copy }) => (
  <motion.div
    className="py-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="text-center mb-8">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-lg">
        <FileText className="w-8 h-8 text-white mx-auto" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {copy.title}
      </h1>
      <p className="text-indigo-600 font-medium mb-3">
        {copy.subtitle}
      </p>
      <p className="text-gray-600 text-sm px-4">
        {copy.description}
      </p>
    </div>

    {/* Digital ID Preview */}
    {digitalId.isActive ? (
      <motion.div
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white mb-6 shadow-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Digital ID</h3>
          <Shield className="w-6 h-6" />
        </div>
        
        <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-sm opacity-80 mb-1">ID Number</p>
          <p className="font-mono text-lg">{digitalId.id}</p>
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            {copy.expiry} {new Date(digitalId.expiryDate).toLocaleDateString()}
          </span>
        </div>
      </motion.div>
    ) : (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">{copy.preview}</p>
        <p className="text-sm text-gray-500">{copy.details}</p>
      </div>
    )}

    {/* Action Buttons */}
    <div className="space-y-3">
      {!digitalId.isActive ? (
        <Button
          size="lg"
          onClick={onGenerate}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4"
        >
          {copy.cta}
          <Shield className="ml-2 w-5 h-5" />
        </Button>
      ) : (
        <Button
          size="lg"
          onClick={onNext}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4"
        >
          Continue
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      )}
      
      <button
        onClick={onSkip}
        className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm font-medium transition-colors"
      >
        {copy.skipCta}
      </button>
    </div>
  </motion.div>
);

// Demo Screen Component
const DemoScreen: React.FC<{
  onNext: () => void;
  onSkip: () => void;
  onStartDemo: () => void;
  copy: CopyText;
}> = ({ onNext, onSkip, onStartDemo, copy }) => (
  <motion.div
    className="py-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="text-center mb-8">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-lg">
        <Play className="w-8 h-8 text-white mx-auto" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {copy.title}
      </h1>
      <p className="text-orange-600 font-medium mb-3">
        {copy.subtitle}
      </p>
      <p className="text-gray-600 text-sm px-4">
        {copy.description}
      </p>
    </div>

    {/* Demo Badge */}
    <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          {copy.demoBadge}
        </div>
        <div className="flex-1">
          <p className="text-sm text-orange-800 font-medium">
            {copy.warning}
          </p>
        </div>
      </div>
    </div>

    {/* Demo Steps */}
    <div className="space-y-3 mb-8">
      {copy.steps?.map((step, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
            {index + 1}
          </div>
          <span className="text-gray-700">{step}</span>
        </motion.div>
      ))}
    </div>

    {/* Action Buttons */}
    <div className="space-y-3">
      <Button
        size="lg"
        onClick={() => {
          onStartDemo();
          onNext();
        }}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-4"
      >
        {copy.cta}
        <Play className="ml-2 w-5 h-5" />
      </Button>
      
      <button
        onClick={onSkip}
        className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm font-medium transition-colors"
      >
        {copy.skipCta}
      </button>
    </div>
  </motion.div>
);

// Success Screen Component
const SuccessScreen: React.FC<{
  digitalId: DigitalID;
  onComplete: () => void;
  copy: CopyText;
}> = ({ digitalId, onComplete, copy }) => (
  <motion.div
    className="py-6 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <motion.div
      className="mb-8"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
    >
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-full w-24 h-24 mx-auto mb-6 shadow-lg">
        <CheckCircle className="w-12 h-12 text-white mx-auto" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        {copy.title}
      </h1>
      <p className="text-green-600 font-medium mb-4">
        {copy.subtitle}
      </p>
      
      {digitalId.isActive && (
        <p className="text-gray-600 mb-2">
          {copy.description} {new Date(digitalId.expiryDate).toLocaleDateString()}
        </p>
      )}
    </motion.div>

    {/* Tips */}
    <div className="space-y-3 mb-8">
      {copy.tips?.map((tip, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-green-800 text-sm">{tip}</span>
        </motion.div>
      ))}
    </div>

    {/* Action Buttons */}
    <div className="space-y-3">
      <Button
        size="lg"
        onClick={onComplete}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 text-lg"
      >
        {copy.cta}
        <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
      
      <button
        onClick={() => {/* Open settings */}}
        className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm font-medium transition-colors"
      >
        {copy.settingsCta}
      </button>
    </div>
  </motion.div>
);

export default TouristOnboarding;