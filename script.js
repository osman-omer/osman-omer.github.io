class PortfolioSlider {
    constructor(sliderId, dotsContainerId) {
        this.slider = document.getElementById(sliderId);
        this.dotsContainer = document.getElementById(dotsContainerId);
        this.dots = this.dotsContainer ? this.dotsContainer.querySelectorAll('.dot') : [];
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isDragging = false;
        
        if (!this.slider || this.dots.length === 0) {
            return;
        }
        
        this.init();
    }
    
    init() {
        this.setupScrollListener();
        this.setupDotsNavigation();
        this.setupTouchEvents();
        this.setupWheelEvents();
        this.updateDots();
        this.ensureIndicator();
    }
    
    setupScrollListener() {
        this.slider.addEventListener('scroll', () => {
            this.updateDots();
        }, { passive: true });
    }
    
    setupDotsNavigation() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToIndex(index);
            });
        });
    }
    
    setupTouchEvents() {
        this.slider.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        this.slider.addEventListener('touchmove', (e) => {
            if (!this.touchStartX) return;
            const touchX = e.touches[0].clientX;
            const diff = Math.abs(touchX - this.touchStartX);
            if (diff > 5) {
                this.isDragging = true;
            }
        }, { passive: true });
        
        this.slider.addEventListener('touchend', (e) => {
            if (!this.touchStartX || !this.isDragging) {
                this.touchStartX = 0;
                return;
            }
            
            this.touchEndX = e.changedTouches[0].clientX;
            const swipeDistance = this.touchStartX - this.touchEndX;
            const swipeThreshold = 30;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0 && this.currentIndex < this.dots.length - 1) {
                    this.scrollToIndex(this.currentIndex + 1);
                } else if (swipeDistance < 0 && this.currentIndex > 0) {
                    this.scrollToIndex(this.currentIndex - 1);
                }
            }
            
            this.touchStartX = 0;
            this.isDragging = false;
        }, { passive: true });
    }
    
    setupWheelEvents() {
        let wheelTimer;
        this.slider.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                clearTimeout(wheelTimer);
                wheelTimer = setTimeout(() => {
                    this.updateDots();
                }, 50);
            }
        }, { passive: false });
    }
    
    scrollToIndex(index) {
        const cardWidth = this.slider.querySelector('.project-card').offsetWidth;
        if (!cardWidth) return;
        
        this.slider.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
    }
    
    updateDots() {
        if (this.dots.length === 0) return;
        
        const cardWidth = this.slider.querySelector('.project-card')?.offsetWidth;
        if (!cardWidth) return;
        
        const index = Math.round(this.slider.scrollLeft / cardWidth);
        const validIndex = Math.min(Math.max(index, 0), this.dots.length - 1);
        this.currentIndex = validIndex;
        
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === validIndex);
        });
        
        this.updateIndicator();
    }
    
    ensureIndicator() {
        let indicator = this.dotsContainer.querySelector('.slider-nav-indicator');
        if (!indicator) {
            indicator = document.createElement('span');
            indicator.className = 'slider-nav-indicator';
            this.dotsContainer.appendChild(indicator);
        }
        this.updateIndicator();
    }
    
    updateIndicator() {
        const indicator = this.dotsContainer.querySelector('.slider-nav-indicator');
        if (indicator && this.dots.length > 0) {
            indicator.textContent = `${this.currentIndex + 1}/${this.dots.length}`;
        }
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

const sliders = [];

function initSliders() {
    sliders.length = 0;
    
    const slider1 = new PortfolioSlider('slider', 'slider-dots');
    const slider2 = new PortfolioSlider('inference-slider', 'inference-dots');
    const slider3 = new PortfolioSlider('linear-reg-slider', 'linear-reg-dots');
    const slider4 = new PortfolioSlider('advanced-slider', 'advanced-dots');
    
    if (slider1.slider) sliders.push(slider1);
    if (slider2.slider) sliders.push(slider2);
    if (slider3.slider) sliders.push(slider3);
    if (slider4.slider) sliders.push(slider4);
}

document.addEventListener('keydown', function(e) {
    if (e.target.matches('input, textarea, [contenteditable="true"]')) return;
    
    const activeSlider = document.querySelector('.slides-container:focus-within, .slides-container:hover');
    if (!activeSlider) return;
    
    const slider = sliders.find(s => s.slider === activeSlider);
    if (!slider) return;
    
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        slider.nextSlide();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        slider.prevSlide();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    initSliders();
    
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    document.querySelectorAll('.slides-container').forEach(slider => {
        slider.setAttribute('tabindex', '0');
    });
});

window.addEventListener('resize', function() {
    sliders.forEach(slider => {
        if (slider.slider) {
            slider.updateDots();
        }
    });
});
