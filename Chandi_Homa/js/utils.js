import { CONFIG } from './config.js';

/**
 * Gets the Homa slug from the URL.
 * Checks query parameter ?homa=slug first, then checks path /homa/slug.
 * Falls back to default.
 */
export function getHomaSlug() {
    // Check URL parameters
    const params = new URLSearchParams(window.location.search);
    const paramSlug = params.get('homa');
    if (paramSlug) return paramSlug;

    // Check path (e.g., /homa/chandi)
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && pathParts[pathParts.length - 2] === 'homa') {
        return pathParts[pathParts.length - 1];
    }

    return CONFIG.DEFAULT_HOMA;
}

/**
 * Escapes HTML to prevent XSS.
 */
export function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

/**
 * Formats a number as INR currency.
 */
export function formatCurrency(amount) {
    if (!amount && amount !== 0) return '';
    if (typeof amount === 'string' && amount.includes('₹')) return amount; // Already formatted in data
    
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Updates an image element with proper fallback and lazy loading.
 */
export function setImage(imgElement, src, alt, options = {}) {
    if (!imgElement) return;
    
    imgElement.src = src || CONFIG.IMAGE_FALLBACK;
    imgElement.alt = alt || 'Image';
    
    if (options.lazy !== false) {
        imgElement.loading = 'lazy';
    } else {
        imgElement.removeAttribute('loading');
    }
    
    if (options.objectFit) {
        imgElement.style.objectFit = options.objectFit;
    }
    
    if (options.objectPosition) {
        imgElement.style.objectPosition = options.objectPosition;
    }

    imgElement.onerror = () => {
        if (imgElement.src !== CONFIG.IMAGE_FALLBACK) {
            imgElement.src = CONFIG.IMAGE_FALLBACK;
        }
    };
}

/**
 * Update document meta tags for SEO.
 */
export function updateSEO(data) {
    if (!data) return;

    const title = `${data.title} | Sacred Homa`;
    const desc = data.seo?.description || data.subtitle || '';
    const img = window.location.origin + '/' + (data.seo?.image || data.hero?.image || '');
    const url = window.location.href;

    document.title = title;
    
    updateMetaTag('name', 'description', desc);
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', desc);
    updateMetaTag('property', 'og:image', img);
    updateMetaTag('property', 'og:url', url);
    
    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
        canonical.href = url.split('?')[0]; // Simple canonical logic
    }
}

function updateMetaTag(attrName, attrValue, content) {
    let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    if (tag) {
        tag.setAttribute('content', content);
    }
}
