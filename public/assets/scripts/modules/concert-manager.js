/**
 * Concert Management System for Arvid's Portfolio
 * Orchestrates fetching, displaying, and managing concert data
 */

class ConcertManager {
    constructor() {
        this.upcomingSection = null;
        this.concertsContainer = null;
        this.noUpcomingMessage = null;
        this.loadingElement = null;
        this.errorElement = null;
        
        this.calendarAPI = null;
        this.imageManager = null;
        this.upcomingConcerts = [];
        this.pastConcerts = [];
        this.refreshInterval = null;
        this.expiredCheckInterval = null;
        this.isLoading = false;
        this.isLoadingPast = false;
        
        // Configuration
        this.refreshIntervalMinutes = (window.ENV?.API_REFRESH_INTERVAL || 1440); // Default 24 hours
        this.maxConcerts = window.ENV?.MAX_CONCERTS_DISPLAY || 5;
        this.imagesEnabled = window.ENV?.ENABLE_CONCERT_IMAGES || true;
        
        console.log(' Concert Manager with image support initialized');
    }

    /**
     * Initialize the concert management system
     */
    async init() {
        try {
            console.log(' Initializing Concert Manager with image support...');
            
            // Initialize Google Calendar API
            this.calendarAPI = new GoogleCalendarAPI();
            
            // Initialize Image Manager if images are enabled
            if (this.imagesEnabled && window.ImageManager) {
                this.imageManager = new window.ImageManager();
                console.log(' Image Manager initialized');
            }
            
            // Find DOM elements
            this.findDOMElements();
            
            // Create loading and error elements
            this.createStatusElements();
            
            // Load initial concert data
            await this.loadConcerts();
            
            // Load past concerts for carousel
            await this.loadPastConcerts();
            
            // Set up auto-refresh
            this.setupAutoRefresh();
            
            // Set up frequent expired concert checks
            this.setupExpiredChecks();
            
            // Add global refresh function for debugging
            window.refreshConcerts = () => this.forceRefresh();
            window.refreshPastConcerts = () => this.loadPastConcerts();
            window.checkExpiredConcerts = () => this.checkAndMoveExpiredConcerts();
            window.restoreStaticCarousel = () => this.restoreStaticCarousel();
            
            console.log(' Concert Manager with image support initialized successfully');
            
        } catch (error) {
            console.error(' Failed to initialize Concert Manager:', error);
            this.showError('Failed to initialize concert system');
        }
    }

    /**
     * Find required DOM elements
     */
    findDOMElements() {
        this.upcomingSection = document.getElementById('upcoming');
        this.noUpcomingMessage = document.querySelector('.no-concerts-message');
        
        if (!this.upcomingSection) {
            throw new Error('Required upcoming concerts section not found');
        }

        // Find or create concerts container
        this.concertsContainer = this.upcomingSection.querySelector('.upcoming-concerts-grid');
        if (!this.concertsContainer) {
            this.concertsContainer = this.createConcertsContainer();
        }
    }

    /**
     * Create concerts container if it doesn't exist
     */
    createConcertsContainer() {
        const container = document.createElement('div');
        container.className = 'upcoming-concerts-grid';
        
        // Insert after the title but before no-concerts message
        const title = this.upcomingSection.querySelector('h2');
        if (title && title.parentNode) {
            title.parentNode.insertBefore(container, this.noUpcomingMessage);
        } else {
            this.upcomingSection.appendChild(container);
        }
        
        return container;
    }

