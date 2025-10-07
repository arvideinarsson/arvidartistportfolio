// Main JavaScript for Arvid's Portfolio

// Emergency carousel restore function (available immediately)
window.restoreStaticCarousel = function() {
    console.log('Restoring static carousel by reloading page...');
    window.location.reload();
};

// Hard reset carousel function (available immediately)
window.hardResetCarousel = function() {
    console.log('Hard resetting carousel...');
    
    // Stop and destroy existing carousel
    if (window.carousel) {
        window.carousel.destroy();
        window.carousel = null;
    }
    
    // Clear all caches
    localStorage.clear();
    console.log('Cleared all localStorage cache');
    
    // Reset carousel track
    const track = document.getElementById('carouselTrack');
    if (track) {
        track.style.transform = '';
        track.innerHTML = '';
        console.log('Cleared carousel track');
    }
    
    // Force refresh concert data
    if (window.concertManager && window.concertManager.calendarAPI) {
        console.log('Force refreshing calendar data...');
        window.concertManager.calendarAPI.forceRefresh().then(() => {
            console.log('Calendar data refreshed');
            
            // Reinitialize carousel after a short delay
            setTimeout(() => {
                console.log('Reinitializing carousel...');
                initCarousel();
                console.log('Carousel hard reset complete!');
            }, 1000);
        });
    } else {
        // Just reinitialize carousel if no concert manager
        setTimeout(() => {
            console.log('Reinitializing carousel...');
            initCarousel();
            console.log('Carousel hard reset complete!');
        }, 1000);
    }
};

// Curated top 9 recent concert highlights (portfolio favorites)
// Complete concert archive will be available on dedicated Past Concerts page
const concertData = {
    "idol-kvalfinal-2022": {
        title: "Idol Kvalfinal 2022",
        venue: "TV4",
        date: "19 September 2022",
        description: "Performance in the qualification final of Swedish Idol 2022.",
        image: "https://via.placeholder.com/400x300/f0f0f0/666?text=Idol+Kvalfinal"
    },
    "mejeriet-lund-2024": {
        title: "Mejeriet Lund 2024",
        venue: "Mejeriet, Lund",
        date: "9 Februari 2024",
        description: "Performance at Mejeriet Lund, one of Sweden's premier live music venues.",
        image: "https://via.placeholder.com/400x300/f0f0f0/666?text=Mejeriet+Lund"
    },
    "examenskonsert-2025": {
        title: "Examenskonsert 2025",
        venue: "Lund",
        date: "17 Maj 2025",
        description: "Graduation concert performance.",
        image: "https://via.placeholder.com/400x300/f0f0f0/666?text=Examenskonsert"
    },
    "jamboree-2022": {
        title: "Jamboree 2022",
        venue: "Jamboree",
        date: "7 Augusti 2022",
        description: "Performance at Jamboree 2022.",
        image: "https://via.placeholder.com/400x300/f0f0f0/666?text=Jamboree+2022"
    },
    "lundakarnevalen-2022": {
        title: "Lundakarnevalen 2022",
        venue: "Lund",
        date: "22 Maj 2022",
        description: "Performance at Lundakarnevalen 2022.",
        image: "https://via.placeholder.com/400x300/f0f0f0/666?text=Lundakarnevalen"
    },
    "torsjo-live-2024": {
        title: "Torsjö Live 2024",
        venue: "Torsjö",
        date: "2024",
        description: "Performance at Torsjö Live 2024, continuing the tradition of this beloved annual event.",
        image: "https://via.placeholder.com/400x300/f0f0f0/666?text=Torsjö+Live+2024"
    },
    "lunds-nation-nsa-2025": {
        title: "Lunds Nation NSA 2025",
        venue: "Lunds Nation",
        date: "30 April 2025",
        description: "Performance at Lunds Nation NSA event.",
        image: "https://via.placeholder.com/400x300/f0f0f0/666?text=Lunds+Nation+NSA"
    },
    "penthouse-lunds-nation-valborg-2023": {
        title: "Penthouse Lunds Nation Valborg 2023",
        venue: "Lunds Nation",
        date: "Valborg 2023",
        description: "Special Valborg performance at Penthouse, Lunds Nation.",
        image: "https://via.placeholder.com/400x300/f0f0f0/666?text=Penthouse+Valborg"
    },
    "hassleholmsfestivalen-2022": {
        title: "Hässleholmsfestivalen 2022",
        venue: "Hässleholm",
        date: "2022",
        description: "Performance at Hässleholmsfestivalen 2022.",
        image: "https://via.placeholder.com/400x300/f0f0f0/666?text=Hässleholmsfestivalen"
    },
    "himlakull-kaffe-2025": {
        title: "Himlakull Kaffe",
        venue: "Himlakull",
        date: "2025",
        description: "Performance at Himlakull Kaffe 2025.",
        image: "src/assets/images/concerts/recent/Himlakull-Kaffe-2025.jpg"
    },
    "torsjo-live-2025": {
        title: "Torsjö Live",
        venue: "Torsjö",
        date: "2025",
        description: "Performance at Torsjö Live 2025.",
        image: "src/assets/images/concerts/recent/Torsjö-Live-2025.jpg"
    }
};

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize interactive text effect for hero
    initInteractiveTitle();
    
    // Initialize carousel
    initCarousel();
    
    // Initialize modal
    initModal();
    
    // Initialize concert management system
    initConcertManager();
    
    // Initialize navigation collapse
    initNavigationCollapse();
    
    // Initialize click spark effect
    initClickSpark();
    
    // Initialize Past Concerts page if we're on it
    if (window.location.pathname.includes('past-concerts.html')) {
        // Wait for concert manager to load, then initialize Past Concerts page
        setTimeout(() => {
            if (window.concertManager) {
                window.concertManager.initPastConcertsPage();
            }
        }, 1000);
    }
    
    // Enhanced smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Calculate offset for navigation
                const navHeight = 100;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update active navigation state immediately
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Enhanced scroll detection for navigation active states
    function updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        const scrollPosition = window.scrollY + 150; // Offset for better detection

        let currentSection = '';

        // Find the current section
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update navigation active states
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Throttled scroll event for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(updateActiveNavigation);
    });

    // Initial call to set active state
    updateActiveNavigation();
    
    console.log('Arvid\'s Portfolio loaded successfully!');
});

