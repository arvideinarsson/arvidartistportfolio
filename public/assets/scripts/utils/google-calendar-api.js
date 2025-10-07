/**
 * Google Calendar API Client for Arvid's Portfolio
 * Handles fetching and filtering concert events from Google Calendar
 */

class GoogleCalendarAPI {
    constructor(config = {}) {
        this.apiKey = config.apiKey || window.ENV?.GOOGLE_CALENDAR_API_KEY || '';
        this.calendarId = config.calendarId || window.ENV?.GOOGLE_CALENDAR_ID || '';
        this.concertFilter = config.concertFilter || window.ENV?.CONCERT_TAG_FILTER || '[CONCERT]';
        this.maxResults = config.maxResults || window.ENV?.MAX_CONCERTS_DISPLAY || 5;
        
        this.baseUrl = 'https://www.googleapis.com/calendar/v3/calendars';
        this.cacheKey = 'arvid_portfolio_concerts';
        this.cacheTimestampKey = 'arvid_portfolio_concerts_timestamp';
        this.cacheExpiryHours = 24; // Cache expires after 24 hours
        
        this.isConfigured = Boolean(this.apiKey && this.calendarId);
        
        if (!this.isConfigured) {
            console.warn(' Google Calendar API not configured. Using cached/static data.');
        }
    }

    /**
     * Fetch past concert events from Google Calendar with image attachments
     * @param {number} maxResults - Maximum number of past concerts to fetch
     * @returns {Promise<Array>} Array of past concert events with image data
     */
    async fetchPastConcerts(maxResults = 9) {
        try {
            // Check cache first
            const cacheKey = 'arvid_portfolio_past_concerts';
            const cachedData = this.getCachedData(cacheKey);
            if (cachedData && this.isCacheValid(cacheKey)) {
                console.log(' Using cached past concert data');
                return cachedData;
            }

            if (!this.isConfigured) {
                console.log(' API not configured, using static past concert data');
                return this.getStaticPastConcerts();
            }

            console.log(' Fetching past concerts from Google Calendar...');
            
            const now = new Date().toISOString();
            const params = new URLSearchParams({
                key: this.apiKey,
                timeMax: now, // Only events before now
                maxResults: maxResults * 3, // Get more to filter down
                singleEvents: 'true',
                orderBy: 'startTime',
                fields: 'items(id,summary,description,start,end,location,attachments,htmlLink)'
            });

            const url = `${this.baseUrl}/${encodeURIComponent(this.calendarId)}/events?${params}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Calendar API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const concertEvents = this.filterConcertEvents(data.items || []);
            
            // Sort by date descending (most recent first) and limit results
            const sortedEvents = concertEvents
                .sort((a, b) => new Date(b.start?.dateTime || b.start?.date) - new Date(a.start?.dateTime || a.start?.date))
                .slice(0, maxResults);
            
            const transformedEvents = await this.transformEventsWithImages(sortedEvents);
            
            // Cache the results
            this.cacheData(transformedEvents, cacheKey);
            
            console.log(` Fetched ${transformedEvents.length} past concerts`);
            return transformedEvents;

        } catch (error) {
            console.error(' Error fetching past concert data:', error);
            
            // Try cached data as fallback
            const cacheKey = 'arvid_portfolio_past_concerts';
            const cachedData = this.getCachedData(cacheKey);
            if (cachedData) {
                console.log(' Using expired cached past concert data as fallback');
                return cachedData;
            }
            
            // Last resort: static past concert data
            console.log(' Using static past concert fallback');
            return this.getStaticPastConcerts();
        }
    }

    /**
     * Fetch upcoming concert events from Google Calendar with image attachments
     * @returns {Promise<Array>} Array of concert events with image data
     */
    async fetchUpcomingConcerts() {
        try {
            // Check cache first
            const cachedData = this.getCachedData();
            if (cachedData && this.isCacheValid()) {
                console.log(' Using cached concert data with images');
                return cachedData;
            }

            if (!this.isConfigured) {
                console.log(' API not configured, using static fallback data');
                return this.getStaticFallbackData();
            }

            console.log(' Fetching fresh concert data with images from Google Calendar...');
            
            // Start from beginning of today to include all of today's events
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const now = today.toISOString();
            
            const params = new URLSearchParams({
                key: this.apiKey,
                timeMin: now,
                maxResults: this.maxResults * 3, // Get more to filter down
                singleEvents: 'true',
                orderBy: 'startTime',
                fields: 'items(id,summary,description,start,end,location,attachments,htmlLink)'
            });

            const url = `${this.baseUrl}/${encodeURIComponent(this.calendarId)}/events?${params}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Calendar API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const concertEvents = this.filterConcertEvents(data.items || []);
            const transformedEvents = await this.transformEventsWithImages(concertEvents);
            
            // Cache the results with image data
            this.cacheData(transformedEvents);
            
            console.log(` Fetched ${transformedEvents.length} upcoming concerts with image processing`);
            return transformedEvents;

        } catch (error) {
            console.error(' Error fetching calendar data:', error);
            
            // Try to use cached data as fallback
            const cachedData = this.getCachedData();
            if (cachedData) {
                console.log(' Using expired cached data as fallback');
                return cachedData;
            }
            
            // Last resort: static fallback data
            console.log(' Using static fallback data');
            return this.getStaticFallbackData();
        }
    }

