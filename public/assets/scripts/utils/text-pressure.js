/**
 * Interactive Text Pressure Effect
 * Vanilla JS conversion of React component with variable font support
 */

class TextPressure {
    constructor(options = {}) {
        this.options = {
            text: options.text || 'ARVID  EINARSSON',
            fontFamily: options.fontFamily || 'Compressa VF',
            fontUrl: options.fontUrl || 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',
            width: options.width !== false,
            weight: options.weight !== false,
            italic: options.italic !== false,
            alpha: options.alpha || false,
            flex: options.flex !== false,
            stroke: options.stroke || false,
            scale: options.scale || false,
            textColor: options.textColor || '#FFFFFF',
            strokeColor: options.strokeColor || '#FF0000',
            minFontSize: options.minFontSize || 48,
            container: options.container
        };
        
        this.mouse = { x: 0, y: 0 };
        this.cursor = { x: 0, y: 0 };
        this.fontSize = this.options.minFontSize;
        this.scaleY = 1;
        this.lineHeight = 1;
        this.spans = [];
        this.animationId = null;
        
        this.chars = this.options.text.split('');
        
        this.init();
    }
    
    init() {
        this.loadFont();
        this.createHTML();
        this.bindEvents();
        this.setSize();
        this.animate();
    }
    
    loadFont() {
        // Create font face CSS
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: '${this.options.fontFamily}';
                src: url('${this.options.fontUrl}') format('woff2');
                font-style: normal;
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }
    
