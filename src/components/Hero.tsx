'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import TextPressure from './TextPressure';

export default function Hero() {
  const [translateY, setTranslateY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress
      const scrollProgress = (viewportHeight - sectionRect.top) / (viewportHeight + sectionRect.height);

      // Apply parallax transform
      const parallaxOffset = (scrollProgress - 0.5) * sectionRect.height * 0.5;

      setTranslateY(parallaxOffset);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Hero Image with Parallax - Locked position at 75% */}
      <div
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <Image
          src="/assets/images/hero/heropage.jpg"
          alt="Arvid Einarsson Hero"
          fill
          className="object-cover"
          style={{ objectPosition: '50% 75%' }}
          priority
          quality={100}
          unoptimized
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto w-full h-screen flex flex-col items-center justify-center">
          {/* Main Title - Centered */}
          <div className="text-center w-full">
            <TextPressure
              text="ARVID EINARSSON"
              fontFamily="Compressa VF"
              fontUrl="https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2"
              width={true}
              weight={true}
              italic={false}
              alpha={false}
              flex={true}
              stroke={false}
              scale={false}
              textColor="#FFFFFF"
              strokeColor="#27D3F5"
              minFontSize={150}
              className="font-bold tracking-tight"
            />
          </div>
        </div>
      </div>
    </div>
  );
}