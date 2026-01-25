document.addEventListener('DOMContentLoaded', () => {
    // السلايدر الأول (EDA)
    const slider = document.getElementById('slider');
    const dots = document.querySelectorAll('.dots-container .dot');
    
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
        
        updateDots();
    }
    
    // السلايدر الثاني (Statistical Inference)
    const inferenceSlider = document.getElementById('inference-slider');
    const inferenceDots = document.querySelectorAll('#inference-dots .dot');
    
    if (inferenceSlider && inferenceDots.length > 0) {
        const updateInferenceDots = () => {
            const index = Math.round(inferenceSlider.scrollLeft / inferenceSlider.offsetWidth);
            inferenceDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };
        
        let inferenceScrollTimer;
        inferenceSlider.addEventListener('scroll', () => {
            clearTimeout(inferenceScrollTimer);
            inferenceScrollTimer = setTimeout(updateInferenceDots, 100);
        });
        
        inferenceDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                inferenceSlider.scrollTo({
                    left: i * inferenceSlider.offsetWidth,
                    behavior: 'smooth'
                });
            });
        });
        
        updateInferenceDots();
    }
    
    // تحديث السنة الحالية
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    
    // تحميل متأخر للصور
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        lazyImages.forEach(img => {
            img.loading = 'lazy';
        });
    }
    
    // نظام الوضع المظلم
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
    
    // تأثيرات hover للمشاريع
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
    
    // تأثيرات hover للـ Coming Soon
    const comingSoonCard = document.querySelector('.coming-soon-card');
    if (comingSoonCard) {
        comingSoonCard.addEventListener('mouseenter', () => {
            const icon = comingSoonCard.querySelector('.coming-soon-icon');
            if (icon) {
                icon.style.color = 'var(--primary-blue)';
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
});
