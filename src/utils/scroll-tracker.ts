export class ScrollTracker {
  private lyricsContainer: HTMLElement;
  private translationsContainer: HTMLElement;
  private lyricsHeading: HTMLElement | null;
  private translationsHeading: HTMLElement | null;

  constructor() {
    this.lyricsContainer = document.querySelector('.lyrics-column .content-container') as HTMLElement;
    this.translationsContainer = document.querySelector('.translation-column .content-container') as HTMLElement;
    this.lyricsHeading = null;
    this.translationsHeading = null;
    
    this.initializeScrollTracking();
    
    // Listen for content updates
    window.addEventListener('contentUpdated', () => {
      this.refreshTracking();
    });
  }

  private initializeScrollTracking(): void {
    // Use intersection observer to track which track is currently visible
    const observerOptions = {
      root: null,
      rootMargin: '-60px 0px -80% 0px', // Account for sticky headers
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          let trackName: string;
          
          // Check if it's a track marker, track nest, or track heading
          if (element.classList.contains('track-marker') || element.classList.contains('track-nest')) {
            trackName = element.getAttribute('data-track') || '';
          } else {
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

  private startObserving(observer: IntersectionObserver): void {
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

  private updateHeadingReferences(): void {
    this.lyricsHeading = document.getElementById('lyrics-track-heading');
    this.translationsHeading = document.getElementById('trans-track-heading');
  }

  private extractTrackName(text: string): string {
    // Extract track number from text like "Track 1", "Track 2", etc.
    const match = text.match(/Track\s+(\d+)/i);
    if (match) {
      return `Track ${match[1]}`;
    }
    
    // Fallback: if it's not in the expected format, return as is
    return text.trim() || 'Track 1';
  }

  private updateTrackHeadings(trackName: string): void {
    // Update track headings when they exist
    if (this.lyricsHeading) {
      this.lyricsHeading.textContent = trackName;
    }
    
    if (this.translationsHeading) {
      this.translationsHeading.textContent = trackName;
    }
  }

  // Method to refresh tracking when content changes
  public refreshTracking(): void {
    // Re-initialize tracking after content updates
    setTimeout(() => {
      this.updateHeadingReferences();
      this.initializeScrollTracking();
    }, 100);
  }

  // Method to manually set track heading
  public setTrackHeading(trackName: string): void {
    this.updateTrackHeadings(trackName);
  }
} 