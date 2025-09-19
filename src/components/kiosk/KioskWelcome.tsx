import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Globe, ArrowRight, Smartphone, User, MapPin, Clock, CheckCircle2, Star } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', region: 'US' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', region: 'IN' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩', region: 'BD' },
  { code: 'as', name: 'অসমীয়া', flag: '🇮🇳', region: 'IN' },
  { code: 'ne', name: 'नेपाली', flag: '🇳🇵', region: 'NP' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', region: 'IN' }
];

// Enhanced Language Selector Component with Accessibility
const LanguageSelector: React.FC<{
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}> = ({ selectedLanguage, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  const handleLanguageChange = useCallback((code: string, name: string) => {
    onLanguageChange(code);
    setIsOpen(false);
    // Announce language change
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Language changed to ${name}`;
    document.body.appendChild(announcement);
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, [onLanguageChange]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  return (
    <div className="fixed top-6 left-6 z-50">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center space-x-3 shadow-lg hover:shadow-xl hover:bg-white/95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:bg-white"
          aria-label={`Current language: ${selectedLang.name}. Click to open language menu`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          id="language-selector"
        >
          <span className="text-lg" role="img" aria-label={`${selectedLang.region} flag`}>
            {selectedLang.flag}
          </span>
          <span className="font-medium text-gray-700">{selectedLang.name}</span>
          <Globe className="w-4 h-4 text-gray-500" aria-hidden="true" />
        </button>
        
        {isOpen && (
          <div 
            className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-w-48 animate-fadeIn"
            role="listbox"
            aria-labelledby="language-selector"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code, language.name)}
                className={`w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-blue-50 transition-colors focus:outline-none focus:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                  selectedLanguage === language.code ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                }`}
                role="option"
                aria-selected={selectedLanguage === language.code}
                tabIndex={isOpen ? 0 : -1}
              >
                <span className="text-lg" role="img" aria-label={`${language.region} flag`}>
                  {language.flag}
                </span>
                <span className="font-medium">{language.name}</span>
                {selectedLanguage === language.code && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600 ml-auto" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const KioskWelcome: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    // Announce page load for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Tourist Safety Registration Welcome Page. Complete your safety registration in 3 simple steps';
    document.body.appendChild(announcement);
    
    return () => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    };
  }, []);

  const handleContinue = useCallback(() => {
    // Store selected language in localStorage for persistence
    localStorage.setItem('selectedLanguage', selectedLanguage);
    
    // Announce navigation
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.className = 'sr-only';
    announcement.textContent = 'Proceeding to registration form';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
    
    navigate('/registration/register');
  }, [selectedLanguage, navigate]);

  const features = [
    {
      icon: Smartphone,
      title: 'Digital Safety ID',
      description: 'Blockchain-secured identity with instant emergency access',
      color: 'bg-blue-100 text-blue-600',
      delay: 'animate-slideInLeft'
    },
    {
      icon: MapPin,
      title: 'Real-time Monitoring',
      description: '24/7 location tracking with geo-fence safety alerts',
      color: 'bg-emerald-100 text-emerald-600',
      delay: 'animate-slideInLeft delay-100'
    },
    {
      icon: Shield,
      title: 'Emergency Response',
      description: 'Instant connection to local authorities and responders',
      color: 'bg-red-100 text-red-600',
      delay: 'animate-slideInLeft delay-200'
    },
    {
      icon: User,
      title: 'Cultural Guidance',
      description: 'Local customs, safety tips, and area recommendations',
      color: 'bg-purple-100 text-purple-600',
      delay: 'animate-slideInLeft delay-300'
    }
  ];

  const processSteps = [
    { step: 1, title: 'Document Verification', duration: '2 min' },
    { step: 2, title: 'Safety Briefing', duration: '3 min' },
    { step: 3, title: 'Digital ID Setup', duration: '2 min' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 relative overflow-hidden">
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white z-50"
      >
        Skip to main content
      </a>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
      </div>
      
      {/* Language Selector */}
      <LanguageSelector 
        selectedLanguage={selectedLanguage} 
        onLanguageChange={setSelectedLanguage} 
      />

      {/* Main Content Container */}
      <main id="main-content" className="relative z-10 min-h-screen flex items-center justify-center p-4 pt-20">
        <div className="max-w-7xl w-full">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            
            {/* Header Section - Compact and Accessible */}
            <header className="text-center mb-12">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-2xl inline-block mb-8 border border-white/20">
                <Shield className="w-16 h-16 text-white mx-auto" aria-hidden="true" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Welcome to
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Yaatri Kavach Registration
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Register your visit to Northeast India and get your digital safety companion. 
                Complete protection in just 3 simple steps.
              </p>
              
              {/* Quick Stats - Enhanced with ARIA labels */}
              <div className="flex justify-center items-center space-x-8 mb-6" role="list" aria-label="Registration details">
                <div className="flex items-center space-x-2 text-blue-200" role="listitem">
                  <Clock className="w-5 h-5" aria-hidden="true" />
                  <span className="text-sm font-medium">5-8 minutes</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-200" role="listitem">
                  <Star className="w-5 h-5 text-yellow-400" aria-hidden="true" />
                  <span className="text-sm font-medium">Free service</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-200" role="listitem">
                  <Shield className="w-5 h-5 text-emerald-400" aria-hidden="true" />
                  <span className="text-sm font-medium">Secure process</span>
                </div>
              </div>
              
              <p className="text-blue-200 text-sm">Government of India • Ministry of Tourism</p>
            </header>

            {/* Main Content - Side by Side Layout */}
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              
              {/* Left Panel - Features (Compact Cards) */}
              <section aria-labelledby="features-heading">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
                  <h2 id="features-heading" className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3" aria-hidden="true"></span>
                    What you'll get
                  </h2>
                  
                  <div className="grid gap-4" role="list">
                    {features.map((feature, index) => (
                      <div 
                        key={index}
                        className={`flex items-start space-x-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-white/70 transition-all duration-300 hover:shadow-md group ${feature.delay}`}
                        role="listitem"
                      >
                        <div className={`p-3 rounded-xl ${feature.color} group-hover:scale-110 transition-transform duration-300`} aria-hidden="true">
                          <feature.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Right Panel - Action Section */}
              <section aria-labelledby="registration-section">
                <div className="space-y-6">
                  
                  {/* Process Overview */}
                  <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
                    <h3 id="registration-section" className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                      <span className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full mr-3" aria-hidden="true"></span>
                      Registration Process
                    </h3>
                    
                    <ol className="space-y-4" role="list">
                      {processSteps.map((process) => (
                        <li key={process.step} className="flex items-center space-x-4 group">
                          <div 
                            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg group-hover:scale-110 transition-transform duration-300"
                            aria-hidden="true"
                          >
                            {process.step}
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium">{process.title}</span>
                          </div>
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {process.duration}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* CTA Section - Enhanced with accessibility */}
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl border border-white/20">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
                      <p className="text-blue-100 mb-8 text-sm leading-relaxed">
                        Join thousands of travelers who trust our digital safety platform. 
                        Your protection is our priority.
                      </p>
                      
                      <button
                        onClick={handleContinue}
                        className="w-full bg-white text-gray-800 py-4 px-8 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30 group"
                        aria-describedby="start-registration-description"
                      >
                        <span>Start Registration</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
                      </button>
                      
                      <p id="start-registration-description" className="sr-only">
                        Click to begin the 3-step tourist safety registration process
                      </p>
                      
                      <div className="flex justify-center items-center space-x-4 mt-6 text-blue-100 text-xs" role="list" aria-label="Security features">
                        <div className="flex items-center space-x-1" role="listitem">
                          <Shield className="w-4 h-4" aria-hidden="true" />
                          <span>Secure</span>
                        </div>
                        <div className="w-1 h-1 bg-blue-300 rounded-full" aria-hidden="true"></div>
                        <div className="flex items-center space-x-1" role="listitem">
                          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                          <span>Encrypted</span>
                        </div>
                        <div className="w-1 h-1 bg-blue-300 rounded-full" aria-hidden="true"></div>
                        <div className="flex items-center space-x-1" role="listitem">
                          <Star className="w-4 h-4" aria-hidden="true" />
                          <span>Trusted</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KioskWelcome;