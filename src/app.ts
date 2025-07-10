import { LyricsService } from './services/LyricsService';
import { LyricsRenderer } from './components/LyricsRenderer';
import { UIManager } from './components/UIManager';
import { ScrollTracker } from './utils/scroll-tracker';
import { MobileScrollDetector } from './utils/mobile-scroll-detector';
import { MobileDebugLogger } from './utils/mobile-debug-logger';
import { testFormatting } from './utils/test-formatting';

export class LyricsApp {
  private lyricsService: LyricsService;
  private renderer: LyricsRenderer;
  private uiManager: UIManager;
  private scrollTracker: ScrollTracker | null = null;
  private mobileScrollDetector: MobileScrollDetector | null = null;
  private mobileDebugLogger: MobileDebugLogger | null = null;

  constructor() {
    this.lyricsService = new LyricsService();
    this.renderer = new LyricsRenderer(this.lyricsService);
    this.uiManager = new UIManager(this.lyricsService, this.renderer);
  }

  async initialize(): Promise<void> {
    try {
      console.log('Initializing Lyrics App...');
      
      // Test formatting
      testFormatting();
      
      // Initialize mobile debug logger first (for debugging initialization issues)
      this.mobileDebugLogger = new MobileDebugLogger();
      console.log('Mobile debug logger initialized');
      
      // Load lyrics data (using the working method)
      await this.lyricsService.loadData();
      console.log('Lyrics data loaded successfully');
      
      // Populate UI with available authors
      this.uiManager.populateAuthorSelect();
      console.log('UI initialized successfully');
      
      // Initialize scroll tracking
      this.scrollTracker = new ScrollTracker();
      console.log('Scroll tracker initialized');
      
      // Initialize mobile scroll detection
      this.mobileScrollDetector = new MobileScrollDetector();
      console.log('Mobile scroll detector initialized');
      
      // Add global app reference for debugging
      (window as any).lyricsApp = this;
      console.log('🔧 Global app reference available as window.lyricsApp');
      
      // Log initial analysis for debugging
      if (this.mobileDebugLogger) {
        setTimeout(() => {
          console.log('🔍 Running initial layer analysis...');
          this.mobileDebugLogger!.analyzeLayering();
        }, 1000);
      }
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showError('Failed to load lyrics data. Please refresh the page.');
    }
  }

  private showError(message: string): void {
    const lyricsContainer = document.querySelector('.lyrics-column .content-container') as HTMLElement;
    const translationsContainer = document.querySelector('.translation-column .content-container') as HTMLElement;
    
    if (lyricsContainer) {
      lyricsContainer.innerHTML = `<p class="error">${message}</p>`;
    }
    
    if (translationsContainer) {
      translationsContainer.innerHTML = `<p class="error">${message}</p>`;
    }
  }

  // Public methods for debugging access
  public getDebugLogger(): MobileDebugLogger | null {
    return this.mobileDebugLogger;
  }

  public getMobileScrollDetector(): MobileScrollDetector | null {
    return this.mobileScrollDetector;
  }

  public enableDebugMode(): void {
    if (this.mobileDebugLogger) {
      this.mobileDebugLogger.enable();
      console.log('🔍 Debug mode enabled - check top-right corner for overlay');
    }
  }

  public disableDebugMode(): void {
    if (this.mobileDebugLogger) {
      this.mobileDebugLogger.disable();
    }
  }
}

 