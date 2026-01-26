class PortfolioSlider {
    constructor(sliderId, dotsContainerId) {
        this.slider = document.getElementById(sliderId);
        this.dots = document.querySelectorAll(`#${dotsContainerId} .dot`);
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isDragging = false;
        
        if (this.slider && this.dots.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.setupScrollListener();
        this.setupDotsNavigation();
        this.setupTouchEvents();
        this.updateDots();
        this.updateSliderIndicator();
    }
    
    setupScrollListener() {
        let scrollTimer;
        this.slider.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                this.updateDots();
                this.updateSliderIndicator();
            }, 100);
        });
    }
    
    setupDotsNavigation() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.scrollToIndex(index);
            });
        });
    }
    
    setupTouchEvents() {
        this.slider.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.isDragging = false;
        });
        
        this.slider.addEventListener('touchmove', (e) => {
            this.isDragging = true;
        });
        
        this.slider.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
    }
    
    handleSwipe() {
        if (!this.isDragging) return;
        
        const swipeThreshold = 50;
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && this.currentIndex < this.dots.length - 1) {
                this.scrollToIndex(this.currentIndex + 1);
            } else if (swipeDistance < 0 && this.currentIndex > 0) {
                this.scrollToIndex(this.currentIndex - 1);
            }
        }
    }
    
    scrollToIndex(index) {
        const cardWidth = this.slider.querySelector('.project-card').offsetWidth;
        this.slider.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
        this.currentIndex = index;
        this.updateDots();
        this.updateSliderIndicator();
    }
    
    updateDots() {
        const index = Math.round(this.slider.scrollLeft / this.slider.offsetWidth);
        this.currentIndex = index;
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    updateSliderIndicator() {
        const totalSlides = this.dots.length;
        const currentSlide = this.currentIndex + 1;
        
        let indicator = this.slider.parentElement.querySelector('.slider-nav-indicator');
        if (!indicator) {
            indicator = document.createElement('span');
            indicator.className = 'slider-nav-indicator';
            this.slider.parentElement.querySelector('.dots-container').appendChild(indicator);
        }
        indicator.textContent = `${currentSlide}/${totalSlides}`;
    }
    
    nextSlide() {
        if (this.currentIndex < this.dots.length - 1) {
            this.scrollToIndex(this.currentIndex + 1);
        }
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.scrollToIndex(this.currentIndex - 1);
        }
    }
}

class PortfolioApp {
    constructor() {
        this.sliders = [];
        this.init();
    }
    
    init() {
        this.setupSliders();
        this.setupKeyboardNavigation();
        this.setupCurrentYear();
        this.setupTheme();
        this.setupHoverEffects();
    }
    
    setupSliders() {
        const edaSlider = new PortfolioSlider('slider', 'slider-dots');
        const inferenceSlider = new PortfolioSlider('inference-slider', 'inference-dots');
        
        this.sliders.push(edaSlider, inferenceSlider);
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.target.matches('input, textarea, [contenteditable="true"]')) return;
            
            const activeSlider = document.querySelector('.slides-container:hover') || 
                               document.elementFromPoint(e.clientX, e.clientY)?.closest('.slides-container');
            
            if (!activeSlider) return;
            
            const sliderInstance = this.sliders.find(s => s.slider === activeSlider);
            if (!sliderInstance) return;
            
            switch(e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    sliderInstance.nextSlide();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    sliderInstance.prevSlide();
                    break;
            }
        });
    }
    
    setupCurrentYear() {
        const currentYearEl = document.getElementById('currentYear');
        if (currentYearEl) {
            currentYearEl.textContent = new Date().getFullYear();
        }
    }
    
    setupTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        const updateTheme = () => {
            const isDark = prefersDark.matches;
            document.documentElement.style.setProperty('--bg-page', isDark ? '#0f172a' : '#f8fafc');
            document.documentElement.style.setProperty('--bg-unit', isDark ? '#1e293b' : '#ffffff');
            document.documentElement.style.setProperty('--text-dark', isDark ? '#f1f5f9' : '#1e293b');
            document.documentElement.style.setProperty('--text-grey', isDark ? '#94a3b8' : '#64748b');
            document.documentElement.style.setProperty('--border', isDark ? '#334155' : '#e2e8f0');
        };
        
        prefersDark.addEventListener('change', updateTheme);
        updateTheme();
    }
    
    setupHoverEffects() {
        const projectCards = document.querySelectorAll('.project-card:not(.coming-soon-card)');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 25px rgba(0, 86, 179, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        });
        
        const comingSoonCard = document.querySelector('.coming-soon-card');
        if (comingSoonCard) {
            comingSoonCard.addEventListener('mouseenter', () => {
                const icon = comingSoonCard.querySelector('.coming-soon-icon');
                if (icon) {
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    icon.style.color = isDark ? '#60a5fa' : 'var(--primary-blue)';
                    icon.style.transform = 'scale(1.1)';
                }
            });
            
            comingSoonCard.addEventListener('mouseleave', () => {
                const icon = comingSoonCard.querySelector('.coming-soon-icon');
                if (icon) {
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    icon.style.color = isDark ? '#64748b' : '#94a3b8';
                    icon.style.transform = 'scale(1)';
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
    
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        lazyImages.forEach(img => {
            img.loading = 'lazy';
        });
    }
});
