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
 * Format date as "MM/DD"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}