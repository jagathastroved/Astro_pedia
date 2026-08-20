export function initPackages() {
    const container = document.getElementById('packages-container');
    if (!container) return;

    container.addEventListener('click', (e) => {
        if (e.target.closest('.btn-primary')) {
            const packageCard = e.target.closest('.package-card');
            const packageId = packageCard.dataset.id;
            
            // In a real app, this would add to cart or navigate to checkout
            console.log(`Selected package: ${packageId}`);
            alert(`Proceeding with package: ${packageId}`);
        }
    });
}
