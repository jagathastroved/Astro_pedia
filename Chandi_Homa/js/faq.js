export function initFAQ() {
    const container = document.getElementById('faq-container');
    if (!container) return;

    container.addEventListener('click', (e) => {
        const questionBtn = e.target.closest('.faq-question');
        if (!questionBtn) return;

        const faqItem = questionBtn.closest('.faq-item');
        
        // Mobile behavior: only one open at a time
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            const allItems = container.querySelectorAll('.faq-item');
            allItems.forEach(item => {
                if (item !== faqItem) item.classList.remove('active');
            });
        }

        faqItem.classList.toggle('active');
        
        // Update ARIA
        const isExpanded = faqItem.classList.contains('active');
        questionBtn.setAttribute('aria-expanded', isExpanded);
    });
}
