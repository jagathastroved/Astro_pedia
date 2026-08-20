/**
 * Validates the Homa data object to ensure all required fields are present.
 * Prevents the page from crashing if some data is missing.
 */
export function validateHomaData(data) {
    if (!data || typeof data !== 'object') {
        console.error('Invalid Homa data: Data is null or not an object');
        return false;
    }

    const requiredKeys = [
        'id', 'title', 'hero', 'benefits', 'about'
    ];

    for (const key of requiredKeys) {
        if (!data[key]) {
            console.warn(`Missing recommended key in Homa data: ${key}`);
            // We return true anyway to allow partial rendering, but log warning.
            // If it's absolutely critical, we could return false.
        }
    }

    return true;
}
