export type Language = 'en' | 'sv';

export interface Translations {
  nav: {
    home: string;
    about: string;
    concerts: string;
    contact: string;
  };
  hero: {
    title: string;
  };
  about: {
    heading: string;
    childOfMusic: string;
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    watchButton: string;
  };
  concerts: {
    title: string;
    readMore: string;
    upcomingConcerts: string;
    pastConcerts: string;
    stayTuned: string;
    comingSoon: string;
    venue: string;
    date: string;
    time: string;
    tickets: string;
    getTickets: string;
    details: {
      price: string;
      duration: string;
      genre: string;
    };
  };
  contact: {
    heading: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    sent: string;
    error: string;
    copyright: string;
    newsletter: {
      heading: string;
      description: string;
      placeholder: string;
      subscribe: string;
      subscribing: string;
      subscribed: string;
      error: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: 'home',
      about: 'about',
      concerts: 'concerts',
      contact: 'contact',
    },
    hero: {
      title: 'ARVID EINARSSON',
    },
    about: {
      heading: "I'm Arvid,",
      childOfMusic: 'A Child of Music',
      paragraph1: "originally from Hässleholm. Growing up, I never had a proper outlet for my energy until I discovered music in my early teenage years. Together with four friends, I formed the boyband 2Friends, and we began performing for increasingly larger audiences across Sweden. I later competed on Idol as a solo artist, advancing to the quarterfinals.",
      paragraph2: "My inspiration comes from artists like Timbuktu and Tommy Körberg, whose artistry and storytelling have shaped my approach to music. I recently released a YouTube video highlighting my biggest musical influences.",
      paragraph3: "Now I'm taking the next step in my career—relocating to Stockholm to focus entirely on my own music. This is where my journey truly begins.",
      watchButton: 'Watch: Ett Barn av Musik',
    },
    concerts: {
      title: 'concerts',
      readMore: 'Read More',
      upcomingConcerts: 'Upcoming Concerts',
      pastConcerts: 'Past Concerts',
      stayTuned: 'Stay Tuned',
      comingSoon: 'Concerts Coming Soon',
      venue: 'Venue',
      date: 'Date',
      time: 'Time',
      tickets: 'Tickets',
      getTickets: 'Get Tickets',
      details: {
        price: 'Price',
        duration: 'Duration',
        genre: 'Genre',
      },
    },
    contact: {
      heading: 'Want to contact me?',
      email: 'Email Address',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      sent: 'Message Sent!',
      error: 'Try Again',
      copyright: 'All rights reserved.',
      newsletter: {
        heading: 'Want to get pinged?',
        description: 'Subscribe to get notified about new concerts and releases',
        placeholder: 'Your email',
        subscribe: 'Never miss a concert',
        subscribing: 'Subscribing...',
        subscribed: 'Subscribed!',
        error: 'Try Again',
      },
    },
  },
  sv: {
    nav: {
      home: 'hem',
      about: 'om',
      concerts: 'konserter',
      contact: 'kontakt',
    },
    hero: {
      title: 'ARVID EINARSSON',
    },
    about: {
      heading: 'Jag är Arvid,',
      childOfMusic: 'Ett Barn av Musik',
      paragraph1: 'ursprungligen från Hässleholm. När jag växte upp hade jag aldrig ett riktigt utlopp för min energi förrän jag upptäckte musiken i mina tidiga tonår. Tillsammans med fyra vänner bildade jag boybandet 2Friends, och vi började uppträda för allt större publik över hela Sverige. Senare tävlade jag i Idol som soloartist och nådde kvartsfinal.',
      paragraph2: 'Min inspiration kommer från artister som Timbuktu och Tommy Körberg, vars konstnärskap och berättande har format mitt förhållningssätt till musik. Jag släppte nyligen en YouTube-video som lyfter fram mina största musikaliska influenser.',
      paragraph3: 'Nu tar jag nästa steg i min karriär—jag flyttar till Stockholm för att fokusera helt på min egen musik. Det är här min resa verkligen börjar.',
      watchButton: 'Titta: Ett Barn av Musik',
    },
    concerts: {
      title: 'konserter',
      readMore: 'Läs Mer',
      upcomingConcerts: 'Kommande Konserter',
      pastConcerts: 'Tidigare Konserter',
      stayTuned: 'Håll Utkik',
      comingSoon: 'Konserter Kommer Snart',
      venue: 'Plats',
      date: 'Datum',
      time: 'Tid',
      tickets: 'Biljetter',
      getTickets: 'Köp Biljetter',
      details: {
        price: 'Pris',
        duration: 'Längd',
        genre: 'Genre',
      },
    },
    contact: {
      heading: 'Vill du kontakta mig?',
      email: 'E-postadress',
      message: 'Meddelande',
      send: 'Skicka Meddelande',
      sending: 'Skickar...',
      sent: 'Meddelande Skickat!',
      error: 'Försök Igen',
      copyright: 'Alla rättigheter förbehållna.',
      newsletter: {
        heading: 'Vill du bli pingad?',
        description: 'Prenumerera för att få notiser om nya konserter och släpp',
        placeholder: 'Din e-post',
        subscribe: 'Missa aldrig en konsert',
        subscribing: 'Prenumererar...',
        subscribed: 'Prenumererad!',
        error: 'Försök Igen',
      },
    },
  },
};

export function getTranslations(language: Language): Translations {
  return translations[language];
}
