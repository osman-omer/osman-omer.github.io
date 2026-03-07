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
        this.slider.addEventListener('scroll', () => {
            requestAnimationFrame(() => this.updateDots());
        }, { passive: true });
        
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToIndex(index);
            });
        });
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentIndex > 0) {
                    this.scrollToIndex(this.currentIndex - 1);
                }
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentIndex < this.dots.length - 1) {
                    this.scrollToIndex(this.currentIndex + 1);
                }
            });
        }
        
        this.slider.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        this.slider.addEventListener('touchmove', (e) => {
            if (!this.touchStartX) return;
            this.isDragging = true;
        }, { passive: true });
        
        this.slider.addEventListener('touchend', (e) => {
            if (!this.touchStartX || !this.isDragging) {
                this.touchStartX = 0;
                return;
            }
            
            this.touchEndX = e.changedTouches[0].clientX;
            const diff = this.touchStartX - this.touchEndX;
            
            if (Math.abs(diff) > 30) {
                if (diff > 0 && this.currentIndex < this.dots.length - 1) {
                    this.scrollToIndex(this.currentIndex + 1);
                } else if (diff < 0 && this.currentIndex > 0) {
                    this.scrollToIndex(this.currentIndex - 1);
                }
            }
            
            this.touchStartX = 0;
            this.isDragging = false;
        }, { passive: true });
        
        this.updateDots();
        this.ensureIndicator();
    }
    
    scrollToIndex(index) {
        const card = this.slider.querySelector('.project-card');
        if (!card) return;
        
        const cardWidth = card.offsetWidth;
        this.slider.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
    }
    
    updateDots() {
        if (this.dots.length === 0) return;
        
        const card = this.slider.querySelector('.project-card');
        if (!card) return;
        
        const cardWidth = card.offsetWidth;
        const index = Math.round(this.slider.scrollLeft / cardWidth);
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
}

const sliders = [];

function initSliders() {
    sliders.length = 0;
    
    const s1 = new PortfolioSlider('slider', 'slider-dots', 'slider-prev', 'slider-next');
    const s2 = new PortfolioSlider('inference-slider', 'inference-dots', 'inference-prev', 'inference-next');
    const s3 = new PortfolioSlider('linear-reg-slider', 'linear-reg-dots', 'linear-reg-prev', 'linear-reg-next');
    const s4 = new PortfolioSlider('advanced-slider', 'advanced-dots', 'advanced-prev', 'advanced-next');
    
    if (s1.slider) sliders.push(s1);
    if (s2.slider) sliders.push(s2);
    if (s3.slider) sliders.push(s3);
    if (s4.slider) sliders.push(s4);
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const active = document.querySelector('.slides-container:hover, .slides-container:focus');
        if (!active) return;
        
        const slider = sliders.find(s => s.slider === active);
        if (!slider) return;
        
        e.preventDefault();
        
        if (e.key === 'ArrowRight') {
            if (slider.currentIndex < slider.dots.length - 1) {
                slider.scrollToIndex(slider.currentIndex + 1);
            }
        } else {
            if (slider.currentIndex > 0) {
                slider.scrollToIndex(slider.currentIndex - 1);
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    initSliders();
    
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    
    document.querySelectorAll('.slides-container').forEach(s => {
        s.setAttribute('tabindex', '0');
    });
});

window.addEventListener('resize', function() {
    sliders.forEach(s => {
        if (s.slider) s.updateDots();
    });
});
