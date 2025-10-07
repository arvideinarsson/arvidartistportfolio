/**
 * Gallery System for Arvid's Portfolio
 * Handles image gallery display, modal functionality, and automatic image switching
 */

class Gallery {
    constructor() {
        this.images = [];
        this.currentIndex = 0;
        this.modal = null;
        this.init();
    }

    init() {
        this.collectImages();
        this.setupEventListeners();
        this.setupModal();
        this.checkForRealImages();
        console.log('Gallery initialized with', this.images.length, 'images');
    }

    /**
     * Collect all gallery images
     */
    collectImages() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        this.images = Array.from(galleryItems).map((item, index) => {
            const img = item.querySelector('img');
            const overlay = item.querySelector('.gallery-overlay');
            const title = overlay ? overlay.querySelector('h3')?.textContent || '' : '';
            const description = overlay ? overlay.querySelector('p')?.textContent || '' : '';
            
            return {
                index,
                src: img.src,
                alt: img.alt,
                title,
                description,
                placeholder: img.dataset.placeholder,
                element: item
            };
        });
    }

    /**
     * Setup event listeners for gallery items
     */
    setupEventListeners() {
        this.images.forEach((image, index) => {
            image.element.addEventListener('click', () => {
                this.openModal(index);
            });
        });
    }

    /**
     * Setup modal elements
     */
    setupModal() {
        this.modal = document.getElementById('galleryModal');
        this.modalImage = document.getElementById('galleryModalImage');
        this.modalTitle = document.getElementById('galleryModalTitle');
        this.modalDescription = document.getElementById('galleryModalDescription');
        
        // Close button
        const closeBtn = document.querySelector('.gallery-modal-close');
        closeBtn.addEventListener('click', () => this.closeModal());
        
        // Navigation buttons
        const prevBtn = document.getElementById('galleryPrevBtn');
        const nextBtn = document.getElementById('galleryNextBtn');
        
        prevBtn.addEventListener('click', () => this.previousImage());
        nextBtn.addEventListener('click', () => this.nextImage());
        
        // Close on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display === 'flex') {
                switch(e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowLeft':
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });
    }

    /**
     * Open modal with specific image
     */
    openModal(index) {
        this.currentIndex = index;
        this.updateModal();
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close modal
     */
    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    /**
     * Update modal content
     */
    updateModal() {
        const image = this.images[this.currentIndex];
        
        this.modalImage.src = image.src;
        this.modalImage.alt = image.alt;
        this.modalTitle.textContent = image.title;
        this.modalDescription.textContent = image.description;
    }

    /**
     * Navigate to previous image
     */
    previousImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateModal();
    }

    /**
     * Navigate to next image
     */
    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateModal();
    }

    /**
     * Check for real images and replace placeholders
     */
    checkForRealImages() {
        this.images.forEach((image, index) => {
            if (image.placeholder) {
                this.checkImageExists(image.placeholder).then(exists => {
                    if (exists) {
                        console.log(`Found real image: ${image.placeholder}`);
                        this.replaceImage(index, image.placeholder);
                    }
                }).catch(() => {
                    // Keep placeholder if real image doesn't exist
                });
            }
        });
    }

    /**
     * Check if image file exists
     */
    checkImageExists(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => reject(false);
            img.src = src;
        });
    }

    /**
     * Replace placeholder with real image
     */
    replaceImage(index, newSrc) {
        const image = this.images[index];
        const imgElement = image.element.querySelector('img');
        
        // Update image source
        imgElement.src = newSrc;
        image.src = newSrc;
        
        // Add fade-in effect
        imgElement.style.opacity = '0';
        setTimeout(() => {
            imgElement.style.transition = 'opacity 0.5s ease';
            imgElement.style.opacity = '1';
        }, 100);
    }

    /**
     * Add new image to gallery (for dynamic additions)
     */
    addImage(src, title, description, targetSection = 'performance') {
        const galleryGrid = document.querySelector(`.gallery-grid`);
        if (!galleryGrid) return;

        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${src}" alt="${title}" loading="lazy">
            <div class="gallery-overlay">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;

        galleryGrid.appendChild(galleryItem);

        // Re-initialize to include new image
        this.images = [];
        this.collectImages();
        this.setupEventListeners();
    }

    /**
     * Get gallery status
     */
    getStatus() {
        return {
            totalImages: this.images.length,
            currentIndex: this.currentIndex,
            realImages: this.images.filter(img => !img.src.includes('placeholder')).length,
            placeholderImages: this.images.filter(img => img.src.includes('placeholder')).length
        };
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gallery = new Gallery();
});

// Add to window for debugging
window.Gallery = Gallery;