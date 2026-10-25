import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Language } from '../localization/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);
const LANGUAGE_KEY = '@dg_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLangState] = useState<Language>('en');

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY)
      .then(saved => {
        if (saved === 'en' || saved === 'rw') {
          setLangState(saved);
        }
      })
      .catch(() => {});
  }, []);

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    AsyncStorage.setItem(LANGUAGE_KEY, lang).catch(() => {});
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'rw' : 'en';
    setLanguage(next);
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
