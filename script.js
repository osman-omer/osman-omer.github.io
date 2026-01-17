document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const dots = document.querySelectorAll('.dot');
    const currentYearEl = document.getElementById('currentYear');
    
    if (slider && dots.length > 0) {
        const updateDots = () => {
            const index = Math.round(slider.scrollLeft / slider.offsetWidth);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };
        
        let scrollTimer;
        slider.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(updateDots, 100);
        });
        
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                slider.scrollTo({
                    left: i * slider.offsetWidth,
                    behavior: 'smooth'
                });
            });
        });
    }
    
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        lazyImages.forEach(img => {
            img.loading = 'lazy';
        });
    }
    
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
});
