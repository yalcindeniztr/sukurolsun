import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from './translations';
import { storageService } from '../services/storage.service';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('tr');

  useEffect(() => {
    // Uygulama başladığında dili yükle
    const initLanguage = async () => {
      const savedProfile = await storageService.getProfile();
      if (savedProfile?.language) {
        setLanguageState(savedProfile.language as Language);
      } else {
        const storedLang = localStorage.getItem('app_language') as Language;
        if (storedLang) setLanguageState(storedLang);
      }
    };
    initLanguage();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let result: any = translations[language];
    
    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path; // Key bulunamazsa path'i döndür
      }
    }
    
    return typeof result === 'string' ? result : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
