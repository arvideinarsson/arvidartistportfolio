import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to combine class names with proper handling of conditionals
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Smooth scroll to a section by ID
 */
export function scrollToSection(sectionId: string): void {
  const element = document.querySelector(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

/**
 * Check if an element is in viewport
 */
export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Format image path for Next.js optimization
 */
export function formatImagePath(src: string): string {
  // Ensure the path starts with / for Next.js static assets
  return src.startsWith('/') ? src : `/${src}`;
}

/**
 * Get responsive image sizes string for Next.js Image component
 */
export function getImageSizes(maxWidth: number = 800): string {
  return `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, ${maxWidth}px`;
}