// Initialize Interactive Title Effect
function initInteractiveTitle() {
    const titleContainer = document.getElementById('interactive-title');
    
    if (!titleContainer) {
        console.warn('Interactive title container not found');
        return;
    }
    
    // Check if we have TextPressure available
    if (typeof TextPressure === 'undefined') {
        console.warn('TextPressure not loaded, using fallback');
        titleContainer.innerHTML = '<h1 class="text-6xl" style="color: white;">ARVID EINARSSON</h1>';
        return;
    }
    
    // Initialize the interactive text effect
    try {
        window.interactiveTitle = new TextPressure({
            text: 'ARVID  EINARSSON',
            container: titleContainer,
            fontFamily: 'Compressa VF',
            fontUrl: 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',
            width: true,
            weight: true,
            italic: false, // Reduced for better compatibility
            alpha: false,
            flex: true,
            stroke: false,
            scale: false,
            textColor: '#FFFFFF',
            strokeColor: '#27D3F5',
            minFontSize: window.innerWidth <= 576 ? 48 : window.innerWidth <= 768 ? 64 : 80 // Responsive minimum font size
        });
        
        console.log('Interactive title effect initialized successfully');
        
        // Add debug functions
        window.resetInteractiveTitle = () => {
            if (window.interactiveTitle) {
                window.interactiveTitle.destroy();
                initInteractiveTitle();
            }
        };
        
    } catch (error) {
        console.error('Error initializing interactive title:', error);
        // Fallback to regular text
        titleContainer.innerHTML = '<h1 class="text-6xl" style="color: white;">ARVID EINARSSON</h1>';
    }
}


