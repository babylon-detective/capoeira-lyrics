import { LyricsService } from './services/LyricsService';
import { LyricsRenderer } from './components/LyricsRenderer';
import { UIManager } from './components/UIManager';
import { ScrollTracker } from './utils/scroll-tracker';
import { testFormatting } from './utils/test-formatting';
export class LyricsApp {
    constructor() {
        this.scrollTracker = null;
        this.lyricsService = new LyricsService();
        this.renderer = new LyricsRenderer(this.lyricsService);
        this.uiManager = new UIManager(this.lyricsService, this.renderer);
    }
    async initialize() {
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
            // Initialize scroll tracking
            this.scrollTracker = new ScrollTracker();
            console.log('Scroll tracker initialized');
        }
        catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load lyrics data. Please refresh the page.');
        }
    }
    showError(message) {
        const lyricsContainer = document.querySelector('.lyrics-column .content-container');
        const translationsContainer = document.querySelector('.translation-column .content-container');
        if (lyricsContainer) {
            lyricsContainer.innerHTML = `<p class="error">${message}</p>`;
        }
        if (translationsContainer) {
            translationsContainer.innerHTML = `<p class="error">${message}</p>`;
        }
    }
}
//# sourceMappingURL=app.js.map