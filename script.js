class PortfolioSlider {
    constructor(sliderId, dotsContainerId, prevBtnId, nextBtnId) {
        this.slider = document.getElementById(sliderId);
        this.dotsContainer = document.getElementById(dotsContainerId);
        this.dots = this.dotsContainer ? this.dotsContainer.querySelectorAll('.dot') : [];
        this.prevBtn = document.getElementById(prevBtnId);
        this.nextBtn = document.getElementById(nextBtnId);
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
        this.setupButtonNavigation();
        this.setupTouchEvents();
        this.updateDots();
        this.ensureIndicator();
        
        setTimeout(() => this.updateDots(), 100);
        setTimeout(() => this.updateDots(), 300);
    }
    
    setupScrollListener() {
        this.slider.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                this.updateDots();
            });
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
    
    setupButtonNavigation() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }
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
        
        const scrollLeft = this.slider.scrollLeft;
        const index = Math.round(scrollLeft / cardWidth);
        const validIndex = Math.min(Math.max(index, 0), this.dots.length - 1);
        
        if (this.currentIndex !== validIndex) {
            this.currentIndex = validIndex;
            
            this.dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === validIndex);
            });
            
            this.updateIndicator();
        }
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
    
    const slider1 = new PortfolioSlider('slider', 'slider-dots', 'slider-prev', 'slider-next');
    const slider2 = new PortfolioSlider('inference-slider', 'inference-dots', 'inference-prev', 'inference-next');
    const slider3 = new PortfolioSlider('linear-reg-slider', 'linear-reg-dots', 'linear-reg-prev', 'linear-reg-next');
    const slider4 = new PortfolioSlider('advanced-slider', 'advanced-dots', 'advanced-prev', 'advanced-next');
    
    if (slider1.slider) sliders.push(slider1);
    if (slider2.slider) sliders.push(slider2);
    if (slider3.slider) sliders.push(slider3);
    if (slider4.slider) sliders.push(slider4);
}

document.addEventListener('keydown', function(e) {
    if (e.target.matches('input, textarea, [contenteditable="true"]')) return;
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        
        const activeSlider = document.querySelector('.slides-container:hover, .slides-container:focus');
        if (!activeSlider) return;
        
        const slider = sliders.find(s => s.slider === activeSlider);
        if (!slider) return;
        
        if (e.key === 'ArrowRight') {
            slider.nextSlide();
        } else {
            slider.prevSlide();
        }
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
