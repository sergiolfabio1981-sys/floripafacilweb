
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations } from '../services/translations';

type Language = 'es' | 'pt' | 'en';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = translations[language];
    
    for (const key of keys) {
      if (value && value[key]) {
        value = value[key];
      } else {
        return path; // Fallback to key if not found
      }
    }
    
    return value as string;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
