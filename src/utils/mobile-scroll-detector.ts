export class MobileScrollDetector {
  private columnsContainer: HTMLElement;
  private lyricsColumn: HTMLElement;
  private translationColumn: HTMLElement;
  private currentActiveColumn: 'lyrics' | 'translation' = 'lyrics';

  constructor() {
    this.columnsContainer = document.querySelector('.columns-container') as HTMLElement;
    this.lyricsColumn = document.querySelector('.lyrics-column') as HTMLElement;
    this.translationColumn = document.querySelector('.translation-column') as HTMLElement;
    
    // Fix for mobile browser initial positioning
    this.fixMobileViewport();
    
    this.initializeScrollDetection();
  }

  private fixMobileViewport(): void {
    // Ensure sticky headers are properly positioned on mobile load
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // Force repaint to fix mobile browser rendering issues
      setTimeout(() => {
        const stickyHeaders = document.querySelectorAll('.sticky-header');
        stickyHeaders.forEach(header => {
          const element = header as HTMLElement;
          element.style.transform = 'translateZ(0)';
          element.style.willChange = 'transform';
        });
        
        const trackHeadings = document.querySelectorAll('.track-heading');
        trackHeadings.forEach(heading => {
          const element = heading as HTMLElement;
          element.style.transform = 'translateZ(0)';
          element.style.willChange = 'transform';
        });
      }, 100);
    }
  }

  private initializeScrollDetection(): void {
    if (!this.columnsContainer || !this.lyricsColumn || !this.translationColumn) {
      console.warn('Mobile scroll detector: Required elements not found');
      return;
    }

    // Check if we're on mobile
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) {
      return;
    }

    // Set initial state
    this.setActiveColumn('lyrics');

    // Listen for scroll events on the columns container
    this.columnsContainer.addEventListener('scroll', () => {
      this.handleScroll();
    });

    // Listen for window resize to handle orientation changes
    window.addEventListener('resize', () => {
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile !== isMobile) {
        this.handleResponsiveChange();
      }
    });
  }

  private handleScroll(): void {
    const containerRect = this.columnsContainer.getBoundingClientRect();
    const lyricsRect = this.lyricsColumn.getBoundingClientRect();
    const translationRect = this.translationColumn.getBoundingClientRect();

    // Calculate which column is more visible
    const lyricsVisibility = this.calculateVisibility(lyricsRect, containerRect);
    const translationVisibility = this.calculateVisibility(translationRect, containerRect);

    // Determine which column should be active
    const newActiveColumn = lyricsVisibility > translationVisibility ? 'lyrics' : 'translation';

    // Only update if the active column has changed
    if (newActiveColumn !== this.currentActiveColumn) {
      this.setActiveColumn(newActiveColumn);
    }
  }

  private calculateVisibility(elementRect: DOMRect, containerRect: DOMRect): number {
    const elementLeft = elementRect.left - containerRect.left;
    const elementRight = elementRect.right - containerRect.left;
    const containerWidth = containerRect.width;

    // Calculate the visible portion of the element
    const visibleLeft = Math.max(0, elementLeft);
    const visibleRight = Math.min(containerWidth, elementRight);
    const visibleWidth = Math.max(0, visibleRight - visibleLeft);

    // Return the percentage of the element that's visible
    return visibleWidth / elementRect.width;
  }

  private setActiveColumn(column: 'lyrics' | 'translation'): void {
    this.currentActiveColumn = column;

    // Remove active class from both columns
    this.lyricsColumn.classList.remove('active');
    this.translationColumn.classList.remove('active');

    // Add active class to the current column
    if (column === 'lyrics') {
      this.lyricsColumn.classList.add('active');
    } else {
      this.translationColumn.classList.add('active');
    }
  }

  private handleResponsiveChange(): void {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Initialize mobile behavior
      this.setActiveColumn('lyrics');
    } else {
      // Remove mobile-specific classes on desktop
      this.lyricsColumn.classList.remove('active');
      this.translationColumn.classList.remove('active');
    }
  }

  public getCurrentActiveColumn(): 'lyrics' | 'translation' {
    return this.currentActiveColumn;
  }

  public destroy(): void {
    // Clean up event listeners if needed
    this.columnsContainer?.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResponsiveChange);
  }
} 