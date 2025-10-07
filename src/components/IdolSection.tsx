'use client';

import { motion } from 'framer-motion';
import ParallaxSection from './ParallaxSection';

export default function IdolSection() {
  return (
    <div className="relative">
      {/* Fixed Parallax Background */}
      <ParallaxSection
        imageSrc="/assets/images/backgrounds/Crowd-background.jpg"
        imageAlt="Concert Crowd"
        speed={0.5}
        className="min-h-[200vh]"
      >
        {/* Scrolling White Content Sections */}
        <div className="relative">
          {/* First White Section */}
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              className="bg-white text-gray-900 px-16 py-20 max-w-3xl mx-8 shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-light mb-8 text-center">IDOL Journey</h2>
              <p className="text-xl leading-relaxed text-center">
                Making it to IDOL was a defining moment in Arvid's career, representing years of dedication and musical growth coming to fruition on Sweden's biggest stage.
              </p>
            </motion.div>
          </div>

          {/* Second White Section */}
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              className="bg-white text-gray-900 px-16 py-20 max-w-3xl mx-8 shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-light mb-8 text-center">The Experience</h2>
              <p className="text-xl leading-relaxed text-center">
                From audition rooms to national television, the journey challenged and shaped Arvid as an artist, connecting him with audiences across Sweden.
              </p>
            </motion.div>
          </div>
        </div>
      </ParallaxSection>
    </div>
  );
}