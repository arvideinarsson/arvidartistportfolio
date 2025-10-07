# Arvid Einarsson - Artist Portfolio

A modern, responsive portfolio website for Swedish artist Arvid Einarsson, built with Next.js 15, React 19, TypeScript, and Framer Motion.

## ✨ Features

### 🎨 Design
- **Parallax scrolling** - Immersive background images with smooth parallax effects
- **Interactive typography** - TextPressure animation for hero title with mouse tracking
- **Scroll velocity text** - Animated scrolling text banner with "a child of music"
- **Click spark effects** - Interactive particle animations on user clicks
- **Framer Motion animations** - Buttery smooth page transitions and micro-interactions
- **Modern typography** - Variable fonts with dynamic weight adjustments
- **Responsive design** - Mobile-first approach with perfect scaling across devices
- **Custom hero positioning** - Optimized image focal point to showcase artist

### 🎵 Concert Management
- **Google Calendar Integration** - Automatically fetches upcoming concerts with clickable ticket links
- **Google Drive Images** - Dynamic concert image loading from Google Drive folders
- **Automatic Archive** - Past concerts automatically move to the concerts page
- **Concert Navigation Carousel** - Horizontal scrolling carousel of upcoming concerts in header
- **Dedicated Concerts Page** - Full-width hero for most recent concert, 3-column grid for archive
- **Priority loading** - First concert loads immediately for better UX
- **Smooth page transitions** - Fade-in animations when navigating between pages
- **24-hour caching** - Smart caching with automatic refresh

### 📧 Contact Integration
- **Resend Email API** - Working contact form that sends emails directly
- **Form validation** - Client and server-side validation
- **Loading states** - Visual feedback during submission
- **Social media links** - SVG icons for Facebook, Instagram, TikTok, and YouTube

### 🚀 Performance
- **Next.js 15** with Turbopack for lightning-fast development
- **Image optimization** - WebP/AVIF formats with intelligent sizing
- **TypeScript** - Full type safety and better DX
- **Tailwind CSS** - Modern utility-first styling
- **SEO optimized** - Comprehensive meta tags and structured data
- **API Routes** - Server-side data fetching for concerts

### 🎯 User Experience
- **Smooth scrolling** - Native smooth scroll behavior with parallax effects
- **Interactive animations** - Mouse-tracking text effects and click sparks
- **Loading states** - Priority loading for above-the-fold content
- **Chronological ordering** - Concerts always displayed newest to oldest

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript 5
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Email:** Resend API
- **APIs:** Google Calendar API v3, Google Drive API v3
- **Fonts:** Variable fonts (Compressa VF) with custom font-variation-settings
- **Build Tool:** Turbopack
- **Package Manager:** npm

## 📁 Project Structure

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── api/               # API Routes
│   │   ├── concerts/     # Concert API endpoints
│   │   │   ├── route.ts  # Upcoming concerts
│   │   │   └── past/     # Past concerts archive
│   │   │       └── route.ts
│   │   └── contact/      # Contact form endpoint
│   │       └── route.ts  # Resend email integration
│   ├── concerts/         # Concerts archive page
│   │   └── page.tsx
│   ├── globals.css       # Global styles and Tailwind imports
│   ├── layout.tsx        # Root layout with SEO metadata
│   └── page.tsx          # Home page component
├── components/           # React components
│   ├── About.tsx        # About section with ScrollVelocity
│   ├── ClickSpark.tsx   # Interactive click particle effects
│   ├── Contact.tsx      # Contact form with Resend integration
│   ├── Hero.tsx         # Hero section with custom parallax
│   ├── Navigation.tsx   # Header with concert carousel
│   ├── ParallaxSection.tsx  # Reusable parallax background
│   ├── ScrollVelocity.tsx   # Animated scrolling text
│   └── TextPressure.tsx     # Mouse-tracking variable font animation
├── constants/           # Application constants
│   └── index.ts        # Concert data, animation config
├── hooks/              # Custom React hooks
│   └── useConcerts.ts  # Google Calendar integration hook
└── types/             # TypeScript type definitions
    └── index.ts       # Component props, data interfaces
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm
- Google Calendar API Key
- Google Drive API access

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Calendar API
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=your_api_key_here
NEXT_PUBLIC_GOOGLE_CALENDAR_ID=your_calendar_id@group.calendar.google.com

# Google Drive (for concert images)
NEXT_PUBLIC_GOOGLE_DRIVE_PARENT_FOLDER_ID=your_folder_id_here
NEXT_PUBLIC_GOOGLE_DRIVE_PARENT_FOLDER_NAME=Konsert Bilder

