import { LyricsService } from './services/LyricsService';
import { LyricsRenderer } from './components/LyricsRenderer';
import { UIManager } from './components/UIManager';
import { testFormatting } from './utils/test-formatting';

export class LyricsApp {
  private lyricsService: LyricsService;
  private renderer: LyricsRenderer;
  private uiManager: UIManager;

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
      
      // Load lyrics data
      await this.lyricsService.loadData();
      console.log('Lyrics data loaded successfully');
      
      // Populate UI with available authors
      this.uiManager.populateAuthorSelect();
      console.log('UI initialized successfully');
      
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
}

 