    /**
     * Create loading and error status elements
     */
    createStatusElements() {
        // Loading element
        this.loadingElement = document.createElement('div');
        this.loadingElement.className = 'concerts-loading';
        this.loadingElement.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading upcoming concerts...</p>
            </div>
        `;
        this.loadingElement.style.display = 'none';
        
        // Error element
        this.errorElement = document.createElement('div');
        this.errorElement.className = 'concerts-error';
        this.errorElement.innerHTML = `
            <div class="error-message">
                <p> Unable to load concert data</p>
                <button onclick="window.refreshConcerts()" class="retry-btn">Try Again</button>
            </div>
        `;
        this.errorElement.style.display = 'none';
        
        // Add to DOM
        this.upcomingSection.appendChild(this.loadingElement);
        this.upcomingSection.appendChild(this.errorElement);
    }

    /**
     * Load past concerts for carousel
     */
    async loadPastConcerts() {
        if (this.isLoadingPast) return;
        
        try {
            this.isLoadingPast = true;
            
            console.log(' Loading past concerts for carousel...');
            this.pastConcerts = await this.calendarAPI.fetchPastConcerts(9); // Limit to 9 for carousel
            
            this.renderCarousel();
            
            console.log(` Loaded ${this.pastConcerts.length} past concerts for carousel`);
            
        } catch (error) {
            console.error(' Error loading past concerts:', error);
            // Use fallback static data for carousel
            this.renderStaticCarousel();
        } finally {
            this.isLoadingPast = false;
        }
    }

    /**
     * Load concerts from API
     */
    async loadConcerts() {
        if (this.isLoading) return;
        
        try {
            this.isLoading = true;
            this.showLoading();
            
            console.log(' Loading concerts...');
            this.upcomingConcerts = await this.calendarAPI.fetchUpcomingConcerts();
            
            // Check for expired concerts after loading
            await this.checkAndMoveExpiredConcerts();
            
            this.renderConcerts();
            this.hideLoading();
            
            console.log(` Loaded ${this.upcomingConcerts.length} upcoming concerts`);
            
        } catch (error) {
            console.error(' Error loading concerts:', error);
            this.showError(`Error loading concerts: ${error.message}`);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Render concerts in the DOM
     */
    renderConcerts() {
        if (!this.concertsContainer) return;
        
        // Clear existing content
        this.concertsContainer.innerHTML = '';
        
        if (this.upcomingConcerts.length === 0) {
            this.showNoUpcomingMessage();
            return;
        }
        
        this.hideNoUpcomingMessage();
        
        // Calculate responsive grid columns
        const gridCols = this.calculateGridColumns(this.upcomingConcerts.length);
        this.concertsContainer.className = `upcoming-concerts-grid ${gridCols}`;
        
        // Render each concert
        this.upcomingConcerts.forEach(concert => {
            const concertElement = this.createConcertElement(concert);
            this.concertsContainer.appendChild(concertElement);
        });
    }

    /**
     * Calculate responsive grid columns based on concert count
     */
    calculateGridColumns(concertCount) {
        if (concertCount === 1) return 'grid-1';
        if (concertCount === 2) return 'grid-2';
        if (concertCount === 3) return 'grid-3';
        if (concertCount === 4) return 'grid-4';
        return 'grid-5'; // 5 or more
    }

    /**
     * Create HTML element for a concert with image support
     */
    createConcertElement(concert) {
        const concertEl = document.createElement('div');
        concertEl.className = 'upcoming-concert-card';
        
        // Add source indicator class
        if (concert.source) {
            concertEl.classList.add(`source-${concert.source}`);
        }
        
        // Add image-aware class
        if (concert.hasImages) {
            concertEl.classList.add('has-images');
        }
        
        // Create image container
        const imageContainer = this.createImageContainer(concert);
        
        // Create concert card structure
        const concertCard = document.createElement('div');
        concertCard.className = `concert-card ${concert.isPlaceholder ? 'placeholder' : ''}`;
        
        // Create links button if links exist
        const linksButtonHtml = (concert.links && concert.links.length > 0) ? 
            `<div class="concert-links">
                <button class="visit-website-btn" onclick="window.open('${concert.links[0].url}', '_blank')">
                    Visit Website
                </button>
            </div>` : '';

        // Create calendar widget design
        concertCard.innerHTML = `
            <div class="calendar-widget">
                <div class="calendar-date">
                    <div class="calendar-day">${this.extractDay(concert.date)}</div>
                    <div class="calendar-month">${this.extractMonth(concert.date)}</div>
                </div>
                <div class="calendar-info">
                    <div class="calendar-title">${concert.title}</div>
                    <div class="calendar-time">${this.extractTime(concert)}</div>
                    ${linksButtonHtml}
                </div>
            </div>
        `;
        
        // Append to main element
        concertEl.appendChild(concertCard);
        
        // Add click handler for potential modal functionality
        concertEl.addEventListener('click', () => this.handleConcertClick(concert));
        
        return concertEl;
    }
    
    /**
     * Create image container for concert with lazy loading
     */
    createImageContainer(concert) {
        if (!this.imagesEnabled || !this.imageManager) {
            // Fallback to simple image
            return `<div class="concert-image">
                <img src="${concert.image}" alt="${concert.title}" loading="lazy">
            </div>`;
        }
        
        // Use ImageManager for advanced image handling
        if (concert.hasImages && concert.images && concert.images.length > 0) {
            console.log(' Using Google Drive image for:', concert.title, concert.images[0]);
            const primaryImage = concert.images[0];
            return this.imageManager.createImageContainer(primaryImage, concert.title).outerHTML;
        } else if (concert.image) {
            // Use primary image (could be Google Drive URL from processEventImages)
            console.log(' Using primary image for:', concert.title, concert.image);
            const imageData = { url: concert.image };
            return this.imageManager.createImageContainer(imageData, concert.title).outerHTML;
        } else {
            // Use placeholder
            console.log(' Using placeholder for:', concert.title);
            const placeholderData = { url: concert.image || this.getDefaultPlaceholder(concert) };
            return this.imageManager.createImageContainer(placeholderData, concert.title).outerHTML;
        }
    }
    
    /**
     * Create image container element (DOM element, not HTML string)
     */
    createImageContainerElement(concert) {
        if (!this.imagesEnabled || !this.imageManager) {
            // Fallback to simple image container
            const container = document.createElement('div');
            container.className = 'concert-image';
            const img = document.createElement('img');
            img.src = concert.image;
            img.alt = concert.title;
            img.loading = 'lazy';
            container.appendChild(img);
            return container;
        }
        
        // Use ImageManager for advanced image handling
        if (concert.hasImages && concert.images && concert.images.length > 0) {
            console.log(' Creating DOM element for Google Drive image:', concert.title, concert.images[0]);
            const primaryImage = concert.images[0];
            return this.imageManager.createImageContainer(primaryImage, concert.title);
        } else if (concert.image) {
            // Use primary image (could be Google Drive URL from processEventImages)
            console.log(' Creating DOM element for primary image:', concert.title, concert.image);
            const imageData = { url: concert.image };
            return this.imageManager.createImageContainer(imageData, concert.title);
        } else {
            // Use placeholder
            console.log(' Creating DOM element for placeholder:', concert.title);
            const placeholderData = { url: this.getDefaultPlaceholder(concert) };
            return this.imageManager.createImageContainer(placeholderData, concert.title);
        }
    }

    /**
     * Get default placeholder image URL for concert
     */
    getDefaultPlaceholder(concert) {
        const eventName = encodeURIComponent(concert.title || 'Concert');
        return `https://via.placeholder.com/400x300/f0f0f0/666?text=${eventName}`;
    }