    /**
     * Filter events to only include concerts
     * @param {Array} events - Raw calendar events
     * @returns {Array} Filtered concert events
     */
    filterConcertEvents(events) {
        const concertKeywords = [
            '(concert)',
            '(CONCERT)', 
            '(Concert)',
            '(konsert)',
            '(KONSERT)',
            '(Konsert)'
        ];

        return events.filter(event => {
            if (!event.summary) return false;
            
            const summary = event.summary.toLowerCase();
            const description = (event.description || '').toLowerCase();
            
            return concertKeywords.some(keyword => 
                summary.includes(keyword.toLowerCase()) || description.includes(keyword.toLowerCase())
            );
        });
    }

    /**
     * Transform Google Calendar events to portfolio format with image processing
     * @param {Array} events - Filtered calendar events
     * @returns {Promise<Array>} Transformed events with image data
     */
    async transformEventsWithImages(events) {
        const limitedEvents = events.slice(0, this.maxResults);
        const transformedEvents = [];
        
        for (const event of limitedEvents) {
            const startDate = event.start?.dateTime || event.start?.date;
            const endDate = event.end?.dateTime || event.end?.date;
            
            // Process images if available
            const imageData = await this.processEventImages(event);
            
            const transformedEvent = {
                id: `calendar-${event.id}`,
                title: this.cleanTitle(event.summary || 'Concert'),
                venue: this.extractVenue(event),
                date: this.formatDate(startDate),
                description: this.cleanDescription(event.description || ''),
                image: imageData.primaryImage || this.getEventImage(event),
                images: imageData.allImages,
                hasImages: imageData.allImages.length > 0,
                links: this.extractLinks(event.description || ''),
                isPlaceholder: false,
                source: 'google-calendar',
                originalEvent: {
                    id: event.id,
                    htmlLink: event.htmlLink,
                    startDate,
                    endDate,
                    location: event.location,
                    attachments: event.attachments
                }
            };
            
            transformedEvents.push(transformedEvent);
        }
        
        return transformedEvents;
    }

    /**
     * Legacy method for backward compatibility
     * @param {Array} events - Filtered calendar events
     * @returns {Array} Transformed events
     */
    transformEvents(events) {
        return events.slice(0, this.maxResults).map(event => {
            const startDate = event.start?.dateTime || event.start?.date;
            const endDate = event.end?.dateTime || event.end?.date;
            
            return {
                id: `calendar-${event.id}`,
                title: this.cleanTitle(event.summary || 'Concert'),
                venue: this.extractVenue(event),
                date: this.formatDate(startDate),
                description: this.cleanDescription(event.description || ''),
                image: this.getEventImage(event),
                isPlaceholder: false,
                source: 'google-calendar',
                originalEvent: {
                    id: event.id,
                    htmlLink: event.htmlLink,
                    startDate,
                    endDate,
                    location: event.location
                }
            };
        });
    }

