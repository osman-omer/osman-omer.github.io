class SliderManager {
    constructor(sliderId, dotsContainerId) {
        this.slider = document.getElementById(sliderId);
        this.dots = document.querySelectorAll(`#${dotsContainerId} .dot`);
        this.currentIndex = 0;
        this.isTouchDevice = 'ontouchstart' in window;
        
        if (this.slider && this.dots.length > 0) {
            this.initialize();
        }
    }
    
    initialize() {
        this.setupScrollListener();
        this.setupDotsNavigation();
        this.setupTouchEvents();
        this.updateUI();
    }
    
    setupScrollListener() {
        let timer;
        this.slider.addEventListener('scroll', () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                this.updateUI();
            }, 100);
        });
    }
    
    setupDotsNavigation() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.scrollToSlide(index);
            });
        });
    }
    
    setupTouchEvents() {
        if (!this.isTouchDevice) return;
        
        let startX = 0;
        let isDragging = false;
        
        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        this.slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        this.slider.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const threshold = 50;
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0 && this.currentIndex < this.dots.length - 1) {
                    this.scrollToSlide(this.currentIndex + 1);
                } else if (diff < 0 && this.currentIndex > 0) {
                    this.scrollToSlide(this.currentIndex - 1);
                }
            }
            
            isDragging = false;
        });
    }
    
    scrollToSlide(index) {
        this.currentIndex = index;
        const cardWidth = this.slider.querySelector('.project-card').offsetWidth;
        
        this.slider.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
        
        this.updateUI();
    }
    
    updateUI() {
        const index = Math.round(this.slider.scrollLeft / this.slider.offsetWidth);
        this.currentIndex = index;
        
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        this.updateIndicator();
    }
    
    updateIndicator() {
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
            this.scrollToSlide(this.currentIndex + 1);
        }
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.scrollToSlide(this.currentIndex - 1);
        }
    }
}

class PortfolioApp {
    constructor() {
        this.sliders = [];
        this.initialize();
    }
    
    initialize() {
        this.setupCurrentYear();
        this.setupTheme();
        this.setupSliders();
        this.setupKeyboardNavigation();
        this.optimizeForMobile();
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
    
    setupSliders() {
        const edaSlider = new SliderManager('slider', 'slider-dots');
        const inferenceSlider = new SliderManager('inference-slider', 'inference-dots');
        
        this.sliders.push(edaSlider, inferenceSlider);
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.target.matches('input, textarea, [contenteditable="true"]')) return;
            
            const activeSlider = document.querySelector('.slides-container:hover');
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
    
    optimizeForMobile() {
        if ('ontouchstart' in window) {
            const containers = document.querySelectorAll('.slides-container');
            containers.forEach(container => {
                container.style.scrollBehavior = 'auto';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});
