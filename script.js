class PortfolioSlider {
    constructor(sliderId, dotsContainerId) {
        this.slider = document.getElementById(sliderId);
        this.dotsContainer = document.getElementById(dotsContainerId);
        this.dots = this.dotsContainer ? this.dotsContainer.querySelectorAll('.dot') : [];
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isDragging = false;
        this.isActive = false; // FIX 2: track if this slider is "active/focused"

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
        this.setupFocusTracking(); // FIX 2: new focus tracking
        this.updateDots(true);
        this.ensureIndicator();
    }

    // FIX 2: Track which slider is active via hover AND focus
    setupFocusTracking() {
        // Mouse enter/leave to track hover
        this.slider.addEventListener('mouseenter', () => {
            sliders.forEach(s => s.isActive = false);
            this.isActive = true;
        });
        this.slider.addEventListener('mouseleave', () => {
            this.isActive = false;
        });

        // Click to also activate
        this.slider.addEventListener('click', () => {
            sliders.forEach(s => s.isActive = false);
            this.isActive = true;
            this.slider.focus();
        });

        // Touch start to activate
        this.slider.addEventListener('touchstart', () => {
            sliders.forEach(s => s.isActive = false);
            this.isActive = true;
        }, { passive: true });
    }

    setupScrollListener() {
        let scrollTimer;
        this.slider.addEventListener('scroll', () => {
            // FIX 1: Use requestAnimationFrame for more accurate dot updates during drag
            cancelAnimationFrame(scrollTimer);
            scrollTimer = requestAnimationFrame(() => {
                this.updateDots(false);
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

    setupTouchEvents() {
        this.slider.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.isDragging = false;
        }, { passive: true });

        this.slider.addEventListener('touchmove', (e) => {
            if (!this.touchStartX) return;
            const touchX = e.touches[0].clientX;
            const diff = Math.abs(touchX - this.touchStartX);
            if (diff > 5) {
                this.isDragging = true;
            }
            // FIX 1: Update dots in real-time during drag
            this.updateDots(false);
        }, { passive: true });

        this.slider.addEventListener('touchend', (e) => {
            if (!this.touchStartX) {
                return;
            }

            this.touchEndX = e.changedTouches[0].clientX;
            const swipeDistance = this.touchStartX - this.touchEndX;
            const swipeThreshold = 30;

            if (this.isDragging && Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0 && this.currentIndex < this.dots.length - 1) {
                    this.scrollToIndex(this.currentIndex + 1);
                } else if (swipeDistance < 0 && this.currentIndex > 0) {
                    this.scrollToIndex(this.currentIndex - 1);
                } else {
                    // Snap back to current index if no valid swipe target
                    this.scrollToIndex(this.currentIndex);
                }
            } else if (!this.isDragging) {
                // Just a tap, snap to nearest
                this.updateDots(true);
            }

            this.touchStartX = 0;
            this.isDragging = false;

            // FIX 1: final dot update after touch ends
            setTimeout(() => this.updateDots(true), 300);
        }, { passive: true });
    }

    setupWheelEvents() {
        let wheelTimer;
        this.slider.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                clearTimeout(wheelTimer);
                wheelTimer = setTimeout(() => {
                    this.updateDots(true);
                }, 50);
            }
        }, { passive: false });
    }

    scrollToIndex(index) {
        const cards = this.slider.querySelectorAll('.project-card');
        if (!cards[index]) return;

        // FIX 1: Use card's actual offsetLeft for precise positioning
        this.slider.scrollTo({
            left: cards[index].offsetLeft,
            behavior: 'smooth'
        });

        // Optimistically update dots immediately for responsiveness
        this.currentIndex = index;
        this.syncDots();
        this.updateIndicator();
    }

    // FIX 1: Improved dot update using actual card positions instead of math
    updateDots(snap = false) {
        if (this.dots.length === 0) return;

        const cards = this.slider.querySelectorAll('.project-card');
        if (!cards.length) return;

        const scrollLeft = this.slider.scrollLeft;
        const containerWidth = this.slider.offsetWidth;
        const center = scrollLeft + containerWidth / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        cards.forEach((card, i) => {
            const cardCenter = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(center - cardCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = i;
            }
        });

        const validIndex = Math.min(Math.max(closestIndex, 0), this.dots.length - 1);

        if (snap && validIndex !== this.currentIndex) {
            this.scrollToIndex(validIndex);
            return;
        }

        this.currentIndex = validIndex;
        this.syncDots();
        this.updateIndicator();
    }

    syncDots() {
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
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

// FIX 2: Keyboard arrows work on hover (no click needed)
document.addEventListener('keydown', function (e) {
    if (e.target.matches('input, textarea, [contenteditable="true"]')) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        // Find active slider (hovered or focused)
        let targetSlider = sliders.find(s => s.isActive);

        // Fallback: check if any slider is focused
        if (!targetSlider) {
            const focusedEl = document.activeElement;
            if (focusedEl && focusedEl.classList.contains('slides-container')) {
                targetSlider = sliders.find(s => s.slider === focusedEl);
            }
        }

        // No slider active, do nothing (don't scroll page)
        if (!targetSlider) return;

        e.preventDefault();

        if (e.key === 'ArrowRight') {
            targetSlider.nextSlide();
        } else {
            targetSlider.prevSlide();
        }
    }
});

document.addEventListener('DOMContentLoaded', function () {
    initSliders();

    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    document.querySelectorAll('.slides-container').forEach(slider => {
        slider.setAttribute('tabindex', '0');
    });

    // IMPROVEMENT: Add arrow key hint tooltip on sliders
    document.querySelectorAll('.slides-wrapper').forEach(wrapper => {
        const hint = document.createElement('div');
        hint.className = 'keyboard-hint';
        hint.innerHTML = '<i class="fas fa-keyboard"></i> ← →';
        wrapper.appendChild(hint);
    });
});

window.addEventListener('resize', function () {
    sliders.forEach(slider => {
        if (slider.slider) {
            slider.updateDots(false);
        }
    });
});
                
