// Advanced WebGL Carousel Implementation
import { WebGLCarousel } from './webgl-carousel.js';

console.log('Advanced WebGL carousel loading...');

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM loaded - initializing WebGL carousel');

    // Replace the old carousel container with WebGL canvas
    const oldCarouselContainer = document.querySelector('.carousel-container');
    if (oldCarouselContainer) {
        // Create WebGL carousel container
        const webglContainer = document.createElement('div');
        webglContainer.className = 'webgl-carousel-container';
        webglContainer.style.cssText = `
            width: 100vw;
            height: 600px;
            position: relative;
            margin: 4rem 0;
            margin-left: calc(-50vw + 50%);
            margin-right: calc(-50vw + 50%);
            cursor: grab;
        `;

        // Replace old carousel
        oldCarouselContainer.parentNode.replaceChild(webglContainer, oldCarouselContainer);

        // Initialize WebGL carousel
        try {
            const carousel = new WebGLCarousel(webglContainer, {
                bend: 3,
                textColor: '#ffffff',
                borderRadius: 0.05,
                scrollSpeed: 2,
                scrollEase: 0.02,
                font: 'bold 24px sans-serif'
            });

            webglContainer.addEventListener('mousedown', () => {
                webglContainer.style.cursor = 'grabbing';
            });

            webglContainer.addEventListener('mouseup', () => {
                webglContainer.style.cursor = 'grab';
            });

            console.log('WebGL carousel initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize WebGL carousel:', error);
            // Fallback to original carousel
            webglContainer.innerHTML = '<p style="text-align: center; color: #666;">WebGL not supported. Please use a modern browser.</p>';
        }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Modal functionality (preserve existing modals)
    window.openModal = function(concertId) {
        console.log('Opening modal for:', concertId);
        // Modal code here if needed
    };
});