    createHTML() {
        if (!this.options.container) {
            console.error('TextPressure: container element required');
            return;
        }
        
        // Clear container
        this.options.container.innerHTML = '';
        
        // Create title element
        this.titleElement = document.createElement('h1');
        this.titleElement.className = 'text-pressure-title';
        
        // Apply base styles
        Object.assign(this.titleElement.style, {
            fontFamily: this.options.fontFamily,
            textTransform: 'uppercase',
            fontSize: `${this.fontSize}px`,
            lineHeight: this.lineHeight,
            transform: `scale(1, ${this.scaleY})`,
            transformOrigin: 'center top',
            margin: '0',
            textAlign: 'center',
            userSelect: 'none',
            whiteSpace: window.innerWidth <= 768 ? 'normal' : 'nowrap',
            fontWeight: '700',
            width: '100%',
            color: this.options.textColor,
            fontVariationSettings: "'wght' 700, 'wdth' 100, 'ital' 0"
        });
        
        if (this.options.flex) {
            this.titleElement.style.display = 'flex';
            this.titleElement.style.justifyContent = 'space-between';
        }
        
        // Create character spans
        this.chars.forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            span.style.position = 'relative';
            span.setAttribute('data-char', char);
            
            if (this.options.stroke) {
                span.style.color = this.options.textColor;
                // Add stroke effect with pseudo-element via CSS
                const strokeStyle = document.createElement('style');
                strokeStyle.textContent = `
                    .text-pressure-title span::after {
                        content: attr(data-char);
                        position: absolute;
                        left: 0;
                        top: 0;
                        color: transparent;
                        z-index: -1;
                        -webkit-text-stroke-width: 3px;
                        -webkit-text-stroke-color: ${this.options.strokeColor};
                        text-stroke-width: 3px;
                        text-stroke-color: ${this.options.strokeColor};
                    }
                `;
                document.head.appendChild(strokeStyle);
            }
            
            this.titleElement.appendChild(span);
            this.spans.push(span);
        });
        
        this.options.container.appendChild(this.titleElement);
    }
    
    bindEvents() {
        // Mouse move handler
        this.handleMouseMove = (e) => {
            this.cursor.x = e.clientX;
            this.cursor.y = e.clientY;
        };
        
        // Touch move handler
        this.handleTouchMove = (e) => {
            if (e.touches[0]) {
                this.cursor.x = e.touches[0].clientX;
                this.cursor.y = e.touches[0].clientY;
            }
        };
        
        // Resize handler
        this.handleResize = () => {
            // Update whitespace property on resize
            if (this.titleElement) {
                this.titleElement.style.whiteSpace = window.innerWidth <= 768 ? 'normal' : 'nowrap';
            }
            this.setSize();
        };
        
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('touchmove', this.handleTouchMove, { passive: true });
        window.addEventListener('resize', this.handleResize);
        
        // Initialize cursor position
        const rect = this.options.container.getBoundingClientRect();
        this.mouse.x = rect.left + rect.width / 2;
        this.mouse.y = rect.top + rect.height / 2;
        this.cursor.x = this.mouse.x;
        this.cursor.y = this.mouse.y;
    }
    
    setSize() {
        if (!this.options.container || !this.titleElement) return;

        const containerRect = this.options.container.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Responsive font size calculation based on screen size
        let baseFontSize;
        if (vw <= 576) {
            // Mobile: larger font size for better visibility
            baseFontSize = Math.min(vw * 0.20, vh * 0.12);
        } else if (vw <= 768) {
            // Tablet: medium-large font size
            baseFontSize = Math.min(vw * 0.15, vh * 0.15);
        } else {
            // Desktop: large font size
            baseFontSize = Math.min(vw * 0.10, vh * 0.18);
        }

        // Ensure minimum readability
        this.fontSize = Math.max(baseFontSize, this.options.minFontSize);

        // Adjust text to fit container width with padding
        const maxWidth = containerRect.width * 0.9; // 90% of container width for padding
        this.titleElement.style.fontSize = `${this.fontSize}px`;

        // Check if text overflows and scale down if needed
        requestAnimationFrame(() => {
            const textRect = this.titleElement.getBoundingClientRect();
            if (textRect.width > maxWidth) {
                const scale = maxWidth / textRect.width;
                this.fontSize = this.fontSize * scale;
                this.titleElement.style.fontSize = `${this.fontSize}px`;
            }
        });

        this.scaleY = 1;
        this.lineHeight = 1;

        this.titleElement.style.transform = `scale(1, ${this.scaleY})`;
        this.titleElement.style.lineHeight = this.lineHeight;
        
        // Handle scaling
        if (this.options.scale) {
            requestAnimationFrame(() => {
                const textRect = this.titleElement.getBoundingClientRect();
                if (textRect.height > 0) {
                    const yRatio = containerRect.height / textRect.height;
                    this.scaleY = yRatio;
                    this.lineHeight = yRatio;
                    this.titleElement.style.transform = `scale(1, ${this.scaleY})`;
                    this.titleElement.style.lineHeight = this.lineHeight;
                }
            });
        }
    }
    
    dist(a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    animate() {
        // Smooth cursor following
        this.mouse.x += (this.cursor.x - this.mouse.x) / 15;
        this.mouse.y += (this.cursor.y - this.mouse.y) / 15;
        
        if (this.titleElement) {
            const titleRect = this.titleElement.getBoundingClientRect();
            const maxDist = titleRect.width / 2;
            
            this.spans.forEach(span => {
                const rect = span.getBoundingClientRect();
                const charCenter = {
                    x: rect.x + rect.width / 2,
                    y: rect.y + rect.height / 2
                };
                
                const d = this.dist(this.mouse, charCenter);
                
                const getAttr = (distance, minVal, maxVal) => {
                    const val = maxVal - Math.abs((maxVal * distance) / maxDist);
                    return Math.max(minVal, val + minVal);
                };
                
                const wdth = this.options.width ? Math.floor(getAttr(d, 5, 200)) : 100;
                const wght = this.options.weight ? Math.floor(getAttr(d, 700, 900)) : 700;
                const italVal = this.options.italic ? getAttr(d, 0, 1).toFixed(2) : 0;
                const alphaVal = this.options.alpha ? getAttr(d, 0, 1).toFixed(2) : 1;
                
                span.style.opacity = alphaVal;
                span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
            });
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('resize', this.handleResize);
        
        if (this.options.container) {
            this.options.container.innerHTML = '';
        }
    }
}

// Export for use
window.TextPressure = TextPressure;