document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const dots = document.querySelectorAll('.dot');
    
    if (!slider || dots.length === 0) return;
    
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
    
    const currentYear = document.getElementById('currentYear');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }
});
