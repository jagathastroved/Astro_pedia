import { getHomaSlug, updateSEO } from './utils.js';
import { validateHomaData } from './validator.js';
import { renderPage } from './renderer.js';
import { initAnimations } from './animations.js';

// Import data index (which maps slugs to data objects)
import { homaDataMap } from '../data/index.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const slug = getHomaSlug();
        const homaData = homaDataMap[slug];

        if (!homaData) {
            throw new Error(`Data for Homa '${slug}' not found.`);
        }

        if (!validateHomaData(homaData)) {
            console.warn('Homa data validation failed or is missing recommended fields.');
        }

        // Render UI
        renderPage(homaData);

        // Update SEO
        updateSEO(homaData);

        // Show main container, hide error
        document.getElementById('app-container').classList.remove('opacity-0');
        document.getElementById('error-state').classList.add('hidden');

        // Initialize animations after rendering
        setTimeout(initAnimations, 100);

        // Sticky CTA logic
        const stickyCta = document.getElementById('sticky-cta');
        const heroBtn = document.getElementById('hero-cta-btn');
        
        if (stickyCta && heroBtn) {
            const observer = new IntersectionObserver((entries) => {
                if (!entries[0].isIntersecting) {
                    // Hero CTA is out of view, show sticky
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
            observer.observe(heroBtn);
        }

    } catch (error) {
        console.error('Application Error:', error);
        document.getElementById('app-container').classList.add('hidden');
        document.getElementById('error-state').classList.remove('hidden');
        document.getElementById('error-message').textContent = error.message;
    }
});
