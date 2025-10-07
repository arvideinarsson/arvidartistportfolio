// Core data types
export interface ConcertImage {
  src: string;
  alt: string;
  title: string;
  location: string;
  year: string;
}

// Navigation types
export interface NavItem {
  href: string;
  label: string;
  color: string;
}

// Component prop types
export interface ScrollCarouselProps {
  images: ConcertImage[];
}

export interface NavigationProps {
  className?: string;
}

export interface HeroProps {
  className?: string;
}

export interface AboutProps {
  className?: string;
}

export interface ContactProps {
  className?: string;
}

// Animation types
export interface AnimationVariants {
  hidden: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
  };
  visible: {
    opacity: number;
    y?: number;
    x?: number;
    scale?: number;
    transition?: {
      duration?: number;
      delay?: number;
      ease?: string;
    };
  };
}

// SEO types
export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
}