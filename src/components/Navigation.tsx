'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { NavigationProps } from '@/types';
import { NAV_ITEMS } from '@/constants';
import { scrollToSection, formatDate } from '@/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface Concert {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  description: string;
  images: string[];
  ticketUrl?: string;
  details?: {
    price?: string;
    duration?: string;
    genre?: string;
  };
}

interface NavigationWithConcertsProps extends NavigationProps {
  concerts: Concert[];
  isLoading: boolean;
  source: 'google-calendar' | 'cached' | 'fallback';
}

export default function Navigation({ concerts, isLoading }: NavigationWithConcertsProps) {
  const { t, language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'subscribing' | 'subscribed' | 'error'>('idle');

  const handleNavClick = (href: string) => {
    // If it's a page route (starts with /), don't prevent default - let Link handle it
    if (href.startsWith('/')) {
      setIsOpen(false);
      return;
    }
    // Otherwise, scroll to section
    scrollToSection(href);
    setIsOpen(false);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterStatus('subscribing');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      if (response.ok) {
        setNewsletterStatus('subscribed');
        setNewsletterEmail('');
        setTimeout(() => setNewsletterStatus('idle'), 3000);
      } else {
        setNewsletterStatus('error');
        setTimeout(() => setNewsletterStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <motion.button
        className="fixed top-8 left-4 sm:top-11 sm:left-8 z-[70] flex flex-col gap-1.5 p-2"
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        aria-label="Toggle menu"
      >
        <motion.div
          className="w-6 h-0.5 sm:w-8 bg-white shadow-lg"
          animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="w-6 h-0.5 sm:w-8 bg-white shadow-lg"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="w-6 h-0.5 sm:w-8 bg-white shadow-lg"
          animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      {/* Sidebar Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-[65]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 left-0 h-full w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-md bg-gray-900 z-[66] flex flex-col overflow-hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 md:p-12">
                {/* Scrollable Content Wrapper */}
              {/* Top Section - Navigation and Concert Card */}
              <div className="flex-1 flex flex-col justify-between pt-12 sm:pt-8 pb-4 sm:pb-8 gap-6 sm:gap-8">
                {/* Navigation Items */}
                <div className="flex flex-col gap-4 sm:gap-6">
                  {NAV_ITEMS.map((item, index) => {
                    const isPageRoute = item.href.startsWith('/');

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {isPageRoute ? (
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-left hover:text-gray-300 transition-colors uppercase block"
                          >
                            {t.nav[item.label as keyof typeof t.nav]}
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleNavClick(item.href)}
                            className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-left hover:text-gray-300 transition-colors uppercase block"
                          >
                            {t.nav[item.label as keyof typeof t.nav]}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Upcoming Concert Card */}
                {concerts.length > 0 && (
                  <motion.div
                    className="p-4 sm:p-6 bg-white/10 rounded-lg border border-white/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Upcoming Concert</p>
                    <h3 className="text-white text-lg sm:text-xl font-bold mb-1">{concerts[0].title}</h3>
                    <p className="text-white/80 text-sm">{concerts[0].venue}</p>
                    <p className="text-white/60 text-xs sm:text-sm mt-1">{formatDate(concerts[0].date)} • {concerts[0].time}</p>
                    {concerts[0].ticketUrl && (
                      <a
                        href={concerts[0].ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 sm:mt-4 px-4 py-2 bg-white text-gray-900 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Get Tickets
                      </a>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Newsletter and Language Section - Fixed at bottom */}
              <motion.div
                className="pt-4 sm:pt-6 md:pt-8 border-t border-white/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* Newsletter Signup */}
                <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-white/20">
                  <p className="text-white/60 text-xs sm:text-sm mb-2 sm:mb-3">{t.contact.newsletter.heading}</p>
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all text-xs sm:text-sm placeholder-white/40"
                      placeholder={t.contact.newsletter.placeholder}
                    />
                    <motion.button
                      type="submit"
                      disabled={newsletterStatus === 'subscribing' || newsletterStatus === 'subscribed'}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-xs sm:text-sm ${
                        newsletterStatus === 'subscribed'
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-900 hover:bg-gray-100'
                      }`}
                      whileHover={{ scale: newsletterStatus === 'idle' ? 1.02 : 1 }}
                      whileTap={{ scale: newsletterStatus === 'idle' ? 0.98 : 1 }}
                    >
                      {newsletterStatus === 'idle' && t.contact.newsletter.subscribe}
                      {newsletterStatus === 'subscribing' && t.contact.newsletter.subscribing}
                      {newsletterStatus === 'subscribed' && t.contact.newsletter.subscribed}
                      {newsletterStatus === 'error' && t.contact.newsletter.error}
                    </motion.button>
                  </form>
                </div>

                <p className="text-white/60 text-xs sm:text-sm mb-3 sm:mb-4">Language</p>
                <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`text-base sm:text-lg font-semibold transition-colors ${
                      language === 'en' ? 'text-white' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    EN
                  </button>
                  <span className="text-white/20">|</span>
                  <button
                    onClick={() => setLanguage('sv')}
                    className={`text-base sm:text-lg font-semibold transition-colors ${
                      language === 'sv' ? 'text-white' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    SV
                  </button>
                </div>

                {/* Developer Credit */}
                <a
                  href="mailto:malte.binz@gmail.com"
                  className="block text-white/40 text-[10px] sm:text-xs hover:text-white/60 transition-colors underline"
                >
                  A website by Malte Binz
                </a>
              </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upcoming Concerts Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[50] bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="w-full py-0.5 md:py-1">
          <div className="w-full overflow-hidden">
            <div className="animate-scroll flex items-center whitespace-nowrap" style={{ gap: 'clamp(1.5rem, 3vw, 4rem)' }}>
              {isLoading ? (
                <div className="flex gap-4 md:gap-8">
                  <div className="h-4 md:h-6 w-32 md:w-40 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-4 md:h-6 w-24 md:w-32 bg-white/20 rounded animate-pulse"></div>
                </div>
              ) : concerts.length > 0 ? (
                (() => {
                  const displayConcerts = concerts.slice(0, 3);
                  let repetitionCount;
                  if (displayConcerts.length === 1) {
                    repetitionCount = 12;
                  } else if (displayConcerts.length === 2) {
                    repetitionCount = 8;
                  } else {
                    repetitionCount = 5;
                  }

                  return (
                    <>
                      {Array.from({ length: repetitionCount }, (_, setIndex) =>
                        displayConcerts.flatMap((concert, concertIndex) => [
                          concert.ticketUrl ? (
                            <motion.a
                              key={`${concert.id}-${setIndex + 1}-${concertIndex}`}
                              href={concert.ticketUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white hover:text-orange-300 transition-colors duration-200 text-sm md:text-lg font-medium cursor-pointer"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {formatDate(concert.date)} - {concert.title}
                            </motion.a>
                          ) : (
                            <motion.span
                              key={`${concert.id}-${setIndex + 1}-${concertIndex}`}
                              className="text-white/90 text-sm md:text-lg font-medium"
                            >
                              {formatDate(concert.date)} - {concert.title}
                            </motion.span>
                          ),
                          <div
                            key={`dot-${concert.id}-${setIndex + 1}-${concertIndex}`}
                            className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full flex-shrink-0"
                          ></div>
                        ])
                      ).flat()}
                    </>
                  );
                })()
              ) : (
                <>
                  {Array.from({ length: 8 }, (_, index) => [
                    <motion.a
                      key={`stay-tuned-${index}`}
                      href="https://www.youtube.com/watch?v=xvFZjo5PgG0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/90 hover:text-orange-300 transition-colors duration-200 text-sm md:text-lg font-medium cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t.concerts.stayTuned}
                    </motion.a>,
                    <div key={`dot1-${index}`} className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full flex-shrink-0"></div>,
                    <span key={`coming-soon-${index}`} className="text-white/90 text-sm md:text-lg font-medium">{t.concerts.comingSoon}</span>,
                    <div key={`dot2-${index}`} className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                  ]).flat()}
                </>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-25%); }
          }
          .animate-scroll {
            animation: scroll 40s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </motion.div>
    </>
  );
}
