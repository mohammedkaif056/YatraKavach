import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ar' | 'hi';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  formatDateTime: (date: Date) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  t: (key: string, params?: Record<string, string>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// Basic translations (in a real app, these would be loaded from JSON files)
const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: 'Welcome to Police Command Center',
    alerts: 'Alerts',
    dashboard: 'Dashboard',
    tourists: 'Tourists',
    analytics: 'Analytics',
    createIncident: 'Create Incident',
    settings: 'Settings',
    logout: 'Log Out',
    profile: 'Profile',
    incidents: 'Incidents',
    emergency: 'Emergency',
  },
  es: {
    welcome: 'Bienvenido al Centro de Comando Policial',
    alerts: 'Alertas',
    dashboard: 'Panel de Control',
    tourists: 'Turistas',
    analytics: 'Análisis',
    createIncident: 'Crear Incidente',
    settings: 'Configuración',
    logout: 'Cerrar Sesión',
    profile: 'Perfil',
    incidents: 'Incidentes',
    emergency: 'Emergencia',
  },
  fr: {
    welcome: 'Bienvenue au Centre de Commandement de Police',
    alerts: 'Alertes',
    dashboard: 'Tableau de Bord',
    tourists: 'Touristes',
    analytics: 'Analytique',
    createIncident: 'Créer un Incident',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    profile: 'Profil',
    incidents: 'Incidents',
    emergency: 'Urgence',
  },
  de: {
    welcome: 'Willkommen im Polizei-Kommandozentrum',
    alerts: 'Warnungen',
    dashboard: 'Dashboard',
    tourists: 'Touristen',
    analytics: 'Analyse',
    createIncident: 'Vorfall erstellen',
    settings: 'Einstellungen',
    logout: 'Abmelden',
    profile: 'Profil',
    incidents: 'Vorfälle',
    emergency: 'Notfall',
  },
  zh: {
    welcome: '欢迎来到警察指挥中心',
    alerts: '警报',
    dashboard: '仪表板',
    tourists: '游客',
    analytics: '分析',
    createIncident: '创建事件',
    settings: '设置',
    logout: '登出',
    profile: '个人资料',
    incidents: '事件',
    emergency: '紧急情况',
  },
  ja: {
    welcome: '警察指令センターへようこそ',
    alerts: 'アラート',
    dashboard: 'ダッシュボード',
    tourists: '観光客',
    analytics: '分析',
    createIncident: 'インシデント作成',
    settings: '設定',
    logout: 'ログアウト',
    profile: 'プロフィール',
    incidents: 'インシデント',
    emergency: '緊急',
  },
  ar: {
    welcome: 'مرحبا بكم في مركز قيادة الشرطة',
    alerts: 'تنبيهات',
    dashboard: 'لوحة القيادة',
    tourists: 'السياح',
    analytics: 'التحليلات',
    createIncident: 'إنشاء حادث',
    settings: 'إعدادات',
    logout: 'تسجيل خروج',
    profile: 'الملف الشخصي',
    incidents: 'الحوادث',
    emergency: 'طارئ',
  },
  hi: {
    welcome: 'पुलिस कमांड सेंटर में आपका स्वागत है',
    alerts: 'अलर्ट',
    dashboard: 'डैशबोर्ड',
    tourists: 'पर्यटक',
    analytics: 'विश्लेषण',
    createIncident: 'घटना बनाएँ',
    settings: 'सेटिंग्स',
    logout: 'लॉगआउट',
    profile: 'प्रोफाइल',
    incidents: 'घटनाएँ',
    emergency: 'आपातकाल',
  },
};

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load language preference from localStorage or use browser language
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      return savedLanguage;
    }
    
    // Try to use browser language
    const browserLang = navigator.language.split('-')[0] as Language;
    if (Object.keys(translations).includes(browserLang)) {
      return browserLang;
    }
    
    // Default to English
    return 'en';
  });
  
  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update document language for accessibility
    document.documentElement.lang = language;
  }, [language]);
  
  // Simple translation function
  const t = (key: string, params?: Record<string, string>): string => {
    const translation = translations[language][key] || translations.en[key] || key;
    
    if (!params) {
      return translation;
    }
    
    // Replace parameters in the format {{paramName}}
    return Object.entries(params).reduce(
      (result, [param, value]) => result.replace(new RegExp(`{{${param}}}`, 'g'), value),
      translation
    );
  };
  
  // Formatting functions using the Intl API
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(language, { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };
  
  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat(language, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }).format(date);
  };
  
  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat(language, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  const formatCurrency = (amount: number, currency = 'USD'): string => {
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency
    }).format(amount);
  };
  
  const value = {
    language,
    setLanguage,
    formatDate,
    formatTime,
    formatDateTime,
    formatCurrency,
    t,
  };
  
  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};