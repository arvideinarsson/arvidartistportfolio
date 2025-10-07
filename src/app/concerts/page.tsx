'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Concert {
  id: string;
  title: string;
  venue?: string;
  date?: string;
  time?: string;
  description: string;
  images: string[];
  imagePath?: string;
  ticketUrl?: string;
  details?: {
    price?: string;
    duration?: string;
    genre?: string;
  };
}

export default function ConcertsPage() {
  const [apiConcerts, setApiConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Static past concerts (newest to oldest)
  const staticConcerts: Concert[] = [
    {
      id: 'himlakull-kaffe-2025',
      title: 'Himlakull Kaffé 2025',
      imagePath: '/assets/images/concerts/recent/himlakull.jpg',
      description: 'Cozy café performance creating an intimate atmosphere with acoustic arrangements.',
      images: []
    },
    {
      id: 'torsjo-live-2025',
      title: 'Torsjö Live 2025',
      imagePath: '/assets/images/concerts/recent/torsjölive-2025.jpg',
      description: 'A return to Torsjö with new material and deeper connection with the audience.',
      images: []
    },
    {
      id: 'nsa-2025',
      title: 'NSA 2025',
      imagePath: '/assets/images/concerts/recent/Lunds-Nation-NSA-2025.jpg',
      description: 'Performance at NSA showcasing contemporary musical arrangements.',
      images: []
    },
    {
      id: 'examenskonsert-2025',
      title: 'Examenskonsert 2025',
      imagePath: '/assets/images/concerts/recent/Examenskonsert-2025.jpg',
      description: 'Graduation concert marking the culmination of years of musical education and growth.',
      images: []
    },
    {
      id: 'torsjo-live-2024',
      title: 'Torsjö Live 2024',
      imagePath: '/assets/images/concerts/recent/Torsjö-Live-2024.jpg',
      description: 'An unforgettable evening in Torsjö with powerful performances.',
      images: []
    },
    {
      id: 'mejeriet-lund-2024',
      title: 'Mejeriet Lund 2024',
      imagePath: '/assets/images/concerts/recent/Mejeriet-Lund-2024.jpg',
      description: 'Live performance at Mejeriet, one of Lund\'s iconic music venues.',
      images: []
    },
    {
      id: 'penthouse-lunds-nation-2023',
      title: 'Penthouse Lunds Nation Valborg 2023',
      imagePath: '/assets/images/concerts/recent/Penthouse.Lunds-Nation-Valborg-2023.jpg',
      description: 'Rooftop performance at Penthouse with stunning views and atmosphere.',
      images: []
    },
    {
      id: 'torsjo-live-2023',
      title: 'Torsjö Live 2023',
      imagePath: '/assets/images/concerts/recent/Torsjö-Live-2023.jpg',
      description: 'First live performance in Torsjö, bringing music to the heart of the community.',
      images: []
    },
    {
      id: 'lundakarnevalen-2022',
      title: 'Lundakarnevalen 2022',
      imagePath: '/assets/images/concerts/recent/Lundakarnevalen-2022.jpg',
      description: 'Carnival performance at Lund\'s famous student carnival celebration.',
      images: []
    },
    {
      id: 'hassleholmsfestivalen-2022',
      title: 'Hässleholmsfestivalen 2022',
      imagePath: '/assets/images/concerts/recent/Hässlehomfestivalen-2022.jpg',
      description: 'Festival performance bringing energy and passion to the local music scene.',
      images: []
    },
    {
      id: 'jamboree-2022',
      title: 'Jamboree 2022',
      imagePath: '/assets/images/concerts/recent/Jamboree-2022.jpg',
      description: 'Energetic jamboree performance bringing together diverse musical influences.',
      images: []
    },
    {
      id: 'idol-kvalfinal-2022',
      title: 'Idol Kvalfinal 2022',
      imagePath: '/assets/images/concerts/recent/Idol-Kvalfinal-2022.jpg',
      description: 'Qualifying final performance for Swedish Idol 2022, showcasing raw talent and determination.',
      images: []
    }
  ];

  useEffect(() => {
    async function fetchPastConcerts() {
      try {
        const response = await fetch('/api/concerts/past');
        if (response.ok) {
          const data = await response.json();
          setApiConcerts(data.concerts || []);
        }
      } catch (error) {
        console.error('Failed to fetch past concerts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPastConcerts();
  }, []);

  // Merge API concerts with static concerts (API concerts first, but show static first concert while loading)
  const allConcerts = isLoading
    ? staticConcerts  // Show static concerts immediately while loading
    : [...apiConcerts, ...staticConcerts];

  return (
    <motion.main
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="bg-gray-900 text-white py-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link href="/" className="text-sm text-gray-400 hover:text-white mb-4 inline-block transition-colors">
              ← Back to Home
            </Link>
          </motion.div>
          <motion.h1
            className="text-6xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Concerts
          </motion.h1>
        </div>
      </motion.div>

      {/* Concerts Grid */}
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {allConcerts.map((concert, index) => {
            const imageUrl = concert.images && concert.images.length > 0
              ? concert.images[0]
              : concert.imagePath;

            // First concert (most recent) spans full width
            if (index === 0) {
              return (
                <motion.article
                  key={concert.id}
                  className="lg:col-span-3 flex flex-col"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {/* Large Hero Image */}
                  <div className="relative aspect-[21/9] bg-gray-800 mb-6">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={concert.title}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                        unoptimized={concert.images.length > 0}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="max-w-3xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      {concert.title}
                    </h2>
                    {concert.venue && concert.date && (
                      <p className="text-gray-500 text-sm mb-3">
                        {concert.venue} • {concert.date}
                      </p>
                    )}
                    <p className="text-gray-600 leading-relaxed">
                      {concert.description}
                    </p>
                  </div>
                </motion.article>
              );
            }

            // Regular grid items
            return (
              <motion.article
                key={concert.id}
                className="flex flex-col"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: ((index - 1) % 9) * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-gray-800 mb-4">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={concert.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      unoptimized={concert.images.length > 0}
                    />
                  )}
                </div>

                {/* Content */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {concert.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {concert.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </motion.main>
  );
}
