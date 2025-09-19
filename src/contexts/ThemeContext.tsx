import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type FontSize = 'small' | 'medium' | 'large' | 'x-large';
type ReducedMotion = boolean;
type HighContrast = boolean;

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  reducedMotion: ReducedMotion;
  setReducedMotion: (reduced: ReducedMotion) => void;
  highContrast: HighContrast;
  setHighContrast: (contrast: HighContrast) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load settings from local storage or use defaults
  const [mode, setMode] = useState<ThemeMode>(
    () => (localStorage.getItem('theme-mode') as ThemeMode) || 'system'
  );
  const [fontSize, setFontSize] = useState<FontSize>(
    () => (localStorage.getItem('font-size') as FontSize) || 'medium'
  );
  const [reducedMotion, setReducedMotion] = useState<ReducedMotion>(
    () => localStorage.getItem('reduced-motion') === 'true'
  );
  const [highContrast, setHighContrast] = useState<HighContrast>(
    () => localStorage.getItem('high-contrast') === 'true'
  );
  
  // Track if current theme is dark (either explicitly or via system preference)
  const [isDark, setIsDark] = useState<boolean>(false);
  
  // Update localStorage when settings change
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);
  
  useEffect(() => {
    localStorage.setItem('font-size', fontSize);
  }, [fontSize]);
  
  useEffect(() => {
    localStorage.setItem('reduced-motion', String(reducedMotion));
  }, [reducedMotion]);
  
  useEffect(() => {
    localStorage.setItem('high-contrast', String(highContrast));
  }, [highContrast]);
  
  // Apply theme classes to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Handle system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = mode === 'dark' || (mode === 'system' && prefersDark);
    
    setIsDark(shouldBeDark);
    
    // Apply dark/light theme
    if (shouldBeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply font size
    root.dataset.fontSize = fontSize;
    
    // Apply reduced motion
    if (reducedMotion) {
      root.classList.add('motion-reduce');
    } else {
      root.classList.remove('motion-reduce');
    }
    
    // Apply high contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mode === 'system') {
        setIsDark(mediaQuery.matches);
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, fontSize, reducedMotion, highContrast]);
  
  const value = {
    mode,
    setMode,
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion,
    highContrast,
    setHighContrast,
    isDark,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};