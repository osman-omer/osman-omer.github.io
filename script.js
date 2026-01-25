document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupCurrentYear();
    setupTheme();
    setupSliders();
    setupKeyboardNavigation();
    setupTouchOptimization();
}

function setupCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function setupTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function updateTheme() {
        const isDark = prefersDark.matches;
        document.documentElement.style.setProperty('--bg-page', isDark ? '#0f172a' : '#f8fafc');
        document.documentElement.style.setProperty('--bg-unit', isDark ? '#1e293b' : '#ffffff');
        document.documentElement.style.setProperty('--text-dark', isDark ? '#f1f5f9' : '#1e293b');
        document.documentElement.style.setProperty('--text-grey', isDark ? '#94a3b8' : '#64748b');
        document.documentElement.style.setProperty('--border', isDark ? '#334155' : '#e2e8f0');
    }
    
    prefersDark.addEventListener('change', updateTheme);
    updateTheme();
}

function setupSliders() {
    initSlider('slider', 'slider-dots');
    initSlider('inference-slider', 'inference-dots');
}

function initSlider(sliderId, dotsId) {
    const slider = document.getElementById(sliderId);
    const dots = document.querySelectorAll(`#${dotsId} .dot`);
    
    if (!slider || dots.length === 0) return;
    
    let currentIndex = 0;
    let touchStartX = 0;
    let isDragging = false;
    
    function updateDots() {
        const index = Math.round(slider.scrollLeft / slider.offsetWidth);
        currentIndex = index;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        updateIndicator(slider, dots.length, index);
    }
    
    function scrollToSlide(index) {
        const cardWidth = slider.querySelector('.project-card').offsetWidth;
        slider.scrollTo({
            left: index * cardWidth,
            behavior: 'smooth'
        });
        currentIndex = index;
        updateDots();
    }
    
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            scrollToSlide(i);
        });
    });
    
    slider.addEventListener('scroll', () => {
        requestAnimationFrame(updateDots);
    });
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
    });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        e.preventDefault();
        const touchX = e.touches[0].clientX;
        const diff = touchStartX - touchX;
        
        slider.scrollLeft += diff;
        touchStartX = touchX;
    });
    
    slider.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        isDragging = false;
        const endIndex = Math.round(slider.scrollLeft / slider.offsetWidth);
        
        if (endIndex !== currentIndex) {
            scrollToSlide(endIndex);
        } else {
            updateDots();
        }
    });
    
    updateDots();
}

function updateIndicator(slider, totalSlides, currentIndex) {
    const dotsContainer = slider.parentElement.querySelector('.dots-container');
    if (!dotsContainer) return;
    
    let indicator = dotsContainer.querySelector('.slider-nav-indicator');
    if (!indicator) {
        indicator = document.createElement('span');
        indicator.className = 'slider-nav-indicator';
        dotsContainer.appendChild(indicator);
    }
    
    indicator.textContent = `${currentIndex + 1}/${totalSlides}`;
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.target.matches('input, textarea, [contenteditable="true"]')) return;
        
        const activeSlider = document.querySelector('.slides-container:hover');
        if (!activeSlider) return;
        
        const dots = activeSlider.parentElement.querySelectorAll('.dot');
        if (dots.length === 0) return;
        
        const currentIndex = Math.round(activeSlider.scrollLeft / activeSlider.offsetWidth);
        
        if (e.key === 'ArrowRight' && currentIndex < dots.length - 1) {
            e.preventDefault();
            scrollToSlideIndex(activeSlider, currentIndex + 1);
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            scrollToSlideIndex(activeSlider, currentIndex - 1);
        }
    });
}

function scrollToSlideIndex(slider, index) {
    const cardWidth = slider.querySelector('.project-card').offsetWidth;
    slider.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
    });
}

function setupTouchOptimization() {
    if ('ontouchstart' in window) {
        document.documentElement.classList.add('touch-device');
        
        const containers = document.querySelectorAll('.slides-container');
        containers.forEach(container => {
            container.style.cursor = 'grab';
            
            container.addEventListener('touchstart', () => {
                container.style.cursor = 'grabbing';
            });
            
            container.addEventListener('touchend', () => {
                container.style.cursor = 'grab';
            });
        });
    }
}
