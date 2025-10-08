'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.div
      className="fixed top-24 left-8 z-[60] flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <button
        onClick={() => setLanguage('en')}
        className={`text-sm font-medium transition-all duration-200 ${
          language === 'en'
            ? 'text-white'
            : 'text-white/50 hover:text-white/75'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <div className="w-px h-4 bg-white/30"></div>
      <button
        onClick={() => setLanguage('sv')}
        className={`text-sm font-medium transition-all duration-200 ${
          language === 'sv'
            ? 'text-white'
            : 'text-white/50 hover:text-white/75'
        }`}
        aria-label="Byt till Svenska"
      >
        SV
      </button>
    </motion.div>
  );
}
