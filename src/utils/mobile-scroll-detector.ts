export class MobileScrollDetector {
  private columnsContainer: HTMLElement;
  private lyricsColumn: HTMLElement;
  private translationColumn: HTMLElement;
  private currentActiveColumn: 'lyrics' | 'translation' = 'lyrics';
  private debugMode: boolean = false;

  constructor() {
    this.columnsContainer = document.querySelector('.columns-container') as HTMLElement;
    this.lyricsColumn = document.querySelector('.lyrics-column') as HTMLElement;
    this.translationColumn = document.querySelector('.translation-column') as HTMLElement;
    
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

  private fixMobileViewport(): void {
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
        
        stickyHeaders.forEach((header, index) => {
          const element = header as HTMLElement;
          const beforeRect = element.getBoundingClientRect();
          const beforeStyle = window.getComputedStyle(element);
          
          element.style.transform = 'translateZ(0)';
          element.style.willChange = 'transform';
          element.style.webkitTransform = 'translate3d(0,0,0)';
          element.style.webkitBackfaceVisibility = 'hidden';
          
          if (this.debugMode) {
            const afterRect = element.getBoundingClientRect();
            const afterStyle = window.getComputedStyle(element);
            
            console.log(`🔍 Sticky Header ${index + 1} transformation:`, {
              selector: element.className,
              before: {
                rect: beforeRect,
                position: beforeStyle.position,
                zIndex: beforeStyle.zIndex,
                transform: beforeStyle.transform
              },
              after: {
                rect: afterRect,
                position: afterStyle.position,
                zIndex: afterStyle.zIndex,
                transform: afterStyle.transform
              }
            });
          }
        });
        
        trackHeadings.forEach((heading, index) => {
          const element = heading as HTMLElement;
          const beforeRect = element.getBoundingClientRect();
          const beforeStyle = window.getComputedStyle(element);
          
          element.style.transform = 'translateZ(0)';
          element.style.willChange = 'transform';
          element.style.webkitTransform = 'translate3d(0,0,0)';
          element.style.webkitBackfaceVisibility = 'hidden';
          
          if (this.debugMode) {
            const afterRect = element.getBoundingClientRect();
            const afterStyle = window.getComputedStyle(element);
            
            console.log(`🔍 Track Heading ${index + 1} transformation:`, {
              selector: element.className,
              before: {
                rect: beforeRect,
                position: beforeStyle.position,
                zIndex: beforeStyle.zIndex,
                transform: beforeStyle.transform
              },
              after: {
                rect: afterRect,
                position: afterStyle.position,
                zIndex: afterStyle.zIndex,
                transform: afterStyle.transform
              }
            });
          }
        });
        
        // Also check container layering
        const container = document.querySelector('.container') as HTMLElement;
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

  private initializeScrollDetection(): void {
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
          const element = header as HTMLElement;
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
    
    // Server deployment fix: Force proper initialization on mobile
    if (isMobile) {
      setTimeout(() => {
        // Force body background to prevent white block
        document.body.style.backgroundColor = '#f9f9f9';
        document.body.style.overflowX = 'hidden';
        
        // Force container background
        const container = document.querySelector('.container') as HTMLElement;
        if (container) {
          container.style.backgroundColor = '#f9f9f9';
        }
        
        // Force columns container background
        const columnsContainer = document.querySelector('.columns-container') as HTMLElement;
        if (columnsContainer) {
          columnsContainer.style.backgroundColor = '#f9f9f9';
          columnsContainer.style.marginTop = '0';
          columnsContainer.style.paddingTop = '0';
        }
        
        console.log('🔍 Applied server deployment fixes for mobile');
      }, 200);
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

  private handleScroll(): void {
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
    const previousColumn = this.currentActiveColumn;
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

    if (this.debugMode) {
      console.log('🔍 MobileScrollDetector: Active column changed', {
        from: previousColumn,
        to: column,
        lyricsClasses: this.lyricsColumn.className,
        translationClasses: this.translationColumn.className
      });
      
      // Log sticky header visibility changes
      const lyricsHeader = this.lyricsColumn.querySelector('.sticky-header') as HTMLElement;
      const translationHeader = this.translationColumn.querySelector('.sticky-header') as HTMLElement;
      
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

  private handleResponsiveChange(): void {
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
    } else {
      // Remove mobile-specific classes on desktop
      this.lyricsColumn.classList.remove('active');
      this.translationColumn.classList.remove('active');
    }
  }

  public getCurrentActiveColumn(): 'lyrics' | 'translation' {
    return this.currentActiveColumn;
  }

  public enableDebugMode(): void {
    this.debugMode = true;
    console.log('🔍 MobileScrollDetector: Debug mode enabled');
  }

  public disableDebugMode(): void {
    this.debugMode = false;
    console.log('🔍 MobileScrollDetector: Debug mode disabled');
  }

  public logCurrentState(): void {
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

  public destroy(): void {
    // Clean up event listeners if needed
    this.columnsContainer?.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResponsiveChange);
    
    if (this.debugMode) {
      console.log('🔍 MobileScrollDetector: Destroyed');
    }
  }
} 