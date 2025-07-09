export class MobileScrollDetector {
    constructor() {
        this.currentActiveColumn = 'lyrics';
        this.columnsContainer = document.querySelector('.columns-container');
        this.lyricsColumn = document.querySelector('.lyrics-column');
        this.translationColumn = document.querySelector('.translation-column');
        // Fix for mobile browser initial positioning
        this.fixMobileViewport();
        this.initializeScrollDetection();
    }
    fixMobileViewport() {
        // Ensure sticky headers are properly positioned on mobile load
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // Force repaint to fix mobile browser rendering issues
            setTimeout(() => {
                const stickyHeaders = document.querySelectorAll('.sticky-header');
                stickyHeaders.forEach(header => {
                    const element = header;
                    element.style.transform = 'translateZ(0)';
                    element.style.willChange = 'transform';
                });
                const trackHeadings = document.querySelectorAll('.track-heading');
                trackHeadings.forEach(heading => {
                    const element = heading;
                    element.style.transform = 'translateZ(0)';
                    element.style.willChange = 'transform';
                });
            }, 100);
        }
    }
    initializeScrollDetection() {
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
    handleScroll() {
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
    calculateVisibility(elementRect, containerRect) {
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
    setActiveColumn(column) {
        this.currentActiveColumn = column;
        // Remove active class from both columns
        this.lyricsColumn.classList.remove('active');
        this.translationColumn.classList.remove('active');
        // Add active class to the current column
        if (column === 'lyrics') {
            this.lyricsColumn.classList.add('active');
        }
        else {
            this.translationColumn.classList.add('active');
        }
    }
    handleResponsiveChange() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // Initialize mobile behavior
            this.setActiveColumn('lyrics');
        }
        else {
            // Remove mobile-specific classes on desktop
            this.lyricsColumn.classList.remove('active');
            this.translationColumn.classList.remove('active');
        }
    }
    getCurrentActiveColumn() {
        return this.currentActiveColumn;
    }
    destroy() {
        // Clean up event listeners if needed
        this.columnsContainer?.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResponsiveChange);
    }
}
//# sourceMappingURL=mobile-scroll-detector.js.map