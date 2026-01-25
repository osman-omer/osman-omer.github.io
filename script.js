class PortfolioSlider {
    constructor(sliderId, dotsContainerId) {
        this.slider = document.getElementById(sliderId);
        this.dots = document.querySelectorAll(`#${dotsContainerId} .dot`);
        this.currentIndex = 0;
        
        if (this.slider && this.dots.length > 0) {
            this.init();
        }
    }
    
    init() {
        this.setupScrollListener();
        this.setupDotsNavigation();
        this.setupMobileTouch();
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
    
    setupMobileTouch() {
        let startX = 0;
        let isDragging = false;
        
        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.slider.style.scrollBehavior = 'auto';
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
                    this.scrollToIndex(this.currentIndex + 1);
                } else if (diff < 0 && this.currentIndex > 0) {
                    this.scrollToIndex(this.currentIndex - 1);
                }
            }
            
            isDragging = false;
            setTimeout(() => {
                this.slider.style.scrollBehavior = 'smooth';
            }, 100);
        });
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
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});
