// Osman Portfolio - Slider Logic v2.0
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const dots = document.querySelectorAll('.dot');

    if (slider && dots.length > 0) {
        // Function to update dots based on scroll position
        const updateDots = () => {
            const index = Math.round(slider.scrollLeft / slider.offsetWidth);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        // Sync dots when user scrolls or swipes
        slider.addEventListener('scroll', updateDots);

        // Allow clicking dots to navigate
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                slider.scrollTo({
                    left: i * slider.offsetWidth,
                    behavior: 'smooth'
                });
            });
        });
    }
});