# Concert Settings
NEXT_PUBLIC_CONCERT_TAG_FILTER=[CONCERT]
NEXT_PUBLIC_MAX_CONCERTS_DISPLAY=5
NEXT_PUBLIC_API_REFRESH_INTERVAL=1440

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key_here
CONTACT_EMAIL=your_email@gmail.com
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd arvidportfolio-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Add your Google API credentials

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start

# or deploy to Vercel (recommended)
vercel --prod
```

## 🎨 Key Components

### TextPressure
Interactive hero title with mouse tracking:
- **Variable Font Controls:** Dynamically adjusts font weight, width, and style
- **Mouse Tracking:** Responds to cursor position with smooth animations
- **Custom Font:** Uses Compressa VF variable font from Cloudinary
- **Performance:** Optimized with requestAnimationFrame

### ScrollVelocity
Animated scrolling text banner:
- **Scroll Physics:** Movement speed adjusts based on scroll velocity
- **Infinite Loop:** Seamless repeating text pattern
- **Bidirectional:** Text rows scroll in opposite directions
- **Configurable:** Adjustable velocity, damping, and stiffness

### ParallaxSection
Reusable parallax background component:
- **Smooth Parallax:** Background moves at different speed than content
- **Configurable Speed:** Adjustable parallax intensity
- **Overlay Support:** Optional dark overlay for text readability
- **Fill Screen:** Option to prevent white space gaps during scroll

### Navigation with Concert Carousel
Dynamic header with upcoming concerts:
- **Auto-fetch:** Pulls concerts from Google Calendar
- **Image Carousel:** Horizontal scrolling display of concert images
- **Smart Caching:** 24-hour cache with manual refresh capability
- **Loading States:** Graceful handling of API errors

### Concerts Page
Dedicated archive of all performances:
- **Hero Display:** Most recent concert shown as full-width hero image
- **3-Column Grid:** Regular grid layout for all other concerts
- **Auto-populate:** Past Google Calendar events automatically appear
- **Chronological:** Always sorted newest to oldest
- **Static + Dynamic:** Merges API concerts with manually added archive

## 🔧 Configuration

### Google Calendar Setup

1. **Calendar Events:** Add concerts with `[CONCERT]` tag in the title
2. **Event Format:** "Concert Name at Venue"
3. **Description:** Add ticket URLs and additional details
4. **Auto-archive:** Events automatically move to past concerts when date passes

### Google Drive Structure

```
Concert Images (Parent Folder)
├── Concert Name 1/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── image3.jpg
├── Concert Name 2/
│   └── image1.jpg
```

Images are automatically matched to concerts by folder name.

### Concert Images (Static)

Add images to `/public/assets/images/concerts/recent/` with naming format:
- `Concert-Name-Year.jpg` (e.g., `Torsjö-Live-2024.jpg`)

### Styling
- **Colors:** Modify Tailwind classes in components
- **Parallax Speed:** Adjust `speed` prop in ParallaxSection
- **Animations:** Configure timing in Framer Motion variants
- **Typography:** Update variable font settings in TextPressure

## 📱 Responsive Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

All components adapt fluidly with mobile-first design principles.

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel --prod
```

**Important:** Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY`
- `NEXT_PUBLIC_GOOGLE_CALENDAR_ID`
- `NEXT_PUBLIC_GOOGLE_DRIVE_PARENT_FOLDER_ID`

### Environment Security
- Never commit `.env.local` to git
- Use Vercel environment variables for production
- Restrict API keys to specific domains

## 🔄 Removed Features

The following features were removed during development:
- ~~Collapsible dot navigation~~ - Replaced with concert carousel header
- ~~CircularGallery component~~ - Not used in final design
- ~~IdolSection component~~ - Consolidated into concerts page
- ~~Static concert data in constants~~ - Migrated to Google Calendar API
- ~~ScrollCarousel~~ - Replaced with Navigation carousel
- ~~Mock fallback concerts~~ - API errors now return empty array

## 🤝 Contributing

This is a personal portfolio, but suggestions and improvements are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration:** Contemporary Nordic art and minimalism
- **Technical Foundation:** Next.js, React, and Framer Motion communities
- **Animation Libraries:** TextPressure and ScrollVelocity implementations
- **Performance:** Vercel team for incredible developer experience
- **APIs:** Google Calendar and Google Drive for dynamic content

---

**Built with ❤️ for Arvid Einarsson**

*Portfolio showcasing the intersection of traditional Scandinavian musical heritage and modern artistic expression.*
