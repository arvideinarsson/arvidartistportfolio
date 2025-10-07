'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import About from '@/components/About';
import Contact from '@/components/Contact';
import ClickSpark from '@/components/ClickSpark';
import ParallaxSection from '@/components/ParallaxSection';
import { useConcerts } from '@/hooks/useConcerts';

interface PastConcert {
  id: string;
  title: string;
  venue?: string;
  date?: string;
  time?: string;
  description: string;
  images: string[];
  imagePath?: string;
}

export default function Home() {
  const { concerts, isLoading, source } = useConcerts();
  const [pastConcerts, setPastConcerts] = useState<PastConcert[]>([]);

  useEffect(() => {
    async function fetchPastConcerts() {
      try {
        const response = await fetch('/api/concerts/past');
        if (response.ok) {
          const data = await response.json();
          setPastConcerts(data.concerts || []);
        }
      } catch (error) {
        console.error('Failed to fetch past concerts:', error);
      }
    }

    fetchPastConcerts();
  }, []);

  // Static past concerts (newest to oldest) - fallback and filler
  const staticConcerts = [
    { id: 'static-himlakull-2025', title: 'Himlakull Kaffé 2025', imagePath: '/assets/images/concerts/recent/himlakull.jpg' },
    { id: 'static-torsjo-2025', title: 'Torsjö Live 2025', imagePath: '/assets/images/concerts/recent/torsjölive-2025.jpg' },
    { id: 'static-nsa-2025', title: 'NSA 2025', imagePath: '/assets/images/concerts/recent/Lunds-Nation-NSA-2025.jpg' },
    { id: 'static-exam-2025', title: 'Examenskonsert 2025', imagePath: '/assets/images/concerts/recent/Examenskonsert-2025.jpg' },
    { id: 'static-torsjo-2024', title: 'Torsjö Live 2024', imagePath: '/assets/images/concerts/recent/Torsjö-Live-2024.jpg' },
    { id: 'static-mejeriet-2024', title: 'Mejeriet Lund 2024', imagePath: '/assets/images/concerts/recent/Mejeriet-Lund-2024.jpg' }
  ];

  // Merge API concerts with static concerts to always show 4 concerts
  const displayConcerts = (() => {
    const apiConcertsList = pastConcerts.slice(0, 4).map(concert => ({
      id: concert.id,
      title: concert.title,
      imagePath: concert.images && concert.images.length > 0 ? concert.images[0] : concert.imagePath,
      isFromAPI: true
    }));

    // If we have fewer than 4 API concerts, fill with static concerts
    const needed = 4 - apiConcertsList.length;
    if (needed > 0) {
      const staticFiller = staticConcerts.slice(0, needed).map(concert => ({
        ...concert,
        isFromAPI: false
      }));
      return [...apiConcertsList, ...staticFiller];
    }

    return apiConcertsList;
  })();

  return (
    <ClickSpark
      sparkColor="#FF8040"
      sparkSize={12}
      sparkRadius={20}
      sparkCount={6}
      duration={500}
      easing="ease-out"
      extraScale={1.2}
    >
      <main className="overflow-x-hidden">
        <Navigation
          concerts={concerts}
          isLoading={isLoading}
          source={source}
        />

        <section id="home" aria-label="Hero section">
          <Hero />
        </section>

        {/* A Child of Music */}
        <section className="flex items-center justify-center" style={{backgroundColor: '#b0bec5', minHeight: '50vh'}}>
          <About />
        </section>

        {/* First crowd background */}
        <ParallaxSection
          imageSrc="/assets/images/backgrounds/crowd-background2.jpg"
          imageAlt="Concert Crowd"
          speed={0.5}
          className="min-h-screen"
          fillScreen={true}
        >
        </ParallaxSection>

        {/* Past Concerts Section */}
        <section className="flex items-center justify-center relative z-20" style={{backgroundColor: '#78909c', minHeight: '60vh', marginTop: '-30vh', paddingBottom: '10vh'}}>
          <div className="w-full max-w-7xl mx-auto px-8 py-20">
            {/* Title */}
            <motion.h3
              className="text-2xl font-light text-white mb-8 uppercase tracking-wide text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              concerts
            </motion.h3>

            {/* Grid Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {displayConcerts.map((concert, index) => (
                <motion.div
                  key={concert.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg w-full">
                    {concert.imagePath ? (
                      <Image
                        src={concert.imagePath}
                        alt={concert.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        unoptimized={concert.imagePath.includes('drive.google.com')}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-800"></div>
                    )}
                  </div>
                  <p className="text-white text-sm font-medium mt-3 text-center">{concert.title}</p>
                </motion.div>
              ))}
            </div>

            {/* Read More Button */}
            <motion.div
              className="flex justify-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/concerts" className="px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 inline-block">
                Read More
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Second background image */}
        <ParallaxSection
          imageSrc="/assets/images/backgrounds/mic-background2.jpg"
          imageAlt="Microphone Background"
          speed={0.5}
          className="min-h-screen"
          fillScreen={true}
          objectFit="cover"
          grayscale={true}
        >
        </ParallaxSection>

        {/* About Arvid Section */}
        <section id="about" className="relative z-20" style={{ backgroundColor: '#1e3a5f', minHeight: '80vh', marginTop: '-30vh', paddingBottom: '0' }} aria-label="About Arvid Einarsson">
          <div className="max-w-7xl mx-auto py-20 pl-0 pr-8">
            <div className="grid grid-cols-12 gap-12 items-center">
              {/* Headshot Image - Left side, spans 5 columns */}
              <motion.div
                className="col-span-5 relative w-full aspect-square"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Image
                  src="/assets/images/about/Arvid-headshot.jpg"
                  alt="Arvid Einarsson"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 42vw"
                  quality={100}
                  priority
                  unoptimized
                />
              </motion.div>

              {/* About Text - Right Side */}
              <motion.div
                className="col-span-7 text-white"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-6">I&apos;m Arvid,</h2>
                <p className="text-lg leading-relaxed mb-4">
                  originally from Hässleholm. Growing up, I never had a proper outlet for my energy until I discovered music in my early teenage years. Together with four friends, I formed the boyband 2Friends, and we began performing for increasingly larger audiences across Sweden. I later competed on Idol as a solo artist, advancing to the quarterfinals.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  My inspiration comes from artists like Timbuktu and Tommy Körberg, whose artistry and storytelling have shaped my approach to music. I recently released a YouTube video highlighting my biggest musical influences.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Now I&apos;m taking the next step in my career—relocating to Stockholm to focus entirely on my own music. This is where my journey truly begins.
                </p>
                <motion.a
                  href="https://www.youtube.com/watch?v=PiFNukCY7Pw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch: Ett Barn av Musik
                </motion.a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ParallaxSection
          imageSrc="/assets/images/Contact/Contact-background.JPG"
          imageAlt="Contact Background"
          speed={0.5}
          className="relative flex items-center justify-center"
          style={{ minHeight: '60vh' }}
          overlay={true}
          grayscale={false}
        >
          <div id="contact" className="relative z-10 w-full" aria-label="Contact">
            <Contact />
          </div>
        </ParallaxSection>
      </main>
    </ClickSpark>
  );
}
