import { escapeHTML, formatCurrency, setImage } from './utils.js';
import { CONFIG } from './config.js';
import { initCountdown } from './countdown.js';
import { initFAQ } from './faq.js';
import { initPackages } from './packages.js';

export function renderPage(data) {
    if (!data) return;

    // Update dynamic names globally
    document.querySelectorAll('.dynamic-homa-name').forEach(el => {
        el.textContent = data.title;
    });

    renderHero(data);
    renderTrust(data);
    renderBenefits(data);
    renderHomaBenefits(data);
    renderAbout(data);
    renderOccasion(data);
    renderRitualProcess(data);
    renderTemple(data);
    renderExperience(data);
    renderPackages(data);
    renderTrustSecurity(data);
    renderTestimonials(data);
    renderFaq(data);
    renderFinalCTA(data);

    // Initialize interactive components
    initFAQ();
    initPackages();
}

function renderHero(data) {
    document.getElementById('hero-label').textContent = data.occasionLabel || 'Sacred Occasion';
    document.getElementById('hero-title').textContent = data.title;
    document.getElementById('hero-subtitle').textContent = data.subtitle;
    document.getElementById('hero-temple').textContent = `${data.location?.templeName || ''}, ${data.location?.city || ''}`;
    document.getElementById('hero-date').textContent = `${data.date} • ${data.day}`;
    document.getElementById('hero-devotees').textContent = `${data.stats?.devotees || '1,00,000+'} Devotees participated`;
    
    // Set Images
    const basePath = CONFIG.ASSET_BASE_PATH + data.id + '/';
    const isMobile = window.innerWidth <= 768;
    const heroBgImage = isMobile && data.hero.mobileImage ? data.hero.mobileImage : data.hero.image;
    
    // We can use a CSS background or an image element. We are using an img element for the deity/visual.
    const deityImg = document.getElementById('hero-deity-img');
    setImage(deityImg, basePath + data.deity.image, data.deity.name, {
        lazy: false, // Eager load hero
        objectPosition: data.hero.objectPosition || 'center center'
    });

    // Countdown
    if (data.bookingCloseDate) {
        initCountdown(data.bookingCloseDate);
    }
}

