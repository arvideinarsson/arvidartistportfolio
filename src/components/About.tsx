'use client';

import ScrollVelocity from './ScrollVelocity';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ScrollVelocity
        texts={[`${t.about.childOfMusic} •`, `${t.about.childOfMusic} •`]}
        velocity={50}
        className="text-gray-900 uppercase"
      />
    </div>
  );
}