    /**
     * Handle concert card click
     */
    handleConcertClick(concert) {
        this.showSimpleModal(concert);
    }
    
    showSimpleModal(concert) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.simple-concert-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'simple-concert-modal';
        modal.innerHTML = `
            <div class="simple-modal-content">
                <span class="simple-modal-close">&times;</span>
                <h2>${concert.title}</h2>
                <p><strong>Venue:</strong> ${concert.venue}</p>
                <p><strong>Date:</strong> ${concert.date}</p>
                <p><strong>Time:</strong> ${this.extractTime(concert)}</p>
                ${concert.description ? `<p><strong>Description:</strong> ${concert.description}</p>` : ''}
                ${concert.image ? `<img src="${concert.image}" alt="${concert.title}" style="max-width: 100%; margin-top: 1rem;">` : ''}
            </div>
        `;
        
        // Add to page
        document.body.appendChild(modal);
        
        // Show modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Close handlers
        const closeBtn = modal.querySelector('.simple-modal-close');
        closeBtn.onclick = () => this.closeSimpleModal();
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                this.closeSimpleModal();
            }
        };
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSimpleModal();
            }
        });
    }
    
    closeSimpleModal() {
        const modal = document.querySelector('.simple-concert-modal');
        if (modal) {
            modal.remove();
        }
        document.body.style.overflow = '';
    }    
    /**
     * Open concert details modal
     */
    openConcertModal(concert) {
        try {
            
            // Create modal if it doesn't exist
            if (!this.concertModal) {
                this.createConcertModal();
            }
            
            // Populate modal with concert data
            this.populateConcertModal(concert);
            
            // Show modal
            this.concertModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
        } catch (error) {
            // Silently handle errors
        }
    }
    
    /**
     * Create concert modal structure
     */
    createConcertModal() {
        const modal = document.createElement('div');
        modal.className = 'concert-modal';
        modal.innerHTML = `
            <div class="concert-modal-content">
                <span class="concert-modal-close">&times;</span>
                <div class="concert-modal-header">
                    <h2 class="concert-modal-title"></h2>
                    <div class="concert-modal-details"></div>
                </div>
                <div class="concert-modal-body">
                    <div class="concert-modal-image"></div>
                    <div class="concert-modal-description"></div>
                    <div class="concert-modal-calendar-info"></div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.concertModal = modal;
        
        // Add event listeners
        const closeBtn = modal.querySelector('.concert-modal-close');
        closeBtn.addEventListener('click', () => this.closeConcertModal());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeConcertModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                this.closeConcertModal();
            }
        });
    }
    
    /**
     * Populate modal with concert data
     */
    populateConcertModal(concert) {
        const modal = this.concertModal;
        
        // Title
        modal.querySelector('.concert-modal-title').textContent = concert.title;
        
        // Details
        const detailsEl = modal.querySelector('.concert-modal-details');
        detailsEl.innerHTML = `
            <p><strong>Venue:</strong> ${concert.venue}</p>
            <p><strong>Date:</strong> ${concert.date}</p>
            <p><strong>Time:</strong> ${this.extractTime(concert)}</p>
        `;
        
        // Image
        const imageEl = modal.querySelector('.concert-modal-image');
        if (concert.hasImages && this.imageManager) {
            const primaryImage = concert.images?.[0] || { url: concert.image };
            const imgContainer = this.imageManager.createImageContainer(primaryImage, concert.title);
            imageEl.innerHTML = '';
            imageEl.appendChild(imgContainer);
        } else if (concert.image) {
            imageEl.innerHTML = `<img src="${concert.image}" alt="${concert.title}" />`;
        } else {
            imageEl.innerHTML = '<div class="no-image">No image available</div>';
        }
        
        // Description
        const descEl = modal.querySelector('.concert-modal-description');
        descEl.innerHTML = `<p>${concert.description || 'No description available'}</p>`;
        
        // Google Calendar info
        const calendarEl = modal.querySelector('.concert-modal-calendar-info');
        if (concert.originalEvent) {
            const event = concert.originalEvent;
            calendarEl.innerHTML = `
                <div class="calendar-info">
                    <h4>Google Calendar Details</h4>
                    ${event.location ? `<p><strong>Location:</strong> ${event.location}</p>` : ''}
                    ${event.creator ? `<p><strong>Created by:</strong> ${event.creator.displayName || event.creator.email}</p>` : ''}
                    ${event.htmlLink ? `<p><a href="${event.htmlLink}" target="_blank">View in Google Calendar</a></p>` : ''}
                    ${event.hangoutLink ? `<p><a href="${event.hangoutLink}" target="_blank">Join Video Call</a></p>` : ''}
                </div>
            `;
        } else {
            calendarEl.innerHTML = '<p>No additional calendar information available</p>';
        }
    }
    
    /**
     * Close concert modal
     */
    closeConcertModal() {
        if (this.concertModal) {
            this.concertModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    /**
     * Extract day from date string
     */
    extractDay(dateString) {
        try {
            // Handle various date formats from Google Calendar API
            let date;
            
            // Try to parse Swedish format like "20 oktober 2025"
            if (typeof dateString === 'string' && dateString.includes(' ')) {
                const swedishMonths = {
                    'januari': 0, 'februari': 1, 'mars': 2, 'april': 3, 'maj': 4, 'juni': 5,
                    'juli': 6, 'augusti': 7, 'september': 8, 'oktober': 9, 'november': 10, 'december': 11
                };
                
                const parts = dateString.split(' ');
                if (parts.length >= 3) {
                    const day = parseInt(parts[0]);
                    const monthName = parts[1].toLowerCase();
                    const year = parseInt(parts[2]);
                    
                    if (swedishMonths.hasOwnProperty(monthName)) {
                        date = new Date(year, swedishMonths[monthName], day);
                    }
                }
            }
            
            // Fallback to standard date parsing
            if (!date || isNaN(date.getTime())) {
                date = new Date(dateString);
            }
            
            if (isNaN(date.getTime())) {
                return '01';
            }
            
            return date.getDate().toString().padStart(2, '0');
        } catch (error) {
            console.warn('Error extracting day from:', dateString, error);
            return '01';
        }
    }
    
    /**
     * Extract month from date string
     */
    extractMonth(dateString) {
        try {
            // Handle various date formats from Google Calendar API
            let date;
            
            // Try to parse Swedish format like "20 oktober 2025"
            if (typeof dateString === 'string' && dateString.includes(' ')) {
                const swedishMonths = {
                    'januari': 0, 'februari': 1, 'mars': 2, 'april': 3, 'maj': 4, 'juni': 5,
                    'juli': 6, 'augusti': 7, 'september': 8, 'oktober': 9, 'november': 10, 'december': 11
                };
                
                const parts = dateString.split(' ');
                if (parts.length >= 3) {
                    const day = parseInt(parts[0]);
                    const monthName = parts[1].toLowerCase();
                    const year = parseInt(parts[2]);
                    
                    if (swedishMonths.hasOwnProperty(monthName)) {
                        date = new Date(year, swedishMonths[monthName], day);
                    }
                }
            }
            
            // Fallback to standard date parsing
            if (!date || isNaN(date.getTime())) {
                date = new Date(dateString);
            }
            
            if (isNaN(date.getTime())) {
                return 'JAN';
            }
            
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 
                          'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            return months[date.getMonth()];
        } catch (error) {
            console.warn('Error extracting month from:', dateString, error);
            return 'JAN';
        }
    }
    
    /**
     * Extract time from concert data
     */
    extractTime(concert) {
        // Check if concert has explicit time property
        if (concert.time) {
            return concert.time;
        }
        
        // Try to extract time from originalEvent if available
        if (concert.originalEvent) {
            const event = concert.originalEvent;
            
            // Try startDate first (our transformed format)
            if (event.startDate) {
                try {
                    const date = new Date(event.startDate);
                    if (!isNaN(date.getTime())) {
                        return date.toLocaleTimeString('sv-SE', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false 
                        });
                    }
                } catch (error) {
                    console.warn('Error parsing startDate:', event.startDate, error);
                }
            }
            
            // Try original start.dateTime
            if (event.start && event.start.dateTime) {
                try {
                    const date = new Date(event.start.dateTime);
                    if (!isNaN(date.getTime())) {
                        return date.toLocaleTimeString('sv-SE', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: false 
                        });
                    }
                } catch (error) {
                    console.warn('Error parsing start.dateTime:', event.start.dateTime, error);
                }
            }
            
            // If it's an all-day event
            if (event.start && event.start.date) {
                return 'All Day';
            }
        }
        
        return 'Time TBA';
    }

    /**
     * Show loading state
     */
    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'block';
        }
        this.hideError();
        this.hideNoUpcomingMessage();
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
    }

    /**
     * Show error state
     */
    showError(message) {
        if (this.errorElement) {
            const errorMsg = this.errorElement.querySelector('p');
            if (errorMsg) {
                errorMsg.textContent = ` ${message}`;
            }
            this.errorElement.style.display = 'block';
        }
        this.hideLoading();
        this.hideNoUpcomingMessage();
        console.error(' Concert Manager Error:', message);
    }

    /**
     * Hide error state
     */
    hideError() {
        if (this.errorElement) {
            this.errorElement.style.display = 'none';
        }
    }

    /**
     * Show no upcoming concerts message
     */
    showNoUpcomingMessage() {
        if (this.noUpcomingMessage) {
            this.noUpcomingMessage.style.display = 'block';
        }
    }

    /**
     * Hide no upcoming concerts message
     */
    hideNoUpcomingMessage() {
        if (this.noUpcomingMessage) {
            this.noUpcomingMessage.style.display = 'none';
        }
    }

    /**
     * Set up automatic refresh
     */
    setupAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        const intervalMs = this.refreshIntervalMinutes * 60 * 1000;
        
        this.refreshInterval = setInterval(async () => {
            console.log(' Auto-refreshing concerts and checking for expired events...');
            await this.loadConcerts(); // This will also check for expired concerts
        }, intervalMs);
        
        console.log(` Auto-refresh set for every ${this.refreshIntervalMinutes} minutes`);
    }

    /**
     * Set up frequent checks for expired concerts (every 4 hours)
     */
    setupExpiredChecks() {
        if (this.expiredCheckInterval) {
            clearInterval(this.expiredCheckInterval);
        }
        
        // Check for expired concerts every 24 hours (same as main refresh to minimize API calls)
        const checkIntervalMs = 24 * 60 * 60 * 1000; // 24 hours
        
        this.expiredCheckInterval = setInterval(async () => {
            console.log(' Checking for expired concerts...');
            await this.checkAndMoveExpiredConcerts();
        }, checkIntervalMs);
        
        console.log(' Expired concert checks set for every 24 hours');
    }

    /**
     * Force refresh concerts (for manual testing)
     */
    async forceRefresh() {
        console.log(' Force refreshing concerts...');
        
        if (this.calendarAPI) {
            this.upcomingConcerts = await this.calendarAPI.forceRefresh();
            this.renderConcerts();
        } else {
            await this.loadConcerts();
        }
    }

    /**
     * Render carousel with dynamic past concerts
     */
    renderCarousel() {
        const carouselTrack = document.getElementById('carouselTrack');
        if (!carouselTrack) {
            console.warn(' Carousel track not found, skipping carousel rendering');
            return;
        }

        console.log(' Rendering dynamic carousel with', this.pastConcerts.length, 'past concerts');

        // Only replace carousel if we have actual data to replace it with
        if (this.pastConcerts.length === 0) {
            console.log(' No past concerts to render, keeping static carousel');
            return;
        }

        // Check if concerts are from static fallback (meaning API is not configured)
        const hasStaticData = this.pastConcerts.some(c => c.source === 'static-fallback');
        if (hasStaticData && !this.calendarAPI.isConfigured) {
            console.log(' API not configured and using static data, keeping existing HTML carousel');
            return;
        }

        // Clear existing slides (except clones which will be recreated)
        const existingSlides = carouselTrack.querySelectorAll('.carousel-slide:not(.clone)');
        existingSlides.forEach(slide => slide.remove());

        // Add dynamic past concerts
        this.pastConcerts.forEach(concert => {
            const slide = this.createCarouselSlide(concert);
            carouselTrack.appendChild(slide);
        });

        // Update global concert data for modal functionality
        this.updateGlobalConcertData();

        // Reinitialize carousel if needed
        if (window.initCarousel) {
            console.log(' Reinitializing carousel with new data');
            setTimeout(() => window.initCarousel(), 100);
        }
    }

    /**
     * Render static carousel as fallback
     */
    renderStaticCarousel() {
        console.log(' Using static carousel as fallback');
        // The static carousel is already in the HTML, so we don't need to do anything
        // This method exists for consistency and future enhancements
    }

    /**
     * Create carousel slide for a concert
     */
    createCarouselSlide(concert) {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'concert-card-link';
        link.onclick = (e) => {
            e.preventDefault();
            if (window.openModal && concert.id) {
                window.openModal(concert.id);
            }
            return false;
        };

        const card = document.createElement('div');
        card.className = 'concert-card';

        // Add image
        const img = document.createElement('img');
        img.src = concert.image || this.getDefaultPlaceholder(concert);
        img.alt = concert.title;
        img.loading = 'lazy';
        card.appendChild(img);

        // Add concert info
        const info = document.createElement('div');
        info.className = 'concert-info';
        info.innerHTML = `
            <h3 class="text-xl">${concert.title}</h3>
            <p class="text-sm">${concert.venue}</p>
            <span class="concert-date small">${concert.date}</span>
        `;
        card.appendChild(info);

        link.appendChild(card);
        slide.appendChild(link);

        return slide;
    }

    /**
     * Check for expired concerts and move them to past carousel (NO API CALLS - uses existing data only)
     */
    async checkAndMoveExpiredConcerts() {
        console.log(' Checking for expired concerts (no API calls - using cached data only)...');
        
        // Only check existing loaded concerts - NO new API calls
        if (this.upcomingConcerts.length === 0) {
            console.log(' No upcoming concerts loaded, skipping expired check');
            return { moved: 0, expiredConcerts: [] };
        }
        
        const now = new Date();
        const expiredConcerts = [];
        const stillUpcoming = [];
        
        // Check each upcoming concert
        this.upcomingConcerts.forEach(concert => {
            if (this.isConcertExpired(concert, now)) {
                console.log(` Concert expired: ${concert.title} on ${concert.date}`);
                expiredConcerts.push(concert);
            } else {
                stillUpcoming.push(concert);
            }
        });
        
        if (expiredConcerts.length > 0) {
            console.log(` Moving ${expiredConcerts.length} expired concerts to past carousel`);
            
            // Update upcoming concerts list (remove expired)
            this.upcomingConcerts = stillUpcoming;
            
            // Add expired concerts to past concerts (at the beginning for most recent)
            this.pastConcerts = [...expiredConcerts, ...this.pastConcerts];
            
            // Limit past concerts to 9 most recent
            this.pastConcerts = this.pastConcerts.slice(0, 9);
            
            // Re-render both sections
            this.renderConcerts(); // Re-render upcoming section
            this.renderCarousel(); // Re-render past carousel
            
            // Cache the updated past concerts
            const cacheKey = 'arvid_portfolio_past_concerts';
            this.calendarAPI.cacheData(this.pastConcerts, cacheKey);
            
            // Automatically add to Past Concerts page archive
            await this.addToPastConcertsArchive(expiredConcerts);
            
            console.log(` Moved ${expiredConcerts.length} concerts to past carousel`);
            
            return {
                moved: expiredConcerts.length,
                expiredConcerts: expiredConcerts.map(c => ({ title: c.title, date: c.date }))
            };
        } else {
            console.log(' No expired concerts found');
            return { moved: 0, expiredConcerts: [] };
        }
    }
    
    /**
     * Check if a concert date has passed
     */
    isConcertExpired(concert, now = new Date()) {
        if (!concert.originalEvent?.startDate) {
            // For static/fallback data, try to parse the date string
            return this.parseConcertDate(concert.date) < now;
        }
        
        // For Google Calendar events, use the proper startDate
        const concertDate = new Date(concert.originalEvent.startDate);
        
        // Add a small buffer (e.g., 6 hours after event start) to account for concert duration
        const bufferHours = 6;
        const concertEndEstimate = new Date(concertDate.getTime() + (bufferHours * 60 * 60 * 1000));
        
        return concertEndEstimate < now;
    }
    
    /**
     * Parse concert date string to Date object
     */
    parseConcertDate(dateString) {
        if (!dateString) return new Date(0); // Very old date as fallback
        
        try {
            // Handle various date formats
            if (dateString.includes('TBA') || dateString.includes('to be announced')) {
                return new Date('2099-12-31'); // Future date for TBA events
            }
            
            // Try to parse Swedish month names
            const swedishMonths = {
                'januari': 'January', 'februari': 'February', 'mars': 'March',
                'april': 'April', 'maj': 'May', 'juni': 'June',
                'juli': 'July', 'augusti': 'August', 'september': 'September',
                'oktober': 'October', 'november': 'November', 'december': 'December'
            };
            
            let normalizedDate = dateString.toLowerCase();
            Object.entries(swedishMonths).forEach(([swedish, english]) => {
                normalizedDate = normalizedDate.replace(swedish, english);
            });
            
            // Try direct parsing
            const parsed = new Date(normalizedDate);
            if (!isNaN(parsed.getTime())) {
                return parsed;
            }
            
            // Fallback: extract year and assume it's in the past if year < current year
            const yearMatch = dateString.match(/\b(20\d{2})\b/);
            if (yearMatch) {
                const year = parseInt(yearMatch[1]);
                const currentYear = new Date().getFullYear();
                if (year < currentYear) {
                    return new Date(year, 11, 31); // End of that year
                } else if (year > currentYear) {
                    return new Date(year, 0, 1); // Beginning of that year
                }
            }
            
            // Very basic fallback
            return new Date(dateString);
            
        } catch (error) {
            console.warn('Failed to parse concert date:', dateString, error);
            return new Date(0); // Default to very old date
        }
    }

    /**
     * Update global concert data for modal system
     */
    updateGlobalConcertData() {
        if (!window.concertData) {
            window.concertData = {};
        }
        if (!window.concertOrder) {
            window.concertOrder = [];
        }

        // Clear existing dynamic data
        Object.keys(window.concertData).forEach(key => {
            if (key.startsWith('calendar-') || key.startsWith('static-past-')) {
                delete window.concertData[key];
            }
        });
        
        // Clear existing order
        window.concertOrder = [];

        // Add past concerts to global data
        this.pastConcerts.forEach(concert => {
            window.concertData[concert.id] = {
                title: concert.title,
                venue: concert.venue,
                date: concert.date,
                description: concert.description,
                image: concert.image || this.getDefaultPlaceholder(concert)
            };
            window.concertOrder.push(concert.id);
        });

        console.log(' Updated global concert data with', this.pastConcerts.length, 'past concerts');
    }

    /**
     * Restore static carousel (emergency fallback)
     */
    restoreStaticCarousel() {
        console.log(' Restoring static carousel...');
        
        // Clear any dynamic content
        this.pastConcerts = [];
        
        // Force reload the page to restore original HTML
        console.log(' Reloading page to restore static carousel...');
        window.location.reload();
    }

    /**
     * Get current status for debugging
     */
    getStatus() {
        return {
            isLoading: this.isLoading,
            isLoadingPast: this.isLoadingPast,
            upcomingConcertCount: this.upcomingConcerts.length,
            pastConcertCount: this.pastConcerts.length,
            upcomingWithImages: this.upcomingConcerts.filter(c => c.hasImages).length,
            pastWithImages: this.pastConcerts.filter(c => c.hasImages).length,
            refreshInterval: this.refreshIntervalMinutes,
            imagesEnabled: this.imagesEnabled,
            calendarAPI: this.calendarAPI?.getStatus(),
            imageManager: this.imageManager?.getStatus(),
            lastRefresh: new Date().toLocaleString()
        };
    }

    /**
     * Cleanup method
     */
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        if (this.expiredCheckInterval) {
            clearInterval(this.expiredCheckInterval);
            this.expiredCheckInterval = null;
        }
        
        // Remove global functions
        if (window.refreshConcerts) {
            delete window.refreshConcerts;
        }
        if (window.refreshPastConcerts) {
            delete window.refreshPastConcerts;
        }
        if (window.checkExpiredConcerts) {
            delete window.checkExpiredConcerts;
        }
        
        console.log(' Concert Manager destroyed');
    }
}

// Add automatic archiving methods to ConcertManager prototype
ConcertManager.prototype.addToPastConcertsArchive = async function(concerts) {
    try {
        console.log(' Automatically archiving expired concerts...');
        
        // Get existing archive from localStorage
        const existingArchive = JSON.parse(localStorage.getItem('pastConcertsArchive') || '[]');
        
        concerts.forEach(concert => {
            // Check if concert already exists in archive
            const exists = existingArchive.find(existing => existing.id === concert.id);
            if (!exists) {
                const archivedConcert = {
                    id: concert.id,
                    title: concert.title,
                    venue: concert.venue,
                    date: concert.date,
                    image: concert.image,
                    archivedDate: new Date().toISOString(),
                    source: 'auto-archived'
                };
                
                existingArchive.unshift(archivedConcert); // Add to beginning (most recent first)
                console.log(` Archived: ${concert.title}`);
            }
        });
        
        // Save updated archive
        localStorage.setItem('pastConcertsArchive', JSON.stringify(existingArchive));
        
        // If we're currently on the Past Concerts page, update it immediately
        if (window.location.pathname.includes('past-concerts.html')) {
            this.updatePastConcertsPageWithArchive();
        }
        
        console.log(` Successfully archived ${concerts.length} concerts`);
        
    } catch (error) {
        console.error(' Error archiving concerts:', error);
    }
};

ConcertManager.prototype.updatePastConcertsPageWithArchive = function() {
    try {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) {
            return;
        }
        
        // Get archived concerts
        const archive = JSON.parse(localStorage.getItem('pastConcertsArchive') || '[]');
        
        archive.forEach(concert => {
            // Check if already displayed
            const existingTitles = Array.from(galleryGrid.querySelectorAll('h3')).map(h3 => h3.textContent);
            
            if (!existingTitles.includes(concert.title)) {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item auto-archived';
                galleryItem.innerHTML = `
                    <img src="${concert.image || `https://via.placeholder.com/800x600/f0f0f0/666?text=${encodeURIComponent(concert.title)}`}" alt="${concert.title}" loading="lazy">
                    <h3>${concert.title}</h3>
                `;
                
                // Add at the beginning for most recent first
                galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild);
                
                // Add subtle fade-in animation
                galleryItem.style.opacity = '0';
                galleryItem.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    galleryItem.style.transition = 'all 0.5s ease';
                    galleryItem.style.opacity = '1';
                    galleryItem.style.transform = 'scale(1)';
                }, 100);
            }
        });
        
    } catch (error) {
        console.error(' Error updating Past Concerts page:', error);
    }
};

ConcertManager.prototype.initPastConcertsPage = function() {
    if (window.location.pathname.includes('past-concerts.html')) {
        console.log(' Initializing Past Concerts page with archived concerts...');
        this.updatePastConcertsPageWithArchive();
    }
};

// Export for use in other modules
window.ConcertManager = ConcertManager;