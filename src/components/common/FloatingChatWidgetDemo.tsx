import React, { useState } from 'react';
import FloatingChatWidget from './FloatingChatWidget';

const languages = {
  en: { name: 'English', flag: '🇬🇧', nativeName: 'English' },
  hi: { name: 'हिंदी', flag: '🇮🇳', nativeName: 'हिंदी' },
  as: { name: 'অসমীয়া', flag: '🇮🇳', nativeName: 'অসমীয়া' },
  bn: { name: 'বাংলা', flag: '🇧🇩', nativeName: 'বাংলা' }
};

const FloatingChatWidgetDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Simulate new message after 10 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setHasNewMessage(true);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleFeatureClick = (feature: 'map' | 'sos' | 'stats' | 'id') => {
    console.log('Feature clicked:', feature);
    // Handle feature navigation here
  };

  const handleQRModalOpen = () => {
    console.log('QR Modal opened');
    // Handle QR modal opening here
  };

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    setHasNewMessage(false); // Clear notification when language changes
  };

  const handleChatToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false); // Clear notification when opening chat
    }
  };

  return (
    <FloatingChatWidget
      languages={languages}
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
      onChatToggle={handleChatToggle}
      onFeatureClick={handleFeatureClick}
      onQRModalOpen={handleQRModalOpen}
      isOpen={isOpen}
      hasNewMessage={hasNewMessage && !isOpen}
    />
  );
};

export default FloatingChatWidgetDemo;