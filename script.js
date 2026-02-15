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
        this.updateDots();
        this.ensureIndicator();
    }
    
    setupScrollListener() {
        let scrollTimer;
        this.slider.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                this.updateDots();
            }, 50);
        }, { passive: true });
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
        }, { passive: true });
        
        this.slider.addEventListener('touchmove', (e) => {
            if (!this.isDragging) {
                const touchX = e.touches[0].clientX;
                const diff = Math.abs(touchX - this.touchStartX);
                if (diff > 10) {
                    this.isDragging = true;
                }
            }
        }, { passive: true });
        
        this.slider.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        }, { passive: true });
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
        this.isDragging = false;
    }
    
    scrollToIndex(index) {
        const cardWidth = this.slider.querySelector('.project-card').offsetWidth;
        this.slider.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
        this.currentIndex = index;
        this.updateDots();
    }
    
    updateDots() {
        if (this.dots.length === 0) return;
        
        const cardWidth = this.slider.querySelector('.project-card').offsetWidth;
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

document.addEventListener('DOMContentLoaded', function() {
    const sliders = [
        new PortfolioSlider('slider', 'slider-dots'),
        new PortfolioSlider('inference-slider', 'inference-dots'),
        new PortfolioSlider('linear-reg-slider', 'linear-reg-dots')
    ];
    
    document.addEventListener('keydown', function(e) {
        if (e.target.matches('input, textarea, [contenteditable="true"]')) return;
        
        const activeSliderElement = document.querySelector('.slides-container:hover');
        if (!activeSliderElement) return;
        
        const activeSlider = sliders.find(s => s.slider === activeSliderElement);
        if (!activeSlider) return;
        
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            activeSlider.nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            activeSlider.prevSlide();
        }
    });
    
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
