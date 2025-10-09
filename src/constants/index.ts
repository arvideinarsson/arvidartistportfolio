import { NavItem } from '@/types';

export const NAV_ITEMS: NavItem[] = [
  { href: '#home', label: 'home' },
  { href: '/concerts', label: 'concerts' },
  { href: '#about', label: 'about' },
  { href: '#contact', label: 'contact' },
];

// Contact information
export const CONTACT_INFO = {
  email: 'arvideinarssonartist@gmail.com',
  phone: '0733633089',
  facebook: {
    url: 'https://www.facebook.com/arvid.einarsson.5/',
    handle: 'arvid.einarsson.5'
  },
  instagram: {
    url: 'https://www.instagram.com/arvideinarsson/',
    handle: '@arvideinarsson'
  },
  youtube: {
    url: 'https://www.youtube.com/@ArvidEinarsson',
    handle: '@ArvidEinarsson'
  },
  tiktok: {
    url: 'https://l.instagram.com/?u=http%3A%2F%2Fwww.tiktok.com%2F%40aarvideinarsson%3Ffbclid%3DPAZXh0bgNhZW0CMTEAAafOXt6ZPvQojfDoqOxXlonSMO7e0sjqA3q-fv4WCkziJ6_qHMTu6crk1Foz0g_aem_4EhUjxpd_mkecPvNl-jOSg&e=AT2dhTBWWmUeCSyOvH-qlBA7bFI6vMbgfTt-buaWVUqc981lnYp_FyLoLbKnnTCMMsupMdAcc_HRgMcB2iNyxcOdSk4QpqgjggmruonjUw',
    handle: '@aarvideinarsson'
  },
  spotify: {
    url: 'https://open.spotify.com/artist/6Tin76aSr9x0VDdpcy8Ukf',
    handle: 'Arvid Einarsson'
  }
};

// SEO metadata
export const SEO_CONFIG = {
  title: 'Arvid Einarsson - Contemporary Nordic Artist',
  description: 'Contemporary Nordic artist exploring the intersection of traditional Scandinavian musical heritage and modern artistic expression.',
  keywords: 'Arvid Einarsson, Nordic artist, contemporary music, Swedish musician, Scandinavian heritage, piano, composition',
  url: 'https://arvideinarsson.com',
  ogImage: '/assets/images/hero/heropage.jpg'
};

// Animation configuration
export const ANIMATION_CONFIG = {
  staggerDelay: 0.1,
  defaultDuration: 0.6,
  defaultEase: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
};