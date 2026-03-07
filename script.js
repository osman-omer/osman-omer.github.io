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
        this.isScrolling = false;
        this.setupScrollListener();
        this.setupDotsNavigation();
        this.setupButtonNavigation();
        this.setupTouchEvents();
        this.updateDots();
        this.ensureIndicator();
        
        setTimeout(() => this.updateDots(), 100);
        setTimeout(() => this.updateDots(), 300);
        setTimeout(() => this.updateDots(), 500);
    }
    
    setupScrollListener() {
        this.slider.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                this.isScrolling = true;
                requestAnimationFrame(() => {
                    this.updateDots();
                    this.isScrolling = false;
                });
            }
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
                } else {
                    setTimeout(() => this.updateDots(), 50);
                }
            } else {
                setTimeout(() => this.updateDots(), 50);
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
        
        setTimeout(() => this.updateDots(), 100);
        setTimeout(() => this.updateDots(), 300);
    }
    
    updateDots() {
        if (this.dots.length === 0) return;
        
        const cardWidth = this.slider.querySelector('.project-card')?.offsetWidth;
        if (!cardWidth) return;
        
        const scrollLeft = this.slider.scrollLeft;
        const rawIndex = scrollLeft / cardWidth;
        let index = Math.round(rawIndex);
        
        index = Math.min(Math.max(index, 0), this.dots.length - 1);
        
        if (this.currentIndex !== index) {
            this.currentIndex = index;
            
            this.dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            this.updateIndicator();
        } else {
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
        
        let activeSlider = null;
        
        activeSlider = document.querySelector('.slides-container:focus');
        
        if (!activeSlider) {
            activeSlider = document.querySelector('.slides-container:hover');
        }
        
        if (!activeSlider && sliders.length > 0) {
            activeSlider = sliders[0].slider;
        }
        
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

setInterval(() => {
    sliders.forEach(slider => {
        if (slider.slider) {
            slider.updateDots();
        }
    });
}, 1000);

document.addEventListener('DOMContentLoaded', function() {
    initSliders();
    
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    document.querySelectorAll('.slides-container').forEach(slider => {
        slider.setAttribute('tabindex', '0');
    });
    
    setTimeout(() => {
        if (sliders.length > 0 && sliders[0].slider) {
            sliders[0].slider.focus();
        }
        sliders.forEach(slider => {
            if (slider.slider) {
                slider.updateDots();
            }
        });
    }, 500);
});

window.addEventListener('resize', function() {
    sliders.forEach(slider => {
        if (slider.slider) {
            slider.updateDots();
        }
    });
});

window.addEventListener('scroll', function() {
    sliders.forEach(slider => {
        if (slider.slider) {
            slider.updateDots();
        }
    });
}, { passive: true });
