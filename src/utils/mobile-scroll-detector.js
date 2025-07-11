export class MobileScrollDetector {
    constructor() {
        this.currentActiveColumn = 'lyrics';
        this.debugMode = false;
        this.columnsContainer = document.querySelector('.columns-container');
        this.lyricsColumn = document.querySelector('.lyrics-column');
        this.translationColumn = document.querySelector('.translation-column');
        // Enable debug mode for better troubleshooting
        this.debugMode = true;
        if (this.debugMode) {
            console.log('🔍 MobileScrollDetector: Initializing with elements:', {
                columnsContainer: this.columnsContainer,
                lyricsColumn: this.lyricsColumn,
                translationColumn: this.translationColumn
            });
        }
        // Fix for mobile browser initial positioning
        this.fixMobileViewport();
        this.initializeScrollDetection();
    }
    fixMobileViewport() {
        // Ensure sticky headers are properly positioned on mobile load
        const isMobile = window.innerWidth <= 768;
        if (this.debugMode) {
            console.log('🔍 MobileScrollDetector: Fixing mobile viewport', {
                isMobile,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                    devicePixelRatio: window.devicePixelRatio
                }
            });
        }
        if (isMobile) {
            // Force repaint to fix mobile browser rendering issues
            setTimeout(() => {
                const stickyHeaders = document.querySelectorAll('.sticky-header');
                const trackHeadings = document.querySelectorAll('.track-heading');
                if (this.debugMode) {
                    console.log('🔍 MobileScrollDetector: Applying mobile fixes to elements:', {
                        stickyHeaders: stickyHeaders.length,
                        trackHeadings: trackHeadings.length
                    });
                }
                // Only log element state without applying transforms
                stickyHeaders.forEach((header, index) => {
                    const element = header;
                    if (this.debugMode) {
                        console.log(`🔍 Sticky Header ${index + 1}:`, {
                            selector: element.className,
                            rect: element.getBoundingClientRect(),
                            style: window.getComputedStyle(element)
                        });
                    }
                });
                trackHeadings.forEach((heading, index) => {
                    const element = heading;
                    if (this.debugMode) {
                        console.log(`🔍 Track Heading ${index + 1}:`, {
                            selector: element.className,
                            rect: element.getBoundingClientRect(),
                            style: window.getComputedStyle(element)
                        });
                    }
                });
                // Also check container layering
                const container = document.querySelector('.container');
                if (container) {
                    const containerRect = container.getBoundingClientRect();
                    const containerStyle = window.getComputedStyle(container);
                    if (this.debugMode) {
                        console.log('🔍 Container layering analysis:', {
                            rect: containerRect,
                            position: containerStyle.position,
                            zIndex: containerStyle.zIndex,
                            transform: containerStyle.transform,
                            overflow: containerStyle.overflow,
                            paddingTop: containerStyle.paddingTop
                        });
                    }
                }
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
        if (this.debugMode) {
            console.log('🔍 MobileScrollDetector: Initializing scroll detection', {
                isMobile,
                columnsContainerRect: this.columnsContainer.getBoundingClientRect(),
                lyricsColumnRect: this.lyricsColumn.getBoundingClientRect(),
                translationColumnRect: this.translationColumn.getBoundingClientRect()
            });
        }
        if (!isMobile) {
            return;
        }
        // Set initial state
        this.setActiveColumn('lyrics');
        // Ensure sticky headers are visible on mobile initialization
        if (this.debugMode) {
            console.log('🔍 MobileScrollDetector: Ensuring initial sticky header visibility');
            setTimeout(() => {
                const stickyHeaders = document.querySelectorAll('.sticky-header');
                stickyHeaders.forEach((header, index) => {
                    const element = header;
                    const parentColumn = element.closest('.lyrics-column, .translation-column');
                    if (parentColumn?.classList.contains('lyrics-column')) {
                        element.style.display = 'flex';
                        element.style.visibility = 'visible';
                        element.style.opacity = '1';
                        console.log(`🔍 Forced visibility for lyrics sticky header ${index + 1}`);
                    }
                });
            }, 100);
        }
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
        if (this.debugMode) {
            console.log('🔍 MobileScrollDetector: Scroll event', {
                containerRect,
                lyricsRect,
                translationRect,
                lyricsVisibility: lyricsVisibility.toFixed(2),
                translationVisibility: translationVisibility.toFixed(2),
                currentActiveColumn: this.currentActiveColumn,
                newActiveColumn,
                willChange: newActiveColumn !== this.currentActiveColumn
            });
        }
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
        const previousColumn = this.currentActiveColumn;
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
        if (this.debugMode) {
            console.log('🔍 MobileScrollDetector: Active column changed', {
                from: previousColumn,
                to: column,
                lyricsClasses: this.lyricsColumn.className,
                translationClasses: this.translationColumn.className
            });
            // Log sticky header visibility changes
            const lyricsHeader = this.lyricsColumn.querySelector('.sticky-header');
            const translationHeader = this.translationColumn.querySelector('.sticky-header');
            if (lyricsHeader && translationHeader) {
                const lyricsHeaderStyle = window.getComputedStyle(lyricsHeader);
                const translationHeaderStyle = window.getComputedStyle(translationHeader);
                console.log('🔍 Sticky header visibility after change:', {
                    lyricsHeader: {
                        display: lyricsHeaderStyle.display,
                        visibility: lyricsHeaderStyle.visibility,
                        opacity: lyricsHeaderStyle.opacity,
                        zIndex: lyricsHeaderStyle.zIndex,
                        position: lyricsHeaderStyle.position
                    },
                    translationHeader: {
                        display: translationHeaderStyle.display,
                        visibility: translationHeaderStyle.visibility,
                        opacity: translationHeaderStyle.opacity,
                        zIndex: translationHeaderStyle.zIndex,
                        position: translationHeaderStyle.position
                    }
                });
            }
        }
    }
    handleResponsiveChange() {
        const isMobile = window.innerWidth <= 768;
        if (this.debugMode) {
            console.log('🔍 MobileScrollDetector: Responsive change detected', {
                isMobile,
                newViewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            });
        }
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
    enableDebugMode() {
        this.debugMode = true;
        console.log('🔍 MobileScrollDetector: Debug mode enabled');
    }
    disableDebugMode() {
        this.debugMode = false;
        console.log('🔍 MobileScrollDetector: Debug mode disabled');
    }
    logCurrentState() {
        console.log('🔍 MobileScrollDetector: Current state', {
            currentActiveColumn: this.currentActiveColumn,
            isMobile: window.innerWidth <= 768,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            elements: {
                columnsContainer: this.columnsContainer ? {
                    rect: this.columnsContainer.getBoundingClientRect(),
                    scrollLeft: this.columnsContainer.scrollLeft,
                    scrollTop: this.columnsContainer.scrollTop
                } : null,
                lyricsColumn: this.lyricsColumn ? {
                    rect: this.lyricsColumn.getBoundingClientRect(),
                    classes: this.lyricsColumn.className
                } : null,
                translationColumn: this.translationColumn ? {
                    rect: this.translationColumn.getBoundingClientRect(),
                    classes: this.translationColumn.className
                } : null
            }
        });
    }
    destroy() {
        // Clean up event listeners if needed
        this.columnsContainer?.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResponsiveChange);
        if (this.debugMode) {
            console.log('🔍 MobileScrollDetector: Destroyed');
        }
    }
}
//# sourceMappingURL=mobile-scroll-detector.js.map