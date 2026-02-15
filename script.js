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
            console.warn(`Slider "${sliderId}" or its dots not found. Skipping.`);
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
                this.updateIndicator();
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
        this.updateIndicator();
    }
    
    updateDots() {
        if (this.dots.length === 0) return;
        
        const scrollLeft = this.slider.scrollLeft;
        const cardWidth = this.slider.querySelector('.project-card').offsetWidth;
        const index = Math.round(scrollLeft / cardWidth);
        
        // التأكد من أن index ضمن النطاق الصحيح
        const validIndex = Math.min(Math.max(index, 0), this.dots.length - 1);
        this.currentIndex = validIndex;
        
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === validIndex);
        });
    }
    
    ensureIndicator() {
        // البحث عن المؤشر الموجود
        let indicator = this.dotsContainer.querySelector('.slider-nav-indicator');
        
        // إذا لم يكن موجوداً، نقوم بإنشائه
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

class PortfolioApp {
    constructor() {
        this.sliders = [];
        this.init();
    }
    
    init() {
        setTimeout(() => {
            this.setupSliders();
            this.setupKeyboardNavigation();
            this.setupCurrentYear();
            this.setupTheme();
            this.setupHoverEffects();
        }, 150);
    }
    
    setupSliders() {
        const edaSlider = new PortfolioSlider('slider', 'slider-dots');
        const inferenceSlider = new PortfolioSlider('inference-slider', 'inference-dots');
        const linearRegSlider = new PortfolioSlider('linear-reg-slider', 'linear-reg-dots');
        
        // إضافة السلايدرز فقط إذا كانت صالحة (تحتوي على عناصر)
        if (edaSlider.slider && edaSlider.dots.length > 0) this.sliders.push(edaSlider);
        if (inferenceSlider.slider && inferenceSlider.dots.length > 0) this.sliders.push(inferenceSlider);
        if (linearRegSlider.slider && linearRegSlider.dots.length > 0) this.sliders.push(linearRegSlider);
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // تجاهل إذا كان المستخدم يكتب في حقل إدخال
            if (e.target.matches('input, textarea, [contenteditable="true"]')) return;
            
            // البحث عن السلايدر النشط (الذي يحتوي على مؤشر الماوس)
            const activeSliderElement = document.querySelector('.slides-container:hover');
            
            if (!activeSliderElement) return;
            
            // البحث عن كائن السلايدر المطابق
            const sliderInstance = this.sliders.find(s => s.slider === activeSliderElement);
            if (!sliderInstance) return;
            
            // التعامل مع مفاتيح الأسهم
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
    
    setupHoverEffects() {
        const projectCards = document.querySelectorAll('.project-card:not(.coming-soon-card)');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 25px rgba(0, 86, 179, 0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
        });
        
        const comingSoonCard = document.querySelector('.coming-soon-card');
        if (comingSoonCard) {
            comingSoonCard.addEventListener('mouseenter', () => {
                const icon = comingSoonCard.querySelector('.coming-soon-icon');
                if (icon) {
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    icon.style.color = isDark ? '#60a5fa' : 'var(--primary-blue)';
                    icon.style.transform = 'scale(1.1)';
                }
            });
            
            comingSoonCard.addEventListener('mouseleave', () => {
                const icon = comingSoonCard.querySelector('.coming-soon-icon');
                if (icon) {
                    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    icon.style.color = isDark ? '#64748b' : '#94a3b8';
                    icon.style.transform = 'scale(1)';
                }
            });
        }
    }
}

// التأكد من تحميل الصفحة بالكامل قبل بدء التطبيق
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PortfolioApp());
} else {
    new PortfolioApp();
}
