import { CONFIG } from './config.js';

export function initAnimations() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
            }
        });
    }, CONFIG.ANIMATION_OBSERVER_OPTIONS);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .scale-in');
    animatedElements.forEach(el => observer.observe(el));
}
