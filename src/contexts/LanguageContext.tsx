'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations, getTranslations } from '@/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [t, setT] = useState<Translations>(getTranslations('en'));

  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem('language') as Language | null;
    if (saved && (saved === 'en' || saved === 'sv')) {
      setLanguageState(saved);
      setT(getTranslations(saved));
      return;
    }

    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    const detectedLang: Language = browserLang.startsWith('sv') ? 'sv' : 'en';
    setLanguageState(detectedLang);
    setT(getTranslations(detectedLang));
    localStorage.setItem('language', detectedLang);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setT(getTranslations(lang));
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
