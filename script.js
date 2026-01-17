// Slider Logic for Osman's Portfolio
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const dots = document.querySelectorAll('.dot');

    if (slider) {
        const updateDots = () => {
            const index = Math.round(slider.scrollLeft / slider.offsetWidth);
            dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        };

        slider.addEventListener('scroll', updateDots);

        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                slider.scrollTo({ left: i * slider.offsetWidth, behavior: 'smooth' });
            });
        });

        // Keyboard Support (Arrow Keys)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') slider.scrollBy({ left: slider.offsetWidth, behavior: 'smooth' });
            if (e.key === 'ArrowLeft') slider.scrollBy({ left: -slider.offsetWidth, behavior: 'smooth' });
        });
    }
});
