import { AppState } from '../types';
import { LyricsService } from '../services/LyricsService';
import { LyricsRenderer } from './LyricsRenderer';
export declare class UIManager {
    private state;
    private lyricsService;
    private renderer;
    private lyricsContainer;
    private translationsContainer;
    constructor(lyricsService: LyricsService, renderer: LyricsRenderer);
    private initializeEventListeners;
    private handleLyricsContainerChange;
    private handleTranslationsContainerChange;
    private handleAuthorChange;
    private handleLanguageChange;
    private clearDisplay;
    private setState;
    private updateUI;
    populateAuthorSelect(): void;
    private loadInitialData;
    private updateAllLanguageSelectors;
    private updateAllAuthorSelectors;
    private mapLanguageCodeToName;
    private getLanguageDisplayName;
    getState(): AppState;
    private notifyContentUpdated;
}
//# sourceMappingURL=UIManager.d.ts.map