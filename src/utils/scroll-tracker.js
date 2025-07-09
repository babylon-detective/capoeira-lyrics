export class ScrollTracker {
    constructor() {
        this.lyricsContainer = document.querySelector('.lyrics-column .content-container');
        this.translationsContainer = document.querySelector('.translation-column .content-container');
        this.lyricsHeading = null;
        this.translationsHeading = null;
        this.initializeScrollTracking();
        // Listen for content updates
        window.addEventListener('contentUpdated', () => {
            this.refreshTracking();
        });
    }
    initializeScrollTracking() {
        // Use intersection observer to track which track is currently visible
        const observerOptions = {
            root: null,
            rootMargin: '-60px 0px -80% 0px', // Account for sticky headers
            threshold: 0.1
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    let trackName;
                    // Check if it's a track marker, track nest, or track heading
                    if (element.classList.contains('track-marker') || element.classList.contains('track-nest')) {
                        trackName = element.getAttribute('data-track') || '';
                    }
                    else {
                        trackName = this.extractTrackName(element.textContent || '');
                    }
                    this.updateTrackHeadings(trackName);
                }
            });
        }, observerOptions);
        // Start observing after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.startObserving(observer);
        }, 500);
    }
    startObserving(observer) {
        // Find all track headings, track markers, and track nests and observe them
        const trackHeadings = document.querySelectorAll('.track-heading');
        const trackMarkers = document.querySelectorAll('.track-marker');
        const trackNests = document.querySelectorAll('.track-nest');
        trackHeadings.forEach(heading => {
            observer.observe(heading);
        });
        trackMarkers.forEach(marker => {
            observer.observe(marker);
        });
        trackNests.forEach(nest => {
            observer.observe(nest);
        });
        // Also update heading references when new content is loaded
        this.updateHeadingReferences();
    }
    updateHeadingReferences() {
        this.lyricsHeading = document.getElementById('lyrics-track-heading');
        this.translationsHeading = document.getElementById('trans-track-heading');
    }
    extractTrackName(text) {
        // Extract track number from text like "Track 1", "Track 2", etc.
        const match = text.match(/Track\s+(\d+)/i);
        if (match) {
            return `Track ${match[1]}`;
        }
        // Fallback: if it's not in the expected format, return as is
        return text.trim() || 'Track 1';
    }
    updateTrackHeadings(trackName) {
        // Update track headings when they exist
        if (this.lyricsHeading) {
            this.lyricsHeading.textContent = trackName;
        }
        if (this.translationsHeading) {
            this.translationsHeading.textContent = trackName;
        }
    }
    // Method to refresh tracking when content changes
    refreshTracking() {
        // Re-initialize tracking after content updates
        setTimeout(() => {
            this.updateHeadingReferences();
            this.initializeScrollTracking();
        }, 100);
    }
    // Method to manually set track heading
    setTrackHeading(trackName) {
        this.updateTrackHeadings(trackName);
    }
}
//# sourceMappingURL=scroll-tracker.js.map