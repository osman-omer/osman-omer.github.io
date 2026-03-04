class PortfolioSlider {
    constructor(sliderId, dotsContainerId) {
        this.slider = document.getElementById(sliderId);
        this.dotsContainer = document.getElementById(dotsContainerId);
        this.dots = this.dotsContainer ? this.dotsContainer.querySelectorAll('.dot') : [];
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.isDragging = false;
        this.isHovered = false;

        if (!this.slider || this.dots.length === 0) return;
        this.init();
    }

    init() {
        this.setupScrollListener();
        this.setupDotsNavigation();
        this.setupTouchEvents();
        this.setupWheelEvents();
        this.setupHoverTracking();
        this.updateDots();
        this.ensureIndicator();
        this.slider.setAttribute('tabindex', '0');
    }

    setupHoverTracking() {
        this.slider.addEventListener('mouseenter', () => {
            sliders.forEach(s => s.isHovered = false);
            this.isHovered = true;
        });
        this.slider.addEventListener('mouseleave', () => {
            this.isHovered = false;
        });
        this.slider.addEventListener('touchstart', () => {
            sliders.forEach(s => s.isHovered = false);
            this.isHovered = true;
        }, { passive: true });
    }

    setupScrollListener() {
        this.slider.addEventListener('scroll', () => {
            requestAnimationFrame(() => this.updateDots());
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
            this.isDragging = false;
        }, { passive: true });

        this.slider.addEventListener('touchmove', () => {
            this.isDragging = true;
            requestAnimationFrame(() => this.updateDots());
        }, { passive: true });

        this.slider.addEventListener('touchend', (e) => {
            if (!this.touchStartX) return;
            const swipeDistance = this.touchStartX - e.changedTouches[0].clientX;

            if (this.isDragging && Math.abs(swipeDistance) > 30) {
                if (swipeDistance > 0 && this.currentIndex < this.dots.length - 1) {
                    this.scrollToIndex(this.currentIndex + 1);
                } else if (swipeDistance < 0 && this.currentIndex > 0) {
                    this.scrollToIndex(this.currentIndex - 1);
                } else {
                    this.scrollToIndex(this.currentIndex);
                }
            }

            this.touchStartX = 0;
            this.isDragging = false;
            setTimeout(() => this.updateDots(), 350);
        }, { passive: true });
    }

    setupWheelEvents() {
        let wheelTimer;
        this.slider.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                clearTimeout(wheelTimer);
                wheelTimer = setTimeout(() => this.updateDots(), 80);
            }
        }, { passive: false });
    }

    scrollToIndex(index) {
        const total = this.dots.length;
        if (index < 0 || index >= total) return;
        const maxScroll = this.slider.scrollWidth - this.slider.clientWidth;
        const targetScroll = (index / (total - 1)) * maxScroll;
        this.slider.scrollTo({ left: targetScroll, behavior: 'smooth' });
        this.currentIndex = index;
        this.syncDots();
        this.updateIndicator();
    }

    updateDots() {
        if (!this.dots.length) return;
        const total = this.dots.length;
        const maxScroll = this.slider.scrollWidth - this.slider.clientWidth;
        if (maxScroll <= 0) return;
        const ratio = this.slider.scrollLeft / maxScroll;
        const index = Math.min(Math.round(ratio * (total - 1)), total - 1);
        this.currentIndex = index;
        this.syncDots();
        this.updateIndicator();
    }

    syncDots() {
        this.dots.forEach((dot, i) => dot.classList.toggle('active', i === this.currentIndex));
    }

    ensureIndicator() {
        if (!this.dotsContainer.querySelector('.slider-nav-indicator')) {
            const indicator = document.createElement('span');
            indicator.className = 'slider-nav-indicator';
            this.dotsContainer.appendChild(indicator);
        }
        this.updateIndicator();
    }

    updateIndicator() {
        const indicator = this.dotsContainer.querySelector('.slider-nav-indicator');
        if (indicator) indicator.textContent = `${this.currentIndex + 1}/${this.dots.length}`;
    }

    nextSlide() {
        if (this.currentIndex < this.dots.length - 1) this.scrollToIndex(this.currentIndex + 1);
    }

    prevSlide() {
        if (this.currentIndex > 0) this.scrollToIndex(this.currentIndex - 1);
    }
}

const sliders = [];

function initSliders() {
    sliders.length = 0;
    ['slider', 'inference-slider', 'linear-reg-slider', 'advanced-slider'].forEach((id, i) => {
        const dotsId = ['slider-dots', 'inference-dots', 'linear-reg-dots', 'advanced-dots'][i];
        const s = new PortfolioSlider(id, dotsId);
        if (s.slider) sliders.push(s);
    });
}

document.addEventListener('keydown', function(e) {
    if (e.target.matches('input, textarea, [contenteditable="true"]')) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const target = sliders.find(s => s.isHovered) || sliders.find(s => s.slider === document.activeElement);
    if (!target) return;
    e.preventDefault();
    e.key === 'ArrowRight' ? target.nextSlide() : target.prevSlide();
});

document.addEventListener('DOMContentLoaded', function() {
    initSliders();
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

window.addEventListener('resize', () => sliders.forEach(s => s.slider && s.updateDots()));
