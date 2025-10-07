'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ParallaxSectionProps {
  imageSrc: string;
  imageAlt: string;
  speed?: number; // Parallax speed multiplier (0.3 = slower, 0.7 = faster)
  children?: React.ReactNode;
  className?: string;
  imagePosition?: 'left' | 'right' | 'center';
  overlay?: boolean;
  overlayOpacity?: number;
  grayscale?: boolean; // Whether to apply grayscale filter
  objectFit?: 'cover' | 'contain'; // How the image should fit
  fillScreen?: boolean; // Add extra height for parallax movement
}

export default function ParallaxSection({
  imageSrc,
  imageAlt,
  speed = 0.5,
  children,
  className = '',
  imagePosition = 'center',
  overlay = false,
  overlayOpacity = 0.3,
  grayscale = true,
  objectFit = 'cover',
  fillScreen = false,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !imageRef.current) return;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate scroll progress relative to the section
      // Negative when section is below viewport, positive when above
      const scrollProgress = (viewportHeight - sectionRect.top) / (viewportHeight + sectionRect.height);

      // Apply parallax transform
      // The image moves slower than the scroll, creating depth
      const parallaxOffset = (scrollProgress - 0.5) * sectionRect.height * speed;

      setTranslateY(parallaxOffset);
    };

    // Initial calculation
    handleScroll();

    // Add scroll listener with passive flag for performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return (
    <div
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight: '100vh' }}
    >
      {/* Fixed parallax image container */}
      <div
        ref={imageRef}
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div className={`relative w-full h-full ${imagePosition === 'left' ? 'justify-start' : imagePosition === 'right' ? 'justify-end' : 'justify-center'} flex items-center justify-center`}>
          <div className={`relative w-full ${fillScreen ? 'h-[140%] -top-[20%]' : 'h-full'}`}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className={`object-${objectFit} ${grayscale ? 'grayscale' : ''}`}
              style={{ objectPosition: '50% 50%' }}
              sizes="100vw"
              priority
              quality={100}
              unoptimized
            />
          </div>
        </div>

        {/* Optional overlay */}
        {overlay && (
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        )}
      </div>

      {/* Content layer */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}
