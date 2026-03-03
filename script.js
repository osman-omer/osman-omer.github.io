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
            if (!this.isDragging) return;
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        }, { passive: true });
    }
    
    handleSwipe() {
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
        if (!cardWidth) return;
        
        this.slider.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
        this.currentIndex = index;
        this.updateDots();
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

// تهيئة السلايدرز
const sliders = [];

function initSliders() {
    // مسح السلايدرز القديمة
    sliders.length = 0;
    
    // إنشاء سلايدرز جديدة
    const slider1 = new PortfolioSlider('slider', 'slider-dots');
    const slider2 = new PortfolioSlider('inference-slider', 'inference-dots');
    const slider3 = new PortfolioSlider('linear-reg-slider', 'linear-reg-dots');
    const slider4 = new PortfolioSlider('advanced-slider', 'advanced-dots');
    
    if (slider1.slider) sliders.push(slider1);
    if (slider2.slider) sliders.push(slider2);
    if (slider3.slider) sliders.push(slider3);
    if (slider4.slider) sliders.push(slider4);
}

// دعم أزرار الكيبورد لجميع السلايدرز
document.addEventListener('keydown', function(e) {
    if (e.target.matches('input, textarea, [contenteditable="true"]')) return;
    
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        // التمرير للأمام في كل السلايدرز المرئية
        sliders.forEach(slider => {
            if (slider.slider && isElementInViewport(slider.slider)) {
                slider.nextSlide();
            }
        });
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        // التمرير للخلف في كل السلايدرز المرئية
        sliders.forEach(slider => {
            if (slider.slider && isElementInViewport(slider.slider)) {
                slider.prevSlide();
            }
        });
    }
});

// التحقق إذا كان العنصر مرئيًا في الشاشة
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initSliders();
    
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// إعادة التهيئة عند تغيير حجم الشاشة (للموبايل)
window.addEventListener('resize', function() {
    // إعادة حساب الأبعاد للسلايدرز
    sliders.forEach(slider => {
        if (slider.slider) {
            slider.updateDots();
        }
    });
});
