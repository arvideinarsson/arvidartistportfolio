/**
 * Image Management System for Concert Images
 * Handles image loading, lazy loading, fallbacks, and optimization
 */

class ImageManager {
    constructor(config = {}) {
        this.config = {
            enableLazyLoading: config.enableLazyLoading || window.ENV?.LAZY_LOADING_ENABLED || true,
            fallbackUrl: config.fallbackUrl || window.ENV?.IMAGE_FALLBACK_URL || '/src/assets/images/concerts/default-concert-poster.jpg',
            maxImageSize: config.maxImageSize || window.ENV?.MAX_IMAGE_SIZE || 800,
            ...config
        };
        
        this.imageCache = new Map();
        this.lazyLoadObserver = null;
        this.loadingImages = new Set();
        
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        console.log(' Image Manager initialized');
    }
    
    /**
     * Setup intersection observer for lazy loading
     */
    setupLazyLoading() {
        if (!this.config.enableLazyLoading || !window.IntersectionObserver) {
            return;
        }
        
        this.lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadLazyImage(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
    }
    
    /**
     * Process Google Drive attachment URLs to direct image URLs
     * @param {Array} attachments - Google Calendar event attachments
     * @returns {Array} Processed image data
     */
    processEventAttachments(attachments) {
        if (!attachments || !Array.isArray(attachments)) {
            return [];
        }
        
        const imageAttachments = attachments.filter(attachment => {
            const mimeType = attachment.mimeType || '';
            return mimeType.startsWith('image/');
        });
        
        return imageAttachments.map(attachment => ({
            url: this.convertDriveUrl(attachment.fileUrl),
            title: attachment.title || 'Concert Image',
            mimeType: attachment.mimeType,
            originalUrl: attachment.fileUrl
        }));
    }
    
    /**
     * Convert Google Drive URLs to direct image URLs
     * @param {string} driveUrl - Original Google Drive URL
     * @returns {string} Direct image URL
     */
    convertDriveUrl(driveUrl) {
        if (!driveUrl) return this.config.fallbackUrl;
        
        console.log('🔗 Converting Drive URL:', driveUrl);
        
        // Extract file ID from various Google Drive URL formats
        let fileId = null;
        
        // Handle Google Drive file URLs
        const fileIdMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
        if (fileIdMatch) {
            fileId = fileIdMatch[1];
        }
        
        // Handle Google Drive open URLs
        const openMatch = driveUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
        if (openMatch && !fileId) {
            fileId = openMatch[1];
        }
        
        if (fileId) {
            // Try multiple URL formats for better compatibility
            const formats = [
                `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
                `https://drive.google.com/uc?export=view&id=${fileId}`,
                `https://lh3.googleusercontent.com/d/${fileId}=w800`
            ];
            
            // Use the first format and log all alternatives
            console.log(' Primary URL:', formats[0]);
            console.log('🔄 Alternative URLs available:', formats.slice(1));
            return formats[0];
        }
        
        // Handle already converted uc URLs
        if (driveUrl.includes('drive.google.com/uc')) {
            console.log(' URL already in uc format, extracting ID for thumbnail');
            const ucMatch = driveUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
            if (ucMatch) {
                const thumbnailUrl = `https://drive.google.com/thumbnail?id=${ucMatch[1]}&sz=w800`;
                console.log(' Converted uc URL to thumbnail:', thumbnailUrl);
                return thumbnailUrl;
            }
            return driveUrl;
        }
        
        console.log(' Could not extract file ID, using original:', driveUrl);
        return driveUrl;
    }
    
    /**
     * Create image element with lazy loading and error handling
     * @param {Object} imageData - Image data object
     * @param {string} altText - Alt text for accessibility
     * @param {string} className - CSS class name
     * @returns {HTMLElement} Image element
     */
    createImageElement(imageData, altText = '', className = 'concert-image') {
        const img = document.createElement('img');
        const imageUrl = imageData?.url || this.config.fallbackUrl;
        
        // Generate meaningful alt text
        const finalAltText = altText || imageData?.title || 'Concert image';
        
        img.className = `${className} ${this.config.enableLazyLoading ? 'lazy' : ''}`;
        img.alt = finalAltText;
        img.loading = 'lazy'; // Native lazy loading as fallback
        
        // Set up error handling
        img.onerror = () => this.handleImageError(img);
        
        if (this.config.enableLazyLoading) {
            img.dataset.src = imageUrl;
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';
            this.observeLazyImage(img);
        } else {
            img.src = imageUrl;
        }
        
        return img;
    }
    
    /**
     * Create image container with skeleton loading
     * @param {Object} imageData - Image data object
     * @param {string} altText - Alt text for accessibility
     * @returns {HTMLElement} Image container element
     */
    createImageContainer(imageData, altText = '') {
        const container = document.createElement('div');
        container.className = 'concert-image-container';
        
        // Add skeleton loader
        const skeleton = document.createElement('div');
        skeleton.className = 'image-skeleton';
        container.appendChild(skeleton);
        
        // Add image
        const img = this.createImageElement(imageData, altText);
        container.appendChild(img);
        
        // Hide skeleton when image loads
        img.onload = () => {
            skeleton.style.display = 'none';
            img.classList.add('loaded');
        };
        
        return container;
    }
    
    /**
     * Observe image for lazy loading
     * @param {HTMLElement} img - Image element
     */
    observeLazyImage(img) {
        if (this.lazyLoadObserver) {
            this.lazyLoadObserver.observe(img);
        }
    }
    
    /**
     * Load lazy image
     * @param {HTMLElement} img - Image element
     */
    loadLazyImage(img) {
        if (this.loadingImages.has(img)) return;
        
        this.loadingImages.add(img);
        
        const imageUrl = img.dataset.src;
        if (imageUrl) {
            img.src = imageUrl;
            img.classList.remove('lazy');
            
            img.onload = () => {
                this.loadingImages.delete(img);
                img.classList.add('loaded');
            };
            
            img.onerror = () => {
                this.loadingImages.delete(img);
                this.handleImageError(img);
            };
        }
        
        if (this.lazyLoadObserver) {
            this.lazyLoadObserver.unobserve(img);
        }
    }
    
    /**
     * Handle image loading errors
     * @param {HTMLElement} img - Image element that failed to load
     */
    handleImageError(img) {
        img.src = this.config.fallbackUrl;
        img.classList.add('fallback-image');
        img.alt = 'Concert image not available';
        
        // Show skeleton as placeholder if fallback also fails
        img.onerror = () => {
            img.style.display = 'none';
            const container = img.closest('.concert-image-container');
            if (container) {
                const skeleton = container.querySelector('.image-skeleton');
                if (skeleton) {
                    skeleton.style.display = 'block';
                    skeleton.classList.add('error-state');
                }
            }
        };
    }
    
    /**
     * Preload image for better performance
     * @param {string} imageUrl - Image URL to preload
     * @returns {Promise} Promise that resolves when image is loaded
     */
    preloadImage(imageUrl) {
        if (this.imageCache.has(imageUrl)) {
            return Promise.resolve(this.imageCache.get(imageUrl));
        }
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.imageCache.set(imageUrl, true);
                resolve(img);
            };
            
            img.onerror = () => {
                this.imageCache.set(imageUrl, false);
                reject(new Error(`Failed to load image: ${imageUrl}`));
            };
            
            img.src = imageUrl;
        });
    }
    
    /**
     * Validate if image URL is accessible
     * @param {string} imageUrl - Image URL to validate
     * @returns {Promise<boolean>} Promise that resolves to true if image is accessible
     */
    async validateImageUrl(imageUrl) {
        try {
            console.log('🔍 Attempting to validate image:', imageUrl);
            await this.preloadImage(imageUrl);
            console.log(' Image validation successful:', imageUrl);
            return true;
        } catch (error) {
            console.warn(' Image validation failed, will try alternative approaches:', imageUrl, error.message);
            
            // For Google Drive images, try thumbnail format as fallback
            if (imageUrl.includes('drive.google.com')) {
                const fileIdMatch = imageUrl.match(/[?&]id=([a-zA-Z0-9-_]+)/);
                if (fileIdMatch) {
                    try {
                        const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w400`;
                        console.log('🔄 Trying thumbnail format:', thumbnailUrl);
                        await this.preloadImage(thumbnailUrl);
                        console.log(' Thumbnail validation successful');
                        return true;
                    } catch (thumbError) {
                        console.warn(' Thumbnail validation also failed:', thumbError.message);
                    }
                }
            }
            
            return false;
        }
    }
    
    /**
     * Get the best image from multiple options
     * @param {Array} imageOptions - Array of image objects
     * @returns {Object|null} Best available image or null
     */
    async getBestImage(imageOptions) {
        if (!imageOptions || imageOptions.length === 0) {
            return null;
        }
        
        // Try images in order until one works
        for (const imageOption of imageOptions) {
            if (await this.validateImageUrl(imageOption.url)) {
                return imageOption;
            }
        }
        
        return null;
    }
    
    /**
     * Generate responsive image attributes
     * @param {Object} imageData - Image data object
     * @returns {Object} Responsive image attributes
     */
    getResponsiveImageAttributes(imageData) {
        const baseUrl = imageData.url;
        
        return {
            src: baseUrl,
            sizes: '(max-width: 576px) 100vw, (max-width: 768px) 50vw, 33vw',
            loading: 'lazy'
        };
    }
    
    /**
     * Clean up resources
     */
    destroy() {
        if (this.lazyLoadObserver) {
            this.lazyLoadObserver.disconnect();
            this.lazyLoadObserver = null;
        }
        
        this.imageCache.clear();
        this.loadingImages.clear();
        
        console.log(' Image Manager destroyed');
    }
    
    /**
     * Get image manager status for debugging
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            lazyLoadingEnabled: this.config.enableLazyLoading,
            imagesInCache: this.imageCache.size,
            imagesLoading: this.loadingImages.size,
            fallbackUrl: this.config.fallbackUrl,
            maxImageSize: this.config.maxImageSize
        };
    }
}

// Export for use in other modules
window.ImageManager = ImageManager;