// Curved 3D Carousel Implementation
class CurvedCarousel {
    constructor(trackId, options = {}) {
        this.track = document.getElementById(trackId);
        if (!this.track) {
            console.log('Carousel track not found');
            return;
        }

        // Configuration
        this.speed = options.speed || 20; // seconds for full rotation
        this.originalSlideCount = 0;

        this.init();
    }

    init() {
        this.setupSlides();
        this.setupAnimation();
        console.log('Curved 3D carousel initialized with', this.originalSlideCount, 'slides');
    }

    setupSlides() {
        // Get original slides (not clones)
        const originalSlides = this.track.querySelectorAll('.carousel-slide:not(.clone)');
        this.originalSlideCount = originalSlides.length;

        // Remove any existing clones
        this.track.querySelectorAll('.carousel-slide.clone').forEach(clone => clone.remove());

        // Clone slides for seamless loop - we need enough to fill the circle
        originalSlides.forEach(slide => {
            const clone = slide.cloneNode(true);
            clone.classList.add('clone');
            this.track.appendChild(clone);
        });
    }

    setupAnimation() {
        // Apply CSS animation with the configured speed
        this.track.style.animation = `rotateCarousel ${this.speed}s linear infinite`;

        // Pause animation on hover for better interaction
        this.track.addEventListener('mouseenter', () => {
            this.track.style.animationPlayState = 'paused';
        });

        this.track.addEventListener('mouseleave', () => {
            this.track.style.animationPlayState = 'running';
        });
    }

    destroy() {
        this.track.style.animation = '';
        this.track.querySelectorAll('.carousel-slide.clone').forEach(clone => clone.remove());
    }

    updateSpeed(newSpeed) {
        this.speed = newSpeed;
        this.track.style.animation = `rotateCarousel ${this.speed}s linear infinite`;
    }
}

// Initialize Curved 3D carousel
function initCarousel() {
    window.carousel = new CurvedCarousel('carouselTrack', {
        speed: 20 // 20 seconds for full rotation - same as original speed
    });

    // Debug commands for console
    window.getCarouselStatus = () => {
        if (window.carousel) {
            console.log('Speed:', window.carousel.speed + 's per rotation');
            console.log('Original slide count:', window.carousel.originalSlideCount);
            console.log('Animation running:', window.getComputedStyle(window.carousel.track).animationPlayState);
        }
    };

    window.setCarouselSpeed = (speed) => {
        if (window.carousel) {
            window.carousel.updateSpeed(speed);
            console.log('Carousel speed updated to', speed, 'seconds per rotation');
        }
    };
}

// Concert order for carousel navigation (top 9 highlights)
const concertOrder = [
    "idol-kvalfinal-2022",
    "mejeriet-lund-2024",
    "examenskonsert-2025",
    "jamboree-2022",
    "lundakarnevalen-2022",
    "torsjo-live-2024",
    "lunds-nation-nsa-2025",
    "penthouse-lunds-nation-valborg-2023",
    "hassleholmsfestivalen-2022"
];

let currentModalIndex = 0;

// Modal functionality
function initModal() {
    const modal = document.getElementById('concertModal');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.getElementById('modalPrevBtn');
    const nextBtn = document.getElementById('modalNextBtn');
    
    // Close modal when clicking the X
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        } else if (event.key === 'ArrowLeft') {
            navigateModal(-1);
        } else if (event.key === 'ArrowRight') {
            navigateModal(1);
        }
    });
    
    // Modal navigation buttons
    prevBtn.addEventListener('click', () => navigateModal(-1));
    nextBtn.addEventListener('click', () => navigateModal(1));
    
    console.log('Modal initialized successfully!');
}

