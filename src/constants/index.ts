import { ConcertImage, NavItem } from '@/types';

export const CONCERT_IMAGES: ConcertImage[] = [
  {
    src: '/assets/images/concerts/recent/Examenskonsert-2025.jpg',
    alt: 'Examenskonsert 2025',
    title: 'Examenskonsert',
    location: 'Lund',
    year: '2025'
  },
  {
    src: '/assets/images/concerts/recent/Hässlehomfestivalen-2022.jpg',
    alt: 'Hässleholmsfestivalen 2022',
    title: 'Hässleholmsfestivalen',
    location: 'Hässleholm',
    year: '2022'
  },
  {
    src: '/assets/images/concerts/recent/Himlakull-Kaffe-2025.jpg',
    alt: 'Himlakull Kaffe 2025',
    title: 'Himlakull Kaffe',
    location: 'Himlakull',
    year: '2025'
  },
  {
    src: '/assets/images/concerts/recent/Idol-Kvalfinal-2022.jpg',
    alt: 'Idol Kvalfinal 2022',
    title: 'Idol Kvalfinal',
    location: 'TV4',
    year: '2022'
  },
  {
    src: '/assets/images/concerts/recent/Lunds-Nation-NSA-2025.jpg',
    alt: 'Lunds Nation NSA 2025',
    title: 'Lunds Nation NSA',
    location: 'Lunds Nation',
    year: '2025'
  },
  {
    src: '/assets/images/concerts/recent/Mejeriet-Lund-2024.jpg',
    alt: 'Mejeriet Lund 2024',
    title: 'Mejeriet Lund',
    location: 'Mejeriet, Lund',
    year: '2024'
  },
  {
    src: '/assets/images/concerts/recent/Penthouse.Lunds-Nation-Valborg-2023.jpg',
    alt: 'Penthouse Lunds Nation Valborg 2023',
    title: 'Penthouse Lunds Nation Valborg',
    location: 'Lunds Nation',
    year: '2023'
  },
  {
    src: '/assets/images/concerts/recent/Torsjö-Live-2024.jpg',
    alt: 'Torsjö Live 2024',
    title: 'Torsjö Live',
    location: 'Torsjö',
    year: '2024'
  },
  {
    src: '/assets/images/concerts/recent/Torsjö-Live-2025.jpg',
    alt: 'Torsjö Live 2025',
    title: 'Torsjö Live',
    location: 'Torsjö',
    year: '2025'
  }
];

export const NAV_ITEMS: NavItem[] = [
  { href: '#home', label: 'home', color: 'bg-gray-800' },
  { href: '#about', label: 'about', color: 'bg-orange-500' },
  { href: '#concerts', label: 'concerts', color: 'bg-blue-600' },
  { href: '#contact', label: 'contact', color: 'bg-gray-200 text-gray-900' },
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

// Upcoming concerts data
export const UPCOMING_CONCERTS = [
  {
    id: 'spring-concert-2025',
    title: 'Spring Concert 2025',
    venue: 'Stockholm Konserthus',
    date: 'March 15, 2025',
    time: '7:30 PM',
    description: 'An evening of contemporary Nordic compositions featuring new works and traditional folk arrangements. Experience the beauty of Scandinavian musical heritage in one of Stockholm\'s most prestigious venues.',
    images: [
      '/assets/images/concerts/upcoming/spring-concert-2025-main.jpg',
      '/assets/images/concerts/upcoming/spring-concert-2025-venue.jpg',
      '/assets/images/concerts/upcoming/spring-concert-2025-rehearsal.jpg'
    ],
    ticketUrl: 'https://stockholmkonserthus.se/tickets',
    details: {
      price: '350-650 SEK',
      duration: '2 hours (including intermission)',
      genre: 'Contemporary Nordic, Folk'
    }
  },
  {
    id: 'summer-festival-2025',
    title: 'Summer Festival',
    venue: 'Gothenburg Music Festival',
    date: 'June 8, 2025',
    time: '6:00 PM',
    description: 'Join us for an outdoor performance celebrating Scandinavian musical heritage under the midnight sun. This special festival performance will feature both solo pieces and collaborations with local musicians.',
    images: [
      '/assets/images/concerts/upcoming/summer-festival-2025-main.jpg',
      '/assets/images/concerts/upcoming/summer-festival-2025-stage.jpg'
    ],
    ticketUrl: 'https://goteborgmusicfestival.se/tickets',
    details: {
      price: '280-450 SEK',
      duration: '90 minutes',
      genre: 'Folk, Traditional'
    }
  }
];