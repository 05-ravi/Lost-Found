/**
 * Small utility to ensure local development images always point to the correct port.
 * Fixes cases where the backend saved a URL with the wrong port (e.g., 5000 instead of 5001).
 */
export const fixLocalImageUrl = (url) => {
    if (!url) return null;
    
    // If it's a localhost URL pointing to port 5000/uploads
    if (url.includes('localhost:5000/uploads') || url.includes('localhost:5001/uploads')) {
        return url.replace(/localhost:500[01]/, `${window.location.hostname}:5001`);
    }
    
    // Also handle relative uploads if any
    if (url.startsWith('/uploads')) {
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
        return `${baseUrl}${url}`;
    }
    
    return url;
};