function openModal(concertId) {
    const concert = concertData[concertId];
    if (!concert) {
        console.error('Concert not found:', concertId);
        return;
    }
    
    // Set current index for navigation
    currentModalIndex = concertOrder.indexOf(concertId);
    
    const modal = document.getElementById('concertModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalVenue = document.getElementById('modalVenue');
    const modalDate = document.getElementById('modalDate');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    
    // Populate modal content
    modalTitle.textContent = concert.title;
    modalVenue.textContent = concert.venue;
    modalDate.textContent = concert.date;
    modalImage.src = concert.image;
    modalImage.alt = concert.title;
    modalDescription.textContent = concert.description;
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function navigateModal(direction) {
    // Calculate new index with wrapping
    const newIndex = (currentModalIndex + direction + concertOrder.length) % concertOrder.length;
    const newConcertId = concertOrder[newIndex];
    
    // Open the new concert modal
    openModal(newConcertId);
}

function closeModal() {
    const modal = document.getElementById('concertModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Concert Management System Integration
let concertManager = null;

async function initConcertManager() {
    try {
        console.log(' Initializing Concert Management System...');
        
        // Wait for environment variables to load
        if (!window.ENV) {
            console.warn(' Environment variables not loaded, waiting...');
            setTimeout(initConcertManager, 100);
            return;
        }
        
        // Initialize concert manager
        concertManager = new ConcertManager();
        await concertManager.init();
        
        // Add global debugging functions
        window.getConcertStatus = () => {
            if (concertManager) {
                console.table(concertManager.getStatus());
                return concertManager.getStatus();
            }
            return null;
        };
        
        console.log(' Concert Management System with image support initialized');
        console.log('🔧 Debug: Use refreshConcerts(), getConcertStatus(), or testImageLoading() in console');
        
        // Add global debug functions for image testing
        window.debugConcerts = () => {
            console.log(' Concert Manager Status:', concertManager.getStatus());
            if (window.ImageManager) {
                const imageManager = new window.ImageManager();
                console.log(' Image Manager Status:', imageManager.getStatus());
            }
        };
        
        window.testImageLoading = async () => {
            console.log(' Testing image loading system...');
            if (concertManager.calendarAPI) {
                const concerts = await concertManager.calendarAPI.fetchUpcomingConcerts();
                console.log(' Fetched concerts with image data:', concerts);
                return concerts;
            }
        };
        
        // Add test function for expired concert functionality
        window.testExpiredConcerts = () => {
            console.log(' Testing expired concert functionality...');
            
            // Add a mock expired concert to upcoming list
            const mockExpiredConcert = {
                id: 'test-expired-1',
                title: 'Test Expired Concert',
                venue: 'Test Venue',
                date: 'September 19, 2025', // Yesterday
                description: 'This is a test concert that should move to past carousel',
                image: 'https://via.placeholder.com/400x300/ff0000/fff?text=TEST+EXPIRED',
                isPlaceholder: true,
                source: 'test',
                originalEvent: {
                    startDate: '2025-09-19T20:00:00Z' // Yesterday
                }
            };
            
            // Add to upcoming concerts temporarily
            if (concertManager && concertManager.upcomingConcerts) {
                concertManager.upcomingConcerts.push(mockExpiredConcert);
                console.log(' Added mock expired concert to upcoming list');
                console.log(' Run checkExpiredConcerts() to test auto-move functionality');
                return mockExpiredConcert;
            } else {
                console.warn(' Concert manager not available');
                return null;
            }
        };
        
        // Add function to view archived concerts
        window.viewArchivedConcerts = () => {
            const archive = JSON.parse(localStorage.getItem('pastConcertsArchive') || '[]');
            console.log('='.repeat(50));
            console.log('AUTOMATICALLY ARCHIVED CONCERTS');
            console.log('='.repeat(50));
            
            if (archive.length === 0) {
                console.log('No concerts have been automatically archived yet.');
                console.log('Concerts will be automatically archived when they expire.');
            } else {
                console.log(`Found ${archive.length} automatically archived concerts:`);
                archive.forEach((concert, index) => {
                    console.log(`${index + 1}. ${concert.title}`);
                    console.log(`   Venue: ${concert.venue}`);
                    console.log(`   Date: ${concert.date}`);
                    console.log(`   Archived: ${new Date(concert.archivedDate).toLocaleDateString()}`);
                    console.log('');
                });
            }
            console.log('='.repeat(50));
            return archive;
        };

        // Add function to generate HTML for expired concerts to add to Past Concerts page
        window.generatePastConcertsHTML = async () => {
            console.log('Generating HTML for past concerts...');
            
            if (!concertManager || !concertManager.calendarAPI) {
                console.warn('Concert manager not available');
                return null;
            }
            
            try {
                // Get all past concerts from the API
                const pastConcerts = await concertManager.calendarAPI.fetchPastConcerts(20);
                console.log(`Found ${pastConcerts.length} past concerts from API`);
                
                if (pastConcerts.length === 0) {
                    console.log('No past concerts found');
                    return '';
                }
                
                // Generate HTML for concerts
                let htmlOutput = '\n<!-- New concerts from Google Calendar -->\n';
                const newConcerts = [];
                
                pastConcerts.forEach(concert => {
                    const imageUrl = concert.image || `https://via.placeholder.com/800x600/f0f0f0/666?text=${encodeURIComponent(concert.title)}`;
                    
                    htmlOutput += `                    <div class="gallery-item">
                        <img src="${imageUrl}" alt="${concert.title}" loading="lazy">
                        <h3>${concert.title}</h3>
                    </div>\n`;
                    
                    newConcerts.push({
                        title: concert.title,
                        venue: concert.venue,
                        date: concert.date,
                        image: imageUrl
                    });
                });
                
                htmlOutput += '<!-- End new concerts -->\n';
                
                // Display results
                console.log('='.repeat(60));
                console.log('PAST CONCERTS HTML GENERATED');
                console.log('='.repeat(60));
                console.log('Copy this HTML and paste it into past-concerts.html');
                console.log('Insert it before the last </div></div></section> tags');
                console.log('='.repeat(60));
                console.log(htmlOutput);
                console.log('='.repeat(60));
                console.log(`Found ${newConcerts.length} concerts:`);
                newConcerts.forEach((concert, index) => {
                    console.log(`${index + 1}. ${concert.title} - ${concert.venue} (${concert.date})`);
                });
                console.log('='.repeat(60));
                
                // Copy to clipboard if possible
                if (navigator.clipboard) {
                    try {
                        await navigator.clipboard.writeText(htmlOutput);
                        console.log('HTML copied to clipboard!');
                    } catch (error) {
                        console.log('Could not copy to clipboard automatically');
                    }
                }
                
                return {
                    html: htmlOutput,
                    concerts: newConcerts
                };
                
            } catch (error) {
                console.error('Error generating past concerts HTML:', error);
                return null;
            }
        };

        // Add test function for link extraction functionality
        window.testLinkExtraction = (sampleDescription) => {
            console.log(' Testing link extraction functionality...');
            
            if (!concertManager || !concertManager.calendarAPI) {
                console.warn(' Concert manager or Calendar API not available');
                return null;
            }
            
            // Use provided description or default test
            const testDescription = sampleDescription || `
                Check out tickets at https://eventbrite.com/test-event
                Visit our Facebook event: https://facebook.com/events/123456
                More info at the venue website: https://venue-website.com
            `;
            
            console.log(' Test description:', testDescription);
            const extractedLinks = concertManager.calendarAPI.extractLinks(testDescription);
            console.log(' Extracted links:', extractedLinks);
            
            // Create a test concert with links
            const testConcert = {
                id: 'test-links-1',
                title: 'Test Concert with Links',
                venue: 'Test Venue',
                date: 'October 15, 2025',
                description: 'Test concert with website links',
                image: 'https://via.placeholder.com/400x300/00ff00/000?text=TEST+LINKS',
                links: extractedLinks,
                isPlaceholder: true,
                source: 'test'
            };
            
            console.log(' Test concert object:', testConcert);
            return testConcert;
        };
        
        // Add debug function for Google Calendar API
        window.debugCalendarAPI = async () => {
            console.log(' Debugging Google Calendar API...');
            
            if (!concertManager || !concertManager.calendarAPI) {
                console.warn(' Concert manager or Calendar API not available');
                return null;
            }
            
            const calendarAPI = concertManager.calendarAPI;
            
            // Check configuration
            console.log(' API Configuration:', {
                configured: calendarAPI.isConfigured,
                apiKey: calendarAPI.apiKey ? calendarAPI.apiKey.substring(0, 8) + '...' : 'Not set',
                calendarId: calendarAPI.calendarId || 'Not set'
            });
            
            if (!calendarAPI.isConfigured) {
                console.warn(' API not configured, using fallback data');
                return calendarAPI.getStaticFallbackData();
            }
            
            // Test direct API call
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const timeMin = today.toISOString();
            
            console.log(' Fetching events from:', timeMin);
            console.log(' Current date:', new Date().toISOString());
            
            try {
                const params = new URLSearchParams({
                    key: calendarAPI.apiKey,
                    timeMin: timeMin,
                    maxResults: 50,
                    singleEvents: 'true',
                    orderBy: 'startTime',
                    fields: 'items(id,summary,description,start,end,location,attachments,htmlLink)'
                });
                
                const url = `${calendarAPI.baseUrl}/${encodeURIComponent(calendarAPI.calendarId)}/events?${params}`;
                console.log(' API URL:', url.replace(calendarAPI.apiKey, 'API_KEY_HIDDEN'));
                
                const response = await fetch(url);
                console.log(' Response status:', response.status, response.statusText);
                
                if (!response.ok) {
                    console.error(' API Error:', response.status, response.statusText);
                    return null;
                }
                
                const data = await response.json();
                console.log(' Raw API response:', data);
                console.log(' Total events found:', data.items?.length || 0);
                
                if (data.items) {
                    data.items.forEach((event, index) => {
                        console.log(` Event ${index + 1}:`, {
                            summary: event.summary,
                            start: event.start,
                            description: event.description?.substring(0, 100) + '...'
                        });
                    });
                    
                    // Filter for concerts
                    const concertEvents = calendarAPI.filterConcertEvents(data.items);
                    console.log(' Concert events after filtering:', concertEvents.length);
                    
                    concertEvents.forEach((event, index) => {
                        console.log(` Concert ${index + 1}:`, event.summary, event.start);
                    });
                }
                
                return data;
                
            } catch (error) {
                console.error(' API call failed:', error);
                return null;
            }
        };
        
    } catch (error) {
        console.error(' Failed to initialize Concert Management System:', error);
    }
}

// Initialize Navigation Collapse functionality
function initNavigationCollapse() {
    const nav = document.querySelector('.vertical-nav');
    const hero = document.querySelector('#home');
    
    if (!nav || !hero) {
        console.warn('Navigation or hero section not found');
        return;
    }
    
    let isCollapsed = false;
    
    function checkScroll() {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        const scrollPosition = window.scrollY;
        
        // Collapse when scrolled past the hero section
        if (scrollPosition > heroBottom && !isCollapsed) {
            nav.classList.add('collapsed');
            isCollapsed = true;
        } else if (scrollPosition <= heroBottom && isCollapsed) {
            nav.classList.remove('collapsed');
            isCollapsed = false;
        }
    }
    
    // Add scroll listener
    window.addEventListener('scroll', checkScroll);
    
    // Check initial state
    checkScroll();
    
    console.log('Navigation collapse functionality initialized');
}

// Initialize Click Spark Effect
function initClickSpark() {
    // Check if ClickSpark is available
    if (typeof ClickSpark === 'undefined') {
        console.warn('ClickSpark not loaded');
        return;
    }
    
    // Initialize the click spark effect with custom options
    try {
        window.clickSpark = new ClickSpark({
            sparkColor: '#FF8040', // Use the orange accent color
            sparkSize: 12,
            sparkRadius: 20,
            sparkCount: 6,
            duration: 500,
            easing: 'ease-out',
            extraScale: 1.2
        });
        
        console.log('Click spark effect initialized successfully');
        
        // Add debug function
        window.resetClickSpark = () => {
            if (window.clickSpark) {
                window.clickSpark.destroy();
                initClickSpark();
            }
        };
        
    } catch (error) {
        console.error('Error initializing click spark effect:', error);
    }
}