    /**
     * Clean and format event title
     * @param {string} title - Raw event title
     * @returns {string} Cleaned title
     */
    cleanTitle(title) {
        // Remove common prefixes like (CONCERT), (Concert), (konsert), etc. and timestamps
        return title
            .replace(/^\(CONCERT\)\s*/i, '')
            .replace(/^\(Concert\)\s*/i, '')
            .replace(/^\(concert\)\s*/i, '')
            .replace(/^\(KONSERT\)\s*/i, '')
            .replace(/^\(Konsert\)\s*/i, '')
            .replace(/^\(konsert\)\s*/i, '')
            .replace(/^\d{1,2}:\d{2}\s*-?\s*/i, '')
            .trim();
    }

    /**
     * Extract venue from event location or title
     * @param {Object} event - Calendar event
     * @returns {string} Venue name
     */
    extractVenue(event) {
        if (event.location) {
            // Clean up location string (remove address details)
            return event.location.split(',')[0].trim();
        }
        
        // Try to extract from title if no location
        const title = event.summary || '';
        const atMatch = title.match(/\s+at\s+([^,\-]+)/i);
        if (atMatch) {
            return atMatch[1].trim();
        }
        
        return 'Venue TBA';
    }

    /**
     * Format date for display
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        if (!dateString) return 'Date TBA';
        
        try {
            const date = new Date(dateString);
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                timeZone: 'Europe/Stockholm' // Swedish timezone
            };
            
            return date.toLocaleDateString('sv-SE', options);
        } catch (error) {
            console.warn('Error formatting date:', dateString, error);
            return dateString.split('T')[0]; // Fallback to YYYY-MM-DD
        }
    }

    /**
     * Clean HTML and format description
     * @param {string} description - Raw event description
     * @returns {string} Cleaned description
     */
    cleanDescription(description) {
        if (!description) return 'Concert details to be announced.';
        
        // Strip HTML tags and clean up
        const cleaned = description
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&nbsp;/g, ' ') // Replace HTML entities
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
        
        // Truncate if too long
        if (cleaned.length > 200) {
            return cleaned.substring(0, 197) + '...';
        }
        
