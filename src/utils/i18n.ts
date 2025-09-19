import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Supported languages with their display names
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  bn: 'বাংলা (Bengali)',
  as: 'অসমীয়া (Assamese)',
  ne: 'नेपाली (Nepali)',
  ta: 'தமிழ் (Tamil)'
};

// Default translations for fallback
const DEFAULT_TRANSLATIONS = {
  welcome: 'Welcome',
  continue: 'Continue',
  back: 'Back',
  loading: 'Loading...',
  error: 'An error occurred',
  retry: 'Retry'
};

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
  languages: typeof SUPPORTED_LANGUAGES;
  direction: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  initialLanguage?: string;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
  children,
  initialLanguage
}) => {
  // Get language from storage, URL, or browser preference
  const [language, setLanguageState] = useState<string>(() => {
    // Check if language is set in storage
    const storedLanguage = localStorage.getItem('kioskLanguage');
    if (storedLanguage && Object.keys(SUPPORTED_LANGUAGES).includes(storedLanguage)) {
      return storedLanguage;
    }
    
    // Check for language in URL
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && Object.keys(SUPPORTED_LANGUAGES).includes(langParam)) {
      return langParam;
    }
    
    // Check for explicit initial language prop
    if (initialLanguage && Object.keys(SUPPORTED_LANGUAGES).includes(initialLanguage)) {
      return initialLanguage;
    }
    
    // Get browser language
    const browserLang = navigator.language.split('-')[0];
    if (Object.keys(SUPPORTED_LANGUAGES).includes(browserLang)) {
      return browserLang;
    }
    
    // Default to English
    return 'en';
  });
  
  // State for translations
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({
    en: DEFAULT_TRANSLATIONS
  });
  
  // Load translations for the selected language
  useEffect(() => {
    const loadTranslations = async () => {
      if (language === 'en' && translations.en) {
        // English is already loaded
        return;
      }
      
      try {
        // In a real app, this would fetch from API or static file
        // const response = await fetch(`/i18n/${language}.json`);
        // const data = await response.json();
        // setTranslations(prev => ({ ...prev, [language]: data }));
        
        // For this example, we'll use mock data
        const mockTranslations: Record<string, Record<string, string>> = {
          en: {
            welcome: 'Welcome to Tourist Safety Registration',
            language: 'Choose Your Language',
            continue: 'Continue',
            back: 'Back',
            register: 'Start Registration',
            loading: 'Loading...',
            error: 'An error occurred',
            retry: 'Retry'
          },
          hi: {
            welcome: 'पर्यटक सुरक्षा पंजीकरण में आपका स्वागत है',
            language: 'अपनी भाषा चुनें',
            continue: 'जारी रखें',
            back: 'वापस',
            register: 'पंजीकरण शुरू करें',
            loading: 'लोड हो रहा है...',
            error: 'कोई त्रुटि हुई',
            retry: 'पुन: प्रयास करें'
          },
          bn: {
            welcome: 'পর্যটক নিরাপত্তা নিবন্ধনে স্বাগতম',
            language: 'আপনার ভাষা নির্বাচন করুন',
            continue: 'অবিরত',
            back: 'পিছনে',
            register: 'নিবন্ধন শুরু করুন',
            loading: 'লোড হচ্ছে...',
            error: 'একটি ত্রুটি ঘটেছে',
            retry: 'পুনরায় চেষ্টা করুন'
          }
        };
        
        // Set translations for the current language
        if (mockTranslations[language]) {
          setTranslations(prev => ({ ...prev, [language]: mockTranslations[language] }));
        }
      } catch (error) {
        console.error(`Error loading translations for ${language}:`, error);
      }
    };
    
    loadTranslations();
  }, [language]);
  
  // Set language and store in localStorage
  const setLanguage = (lang: string) => {
    if (Object.keys(SUPPORTED_LANGUAGES).includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('kioskLanguage', lang);
      
      // Update document language attribute
      document.documentElement.lang = lang;
    } else {
      console.warn(`Attempted to set unsupported language: ${lang}`);
    }
  };
  
  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    // Get translation from current language
    let text = translations[language]?.[key];
    
    // Fallback to English
    if (!text && language !== 'en') {
      text = translations.en?.[key];
    }
    
    // Fallback to key
    if (!text) {
      console.warn(`Missing translation for key: ${key} in language ${language}`);
      return key;
    }
    
    // Replace params if provided
    if (params) {
      return Object.entries(params).reduce((result, [param, value]) => {
        return result.replace(new RegExp(`{{${param}}}`, 'g'), value);
      }, text);
    }
    
    return text;
  };
  
  // Determine text direction (RTL for Arabic, Hebrew, etc.)
  const direction: 'ltr' | 'rtl' = ['ar', 'he', 'ur', 'fa'].includes(language) ? 'rtl' : 'ltr';
  
  // Update document direction
  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);
  
  const contextValue: I18nContextType = {
    language,
    setLanguage,
    t,
    languages: SUPPORTED_LANGUAGES,
    direction
  };
  
  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  
  return context;
};