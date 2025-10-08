'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';

import { NavigationProps } from '@/types';
import { NAV_ITEMS, ANIMATION_CONFIG } from '@/constants';
import { scrollToSection, debounce, cn } from '@/utils';
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

export default function Navigation({ className, concerts, isLoading }: NavigationWithConcertsProps) {
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Debounced scroll handler for better performance
  const handleScroll = useCallback(() => {
    const debouncedFn = debounce(() => {
      setIsCollapsed(window.scrollY > 100);
    }, 10);
    return debouncedFn();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleNavClick = useCallback((href: string) => {
    scrollToSection(href);
  }, []);

  // Determine if nav should show expanded (either not collapsed or being hovered)
  const showExpanded = !isCollapsed || isHovered;


  return (
    <>
      {/* Main Navigation - Hidden */}
      <motion.nav
        className={cn('fixed left-8 top-12 z-[60] flex flex-col hidden', isCollapsed ? 'p-12' : '', className)}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: ANIMATION_CONFIG.defaultDuration,
          ease: ANIMATION_CONFIG.defaultEase
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className={cn(
          'flex flex-col transition-all duration-500',
          'gap-3'
        )}>
          {NAV_ITEMS.map((item) => (
            <motion.button
              key={item.href}
              onClick={() => handleNavClick(item.href)}
              className={cn(
                item.color,
                'transition-all duration-500 font-semibold text-sm lowercase tracking-wide',
                'hover:translate-x-2 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50',
                'rounded-full',
                showExpanded
                  ? 'px-8 py-1 text-white min-w-[100px] h-6'
                  : 'w-6 h-6 text-[0px] min-w-0'
              )}
              whileHover={{
                scale: showExpanded ? 1.05 : 1.2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Navigate to ${item.label} section`}
            >
              <span className={cn(!showExpanded && 'sr-only')}>
                {t.nav[item.label as keyof typeof t.nav]}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.nav>

      {/* Upcoming Concerts Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[50] bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="w-full py-0.5 md:py-1">
          {/* Clean scrolling carousel container - full width */}
          <div className="w-full overflow-hidden">
            <div className="animate-scroll flex items-center whitespace-nowrap" style={{ gap: 'clamp(1.5rem, 3vw, 4rem)' }}>
              {/* Concert titles scrolling */}
              {isLoading ? (
                <div className="flex gap-4 md:gap-8">
                  <div className="h-4 md:h-6 w-32 md:w-40 bg-white/20 rounded animate-pulse"></div>
                  <div className="h-4 md:h-6 w-24 md:w-32 bg-white/20 rounded animate-pulse"></div>
                </div>
              ) : concerts.length > 0 ? (
                (() => {
                  // Adaptive repetition system
                  const displayConcerts = concerts.slice(0, 3); // Max 3 unique titles

                  // Calculate repetition count based on number of concerts
                  let repetitionCount;
                  if (displayConcerts.length === 1) {
                    repetitionCount = 12; // Single title needs many repetitions to fill space
                  } else if (displayConcerts.length === 2) {
                    repetitionCount = 8;  // Two titles need moderate repetitions
                  } else {
                    repetitionCount = 5;  // Three+ titles use fewer repetitions
                  }

                  // Helper function to format date as "MM/DD"
                  const formatDate = (dateStr: string) => {
                    const date = new Date(dateStr);
                    const month = date.getMonth() + 1;
                    const day = date.getDate();
                    return `${month}/${day}`;
                  };

                  return (
                    <>
                      {/* Create adaptive flat array with dots between titles */}
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
                // Fallback when no upcoming concerts
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