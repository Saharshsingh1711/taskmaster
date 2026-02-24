// script.js
// Interactive animations and functionality for the website

document.addEventListener('DOMContentLoaded', () => {

    // 1. Intersection Observer for scroll animations (mostly for Home page cards)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation to elements with class 'card'
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${index * 0.15}s`;
        observer.observe(card);
    });

    // 2. Real-time Analytics Bar Animation (Home Page)
    // Find the analytics graph bars in the 'wide-card'
    const bars = document.querySelectorAll('.wide-card div > div[style*="background: var(--accent)"]');
    if (bars.length > 0) {
        setInterval(() => {
            bars.forEach(bar => {
                const randomHeight = Math.floor(Math.random() * 60) + 30; // Between 30% and 90%
                bar.style.height = `${randomHeight}%`;
                bar.style.transition = 'height 0.6s ease-in-out';
            });
        }, 1200);
    }

    // 3. Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