        return cleaned || 'Concert details to be announced.';
    }

    /**
     * Extract links from event description
     * @param {string} description - Raw event description
     * @returns {Array} Array of link objects
     */
    extractLinks(description) {
        const links = [];
        
        if (!description) return links;
        
        // Create a temporary DOM element to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = description;
        
        // Find all anchor tags
        const anchorTags = tempDiv.querySelectorAll('a');
        anchorTags.forEach(anchor => {
            const href = anchor.href || anchor.getAttribute('href');
            const text = anchor.textContent || anchor.innerText || href;
            
            if (href && href.startsWith('http')) {
                links.push({
                    url: href,
                    text: text.trim(),
                    type: this.determineLinkType(href, text)
                });
            }
        });
        
        // Also look for plain URLs in text (not in HTML tags)
        const plainText = tempDiv.textContent || tempDiv.innerText || description;
        const urlRegex = /(https?:\/\/[^\s<>"]+)/gi;
        const urlMatches = plainText.match(urlRegex);
        
        if (urlMatches) {
            urlMatches.forEach(url => {
                // Check if this URL is not already in our links array
                if (!links.find(link => link.url === url)) {
                    links.push({
                        url: url,
                        text: this.extractDomainName(url),
                        type: this.determineLinkType(url, '')
                    });
                }
            });
        }
        
        return links;
    }

    /**
     * Determine the type of link based on URL and text
     * @param {string} url - The URL
     * @param {string} text - The link text
     * @returns {string} Link type
     */
    determineLinkType(url, text) {
        const urlLower = url.toLowerCase();
        const textLower = text.toLowerCase();
        
        // Ticket platforms
        if (urlLower.includes('eventbrite') || urlLower.includes('ticketmaster') || 
            urlLower.includes('billetto') || urlLower.includes('ticnet') ||
            textLower.includes('tickets') || textLower.includes('biljetter')) {
            return 'tickets';
        }
        
        // Social media
        if (urlLower.includes('facebook') || urlLower.includes('instagram') || 
            urlLower.includes('twitter') || urlLower.includes('youtube')) {
            return 'social';
        }
        
        // Venue websites
        if (textLower.includes('venue') || textLower.includes('plats') || 
            textLower.includes('location')) {
            return 'venue';
        }
        
        // Default to generic link
        return 'website';
    }

    /**
     * Extract domain name from URL for display
     * @param {string} url - The URL
     * @returns {string} Domain name
     */
    extractDomainName(url) {
        try {
            const hostname = new URL(url).hostname;
            return hostname.replace('www.', '');
        } catch (error) {
            return url;
        }
    }

    /**
     * Process images from calendar event
     * @param {Object} event - Calendar event
     * @returns {Promise<Object>} Image data object
     */
    async processEventImages(event) {
        const imageData = {
            primaryImage: null,
            allImages: [],
            hasValidImages: false
        };

        console.log(` Processing images for event: ${event.summary}`);
        console.log(`📎 Event has attachments:`, !!event.attachments, event.attachments?.length || 0);

        // Initialize image manager if available
        if (window.ImageManager && !this.imageManager) {
            this.imageManager = new window.ImageManager();
        }

        // Process attachments if available
        if (event.attachments && this.imageManager) {
            console.log(`📎 Processing ${event.attachments.length} attachments`);
            const processedImages = this.imageManager.processEventAttachments(event.attachments);
            console.log(` Found ${processedImages.length} image attachments`);
            
            if (processedImages.length > 0) {
                // Try to use images even if validation fails - let browser handle CORS
                console.log(` Found ${processedImages.length} images, using optimistic loading approach`);
                
                // Use all images optimistically
                imageData.allImages = processedImages;
                imageData.primaryImage = processedImages[0].url;
                imageData.hasValidImages = true;
                
                console.log(` Using ${processedImages.length} images with optimistic loading for event`);
                console.log(` Primary image URL: ${imageData.primaryImage}`);
            }
        } else if (event.attachments) {
            console.log(' Attachments found but ImageManager not available');
        }

        // Extract images from description if no attachments
        if (!imageData.hasValidImages && event.description) {
            console.log(' Searching for images in event description');
            const descriptionImages = this.extractImagesFromDescription(event.description);
            if (descriptionImages.length > 0) {
                imageData.allImages = descriptionImages;
                imageData.primaryImage = descriptionImages[0].url;
                imageData.hasValidImages = true;
                console.log(` Found ${descriptionImages.length} images in description`);
            }
        }

        // Fallback to placeholder if no images found
        if (!imageData.hasValidImages) {
            imageData.primaryImage = this.getEventImage(event);
            console.log(` Using placeholder image for event: ${event.summary}`);
        }

        return imageData;
    }

    /**
     * Extract image URLs from event description
     * @param {string} description - Event description HTML
     * @returns {Array} Array of image objects
     */
    extractImagesFromDescription(description) {
        const images = [];
        
        if (!description) return images;
        
        // Create a temporary DOM element to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = description;
        
        // Find all img tags
        const imgTags = tempDiv.querySelectorAll('img');
        imgTags.forEach(img => {
            const src = img.src || img.getAttribute('src');
            if (src) {
                images.push({
                    url: src,
                    title: img.alt || 'Concert Image',
                    mimeType: 'image/unknown'
                });
            }
        });
        
        // Also look for direct image URLs in text
        const urlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp))/gi;
        const urlMatches = description.match(urlRegex);
        if (urlMatches) {
            urlMatches.forEach(url => {
                if (!images.find(img => img.url === url)) {
                    images.push({
                        url: url,
                        title: 'Concert Image',
                        mimeType: 'image/unknown'
                    });
                }
            });
        }
        
        return images;
    }

    /**
     * Convert Google Drive URLs to direct image URLs
     * @param {string} driveUrl - Original Google Drive URL
     * @returns {string} Direct image URL
     */
    convertDriveUrl(driveUrl) {
        if (!driveUrl) return this.getEventImage({});
        
        // Handle Google Drive file URLs
        const fileIdMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
        if (fileIdMatch) {
            return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
        }
        
        // Handle Google Drive open URLs
        const openMatch = driveUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
        if (openMatch) {
            return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`;
        }
        
        return driveUrl;
    }

    /**
     * Get placeholder image for event
     * @param {Object} event - Calendar event
     * @returns {string} Image URL
     */
    getEventImage(event) {
        const eventName = encodeURIComponent(this.cleanTitle(event.summary || 'Concert'));
        return `https://via.placeholder.com/400x300/f0f0f0/666?text=${eventName}`;
    }

    /**
     * Cache concert data
     * @param {Array} data - Concert data to cache
     * @param {string} cacheKey - Optional cache key (defaults to main cache)
     */
    cacheData(data, cacheKey = null) {
        try {
            const key = cacheKey || this.cacheKey;
            const timestampKey = cacheKey ? `${cacheKey}_timestamp` : this.cacheTimestampKey;
            
            localStorage.setItem(key, JSON.stringify(data));
            localStorage.setItem(timestampKey, Date.now().toString());
        } catch (error) {
            console.warn('Failed to cache concert data:', error);
        }
    }

    /**
     * Get cached concert data
     * @param {string} cacheKey - Optional cache key (defaults to main cache)
     * @returns {Array|null} Cached data or null
     */
    getCachedData(cacheKey = null) {
        try {
            const key = cacheKey || this.cacheKey;
            const cached = localStorage.getItem(key);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.warn('Failed to retrieve cached data:', error);
            return null;
        }
    }

    /**
     * Check if cached data is still valid
     * @param {string} cacheKey - Optional cache key (defaults to main cache)
     * @returns {boolean} True if cache is valid
     */
    isCacheValid(cacheKey = null) {
        try {
            const timestampKey = cacheKey ? `${cacheKey}_timestamp` : this.cacheTimestampKey;
            const timestamp = localStorage.getItem(timestampKey);
            if (!timestamp) return false;
            
            const cacheAge = Date.now() - parseInt(timestamp);
            const maxAge = this.cacheExpiryHours * 60 * 60 * 1000; // Convert to milliseconds
            
            return cacheAge < maxAge;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get static fallback data when API is unavailable
     * @returns {Array} Static concert data
     */
    getStaticFallbackData() {
        return [
            {
                id: 'static-upcoming-1',
                title: 'Summer Festival 2025',
                venue: 'Stockholm Concert Hall',
                date: 'June 15, 2025',
                description: 'Annual summer music festival featuring contemporary Nordic compositions.',
                image: 'https://via.placeholder.com/400x300/f0f0f0/666?text=Summer+Festival',
                isPlaceholder: true,
                source: 'static-fallback'
            }
        ];
    }

    /**
     * Get static past concerts for fallback when API is unavailable
     * @returns {Array} Static past concert data
     */
    getStaticPastConcerts() {
        return [
            {
                id: 'static-past-1',
                title: 'Idol Kvalfinal 2022',
                venue: 'TV4',
                date: '19 September 2022',
                description: 'Performance in the qualification final of Swedish Idol 2022.',
                image: 'https://via.placeholder.com/400x300/f0f0f0/666?text=Idol+Kvalfinal',
                isPlaceholder: true,
                source: 'static-fallback'
            },
            {
                id: 'static-past-2',
                title: 'Mejeriet Lund 2024',
                venue: 'Mejeriet, Lund',
                date: '9 Februari 2024',
                description: 'Performance at Mejeriet Lund, one of Sweden\'s premier live music venues.',
                image: 'https://via.placeholder.com/400x300/f0f0f0/666?text=Mejeriet+Lund',
                isPlaceholder: true,
                source: 'static-fallback'
            },
            {
                id: 'static-past-3',
                title: 'Jamboree 2022',
                venue: 'Jamboree',
                date: '7 Augusti 2022',
                description: 'Performance at Jamboree 2022.',
                image: 'https://via.placeholder.com/400x300/f0f0f0/666?text=Jamboree+2022',
                isPlaceholder: true,
                source: 'static-fallback'
            },
            {
                id: 'static-past-4',
                title: 'Lundakarnevalen 2022',
                venue: 'Lund',
                date: '22 Maj 2022',
                description: 'Performance at Lundakarnevalen 2022.',
                image: 'https://via.placeholder.com/400x300/f0f0f0/666?text=Lundakarnevalen',
                isPlaceholder: true,
                source: 'static-fallback'
            },
            {
                id: 'static-past-5',
                title: 'Torsjö Live 2024',
                venue: 'Torsjö',
                date: '2024',
                description: 'Performance at Torsjö Live 2024, continuing the tradition of this beloved annual event.',
                image: 'https://via.placeholder.com/400x300/f0f0f0/666?text=Torsjö+Live+2024',
                isPlaceholder: true,
                source: 'static-fallback'
            },
            {
                id: 'static-past-6',
                title: 'Hässleholmsfestivalen 2022',
                venue: 'Hässleholm',
                date: '2022',
                description: 'Performance at Hässleholmsfestivalen 2022.',
                image: 'https://via.placeholder.com/400x300/f0f0f0/666?text=Hässleholmsfestivalen',
                isPlaceholder: true,
                source: 'static-fallback'
            },
            {
                id: 'static-past-7',
                title: 'Lunds Nation NSA 2025',
                venue: 'Lunds Nation',
                date: '30 April 2025',
                description: 'Performance at Lunds Nation NSA event.',
                image: 'https://via.placeholder.com/400x300/f0f0f0/666?text=Lunds+Nation+NSA',
                isPlaceholder: true,
                source: 'static-fallback'
            },
            {
                id: 'static-past-8',
                title: 'Penthouse Lunds Nation Valborg',
                venue: 'Lunds Nation',
                date: 'Valborg 2023',
                description: 'Special Valborg performance at Penthouse, Lunds Nation.',
                image: 'https://via.placeholder.com/400x300/f0f0f0/666?text=Penthouse+Valborg',
                isPlaceholder: true,
                source: 'static-fallback'
            },
            {
                id: 'static-past-9',
                title: 'Himlakull Kaffe 2025',
                venue: 'Himlakull',
                date: '15 Januari 2025',
                description: 'Intimate performance at Himlakull Kaffe.',
                image: 'https://via.placeholder.com/400x300/f0f0f0/666?text=Himlakull+Kaffe',
                isPlaceholder: true,
                source: 'static-fallback'
            }
        ];
    }

    /**
     * Manual refresh method for testing
     * @returns {Promise<Array>} Fresh concert data
     */
    async forceRefresh() {
        // Clear cache
        localStorage.removeItem(this.cacheKey);
        localStorage.removeItem(this.cacheTimestampKey);
        
        // Also clear image cache if available
        if (this.imageManager && this.imageManager.imageCache) {
            this.imageManager.imageCache.clear();
            console.log(' Cleared image cache');
        }
        
        console.log(' Force refreshing concert data with fresh image validation...');
        return this.fetchUpcomingConcerts();
    }

    /**
     * Get API status information
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            configured: this.isConfigured,
            apiKey: this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'Not set',
            calendarId: this.calendarId || 'Not set',
            cacheValid: this.isCacheValid(),
            lastCached: this.getCacheTimestamp()
        };
    }

    /**
     * Get cache timestamp for debugging
     * @returns {string|null} Formatted timestamp or null
     */
    getCacheTimestamp() {
        const timestamp = localStorage.getItem(this.cacheTimestampKey);
        if (!timestamp) return null;
        
        return new Date(parseInt(timestamp)).toLocaleString();
    }
}

// Export for use in other modules
window.GoogleCalendarAPI = GoogleCalendarAPI;