function renderTrust(data) {
    const container = document.getElementById('trust-grid-container');
    if (!container || !data.trustStrip) return;
    
    let html = '';
    data.trustStrip.forEach(item => {
        html += `
            <div class="trust-item reveal scale-in">
                <span class="trust-icon">${item.icon || '✨'}</span>
                <span class="trust-text">${escapeHTML(item.text)}</span>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderBenefits(data) {
    const container = document.getElementById('benefits-container');
    if (!container || !data.benefits) return;

    let html = '';
    data.benefits.forEach((benefit, index) => {
        const delay = index * 100;
        html += `
            <div class="card reveal delay-${delay}">
                <div class="card-icon">${benefit.icon || '🙏'}</div>
                <h3 class="card-title">${escapeHTML(benefit.title)}</h3>
                <p class="card-desc">${escapeHTML(benefit.description)}</p>
                <button class="btn btn-text mt-2" onclick="this.nextElementSibling.classList.toggle('hidden'); this.style.display='none'">Read more ↓</button>
                <p class="card-desc hidden mt-2">${escapeHTML(benefit.fullDescription || benefit.description)}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderHomaBenefits(data) {
    const container = document.getElementById('homa-benefits-container');
    if (!container || !data.homaBenefits) return;

    let html = '';
    data.homaBenefits.forEach((benefit, index) => {
        const num = (index + 1).toString().padStart(2, '0');
        const delay = index * 100;
        html += `
            <div class="card reveal delay-${delay}" style="display:flex; align-items:flex-start; gap:1rem; margin-bottom:1rem;">
                <div class="step-number" style="width:40px;height:40px;font-size:1rem;margin:0;">${num}</div>
                <div>
                    <h3 class="card-title">${escapeHTML(benefit.title)}</h3>
                    <p class="card-desc">${escapeHTML(benefit.description)}</p>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderAbout(data) {
    if (!data.about) return;
    
    document.getElementById('about-title').textContent = data.about.title;
    document.getElementById('about-description').textContent = data.about.description;
    
    const pointsContainer = document.getElementById('about-points');
    pointsContainer.innerHTML = data.about.points.map(p => `<li>${escapeHTML(p)}</li>`).join('');
    
    const img = document.getElementById('about-image');
    const basePath = CONFIG.ASSET_BASE_PATH + data.id + '/';
    setImage(img, basePath + data.about.image, 'About Homa');
}

function renderOccasion(data) {
    const section = document.getElementById('occasion');
    if (!data.occasion) {
        section.classList.add('hidden');
        return;
    }
    section.classList.remove('hidden');
    
    document.getElementById('occasion-title').textContent = data.occasion.title;
    document.getElementById('occasion-desc').textContent = data.occasion.description;
    
    const hlContainer = document.getElementById('occasion-highlights');
    if (data.occasion.highlights) {
        hlContainer.innerHTML = data.occasion.highlights.map(h => `<span class="occasion-label">${escapeHTML(h)}</span> `).join('');
    }
}

function renderRitualProcess(data) {
    const container = document.getElementById('process-timeline');
    if (!container || !data.ritualSteps) return;

    let html = '';
    data.ritualSteps.forEach((step, index) => {
        const delay = index * 100;
        // Simple logic to hide steps > 3 on mobile initially (would need CSS class + JS to show)
        const isHiddenMobile = index >= 3 ? 'mobile-hidden' : '';
        html += `
            <div class="process-step reveal delay-${delay} ${isHiddenMobile}">
                <div class="step-number">${step.number}</div>
                <div class="card-icon" style="margin: 0 auto 1rem auto; width: 40px; height: 40px; font-size: 1.2rem;">${step.icon || '🕉️'}</div>
                <h3 class="step-title">${escapeHTML(step.title)}</h3>
                <p class="card-desc">${escapeHTML(step.description)}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderTemple(data) {
    if (!data.temple) return;
    
    document.getElementById('temple-name').textContent = data.temple.name;
    document.getElementById('temple-location-text').textContent = data.temple.location;
    document.getElementById('temple-desc').textContent = data.temple.description;
    
    const hlContainer = document.getElementById('temple-highlights');
    if (data.temple.highlights) {
        hlContainer.innerHTML = data.temple.highlights.map(h => `<span class="occasion-label">${escapeHTML(h)}</span> `).join('');
    }
    
    const img = document.getElementById('temple-image');
    const basePath = CONFIG.ASSET_BASE_PATH + data.id + '/';
    setImage(img, basePath + data.temple.image, data.temple.name);
}

function renderExperience(data) {
    const container = document.getElementById('experience-container');
    if (!container || !data.experience) return;

    let html = '';
    data.experience.forEach((exp, index) => {
        const delay = index * 100;
        html += `
            <div class="card reveal delay-${delay}" style="text-align: center;">
                <div class="card-icon" style="margin: 0 auto 1rem auto;">${exp.icon || '✨'}</div>
                <h3 class="card-title">${escapeHTML(exp.title)}</h3>
                <p class="card-desc">${escapeHTML(exp.description)}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderPackages(data) {
    const container = document.getElementById('packages-container');
    if (!container || !data.packages) return;

    const basePath = CONFIG.ASSET_BASE_PATH + data.id + '/';
    let html = '';
    data.packages.forEach((pkg, index) => {
        const delay = index * 100;
        const popularBadge = pkg.popular ? `<div class="package-popular-badge">Most Popular</div>` : '';
        const imagePath = basePath + pkg.image;
        
        html += `
            <div class="package-card reveal delay-${delay}" data-id="${pkg.id}">
                ${popularBadge}
                <div class="package-image">
                    <img src="${imagePath}" alt="${escapeHTML(pkg.title)}" loading="lazy" style="object-fit: ${data.imageFit || 'cover'}">
                </div>
                <div class="package-content">
                    <div class="package-persons">${escapeHTML(pkg.persons)}</div>
                    <h3 class="card-title">${escapeHTML(pkg.title)}</h3>
                    <div class="package-price">${formatCurrency(pkg.price)}</div>
                    <p class="card-desc" style="margin-bottom: 1.5rem;">${escapeHTML(pkg.description || '')}</p>
                    <button class="btn btn-primary package-btn">Select Package</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderTrustSecurity(data) {
    if (data.stats?.devotees) {
        document.getElementById('stat-devotees').textContent = data.stats.devotees;
    }
}

function renderTestimonials(data) {
    const container = document.getElementById('testimonials-container');
    if (!container || !data.testimonials) return;

    // Simple grid for now, could be enhanced with a real carousel library or CSS scroll snap
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    container.style.gap = '1.5rem';

    const basePath = CONFIG.ASSET_BASE_PATH + data.id + '/';
    let html = '';
    data.testimonials.forEach((test, index) => {
        const delay = index * 100;
        const stars = '★'.repeat(test.rating) + '☆'.repeat(5 - test.rating);
        
        html += `
            <div class="card reveal delay-${delay}">
                <div style="display:flex; gap:1rem; align-items:center; margin-bottom:1rem;">
                    <img src="${basePath + (test.image || 'testimonials/default.webp')}" alt="${escapeHTML(test.name)}" style="width:50px; height:50px; border-radius:50%; object-fit:cover;" onerror="this.src='${CONFIG.IMAGE_FALLBACK}'">
                    <div>
                        <h4 style="margin:0; font-family:var(--font-body);">${escapeHTML(test.name)}</h4>
                        <span style="font-size:0.8rem; color:var(--color-text-muted);">${escapeHTML(test.location)} • ${escapeHTML(test.date)}</span>
                    </div>
                </div>
                <div style="color:var(--color-primary-gold); margin-bottom:0.5rem;">${stars}</div>
                <p class="card-desc" style="font-style:italic;">"${escapeHTML(test.review)}"</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderFaq(data) {
    const container = document.getElementById('faq-container');
    if (!container || !data.faqs) return;

    let html = '';
    data.faqs.forEach((faq, index) => {
        const delay = index * 50;
        html += `
            <div class="faq-item reveal delay-${delay}">
                <button class="faq-question" aria-expanded="false">
                    ${escapeHTML(faq.question)}
                    <span class="faq-icon">+</span>
                </button>
                <div class="faq-answer">
                    <p>${escapeHTML(faq.answer)}</p>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderFinalCTA(data) {
    if (!data.finalCta) return;
    
    document.getElementById('cta-title').textContent = data.finalCta.title;
    document.getElementById('cta-desc').textContent = data.finalCta.description;
    
    const btn = document.getElementById('cta-btn');
    btn.textContent = data.finalCta.buttonText;
    
    const stickyBtn = document.getElementById('sticky-btn-text');
    if (stickyBtn) {
        stickyBtn.textContent = data.finalCta.buttonText;
    }
}
