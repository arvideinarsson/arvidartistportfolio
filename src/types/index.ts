// Navigation types
export interface NavItem {
  href: string;
  label: string;
}

// Component prop types
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

// SEO types
export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
}