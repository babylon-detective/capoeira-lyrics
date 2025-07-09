import { AppState, SupportedLanguage } from '../types';
import { LyricsService } from '../services/LyricsService';
import { LyricsRenderer } from './LyricsRenderer';

export class UIManager {
  private state: AppState;
  private lyricsService: LyricsService;
  private renderer: LyricsRenderer;
  
  // DOM elements
  private lyricsContainer: HTMLElement;
  private translationsContainer: HTMLElement;

  constructor(lyricsService: LyricsService, renderer: LyricsRenderer) {
    this.lyricsService = lyricsService;
    this.renderer = renderer;
    
    this.state = {
      selectedAuthor: null,
      selectedLanguage: 'english',
      isLoading: false,
      error: null
    };

    // Initialize DOM elements
    this.lyricsContainer = document.querySelector('.lyrics-column .content-container') as HTMLElement;
    this.translationsContainer = document.querySelector('.translation-column .content-container') as HTMLElement;

    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    // Use event delegation for dynamically created selectors
    this.lyricsContainer.addEventListener('change', this.handleLyricsContainerChange.bind(this));
    this.translationsContainer.addEventListener('change', this.handleTranslationsContainerChange.bind(this));
  }

  private handleLyricsContainerChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target.id && (target.id.startsWith('songSelect-') || target.id === 'songSelect-main')) {
      this.handleAuthorChange(event);
    }
  }

  private handleTranslationsContainerChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target.id && (target.id.startsWith('languageSelect-') || target.id === 'languageSelect-main')) {
      this.handleLanguageChange(event);
    }
  }

  private async handleAuthorChange(event: Event): Promise<void> {
    const target = event.target as HTMLSelectElement;
    const selectedAuthor = target.value;

    if (!selectedAuthor) {
      this.clearDisplay();
      this.updateAllLanguageSelectors(true); // disable all language selectors
      return;
    }

    this.state.selectedAuthor = selectedAuthor;
    this.updateAllLanguageSelectors(false); // enable all language selectors

    try {
      this.setState({ isLoading: true, error: null });
      const songs = await this.lyricsService.getSongsByAuthor(selectedAuthor);
      
      if (songs.length === 0) {
        this.setState({ error: 'No songs found for this author' });
        return;
      }

      this.renderer.renderLyrics(songs, this.lyricsContainer);
      
      // Set default language and render translations
      this.updateAllLanguageSelectors(false, 'en'); // Set all language selectors to English
      this.renderer.renderTranslations(songs, this.state.selectedLanguage, this.translationsContainer);
      
      // Update all author selectors to show the selected author
      this.updateAllAuthorSelectors(false, selectedAuthor);
      
      // Notify that content has been updated (for scroll tracking)
      this.notifyContentUpdated();
      
      this.setState({ isLoading: false });
    } catch (error) {
      console.error('Error in handleAuthorChange:', error);
      this.setState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    }
  }

  private async handleLanguageChange(event: Event): Promise<void> {
    const target = event.target as HTMLSelectElement;
    const selectedLanguageCode = target.value;
    
    if (!selectedLanguageCode || !this.state.selectedAuthor) {
      this.translationsContainer.innerHTML = '';
      return;
    }

    // Map short code to full language name
    const selectedLanguage = this.mapLanguageCodeToName(selectedLanguageCode);
    this.state.selectedLanguage = selectedLanguage;

    try {
      const songs = await this.lyricsService.getSongsByAuthor(this.state.selectedAuthor);
      this.renderer.renderTranslations(songs, selectedLanguage, this.translationsContainer);
      
      // Update all language selectors to show the selected language
      this.updateAllLanguageSelectors(false, selectedLanguageCode);
    } catch (error) {
      this.setState({ 
        error: error instanceof Error ? error.message : 'Error loading translations' 
      });
    }
  }

  private clearDisplay(): void {
    this.renderer.clearDisplay(this.lyricsContainer, this.translationsContainer);
  }

  private setState(newState: Partial<AppState>): void {
    this.state = { ...this.state, ...newState };
    this.updateUI();
  }

  private updateUI(): void {
    // Update loading state
    if (this.state.isLoading) {
      this.lyricsContainer.innerHTML = '<p>Loading...</p>';
      this.translationsContainer.innerHTML = '<p>Loading...</p>';
    }

    // Update error state
    if (this.state.error) {
      this.lyricsContainer.innerHTML = `<p class="error">Error: ${this.state.error}</p>`;
      this.translationsContainer.innerHTML = `<p class="error">Error: ${this.state.error}</p>`;
    }
  }

  populateAuthorSelect(): void {
    // This method is now handled by the renderer when it creates the dynamic selectors
    // We just need to load the initial data
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Load available authors and render empty state
    const availableAuthors = this.lyricsService.getAvailableAuthors();
    if (availableAuthors.length > 0) {
      // Render empty state with selectors
      this.renderer.renderLyrics([], this.lyricsContainer);
      this.renderer.renderTranslations([], 'english', this.translationsContainer);
      
      // If there are existing selections, update the selectors to show them
      setTimeout(() => {
        if (this.state.selectedAuthor) {
          this.updateAllAuthorSelectors(false, this.state.selectedAuthor);
        }
        // Set language selector to show current language
        const languageCode = this.getLanguageCode(this.state.selectedLanguage);
        this.updateAllLanguageSelectors(false, languageCode);
      }, 50);
    }
  }
  
  private getLanguageCode(language: SupportedLanguage): string {
    switch (language) {
      case 'english': return 'en';
      case 'español': return 'es';
      default: return 'en';
    }
  }

  private updateAllLanguageSelectors(disabled: boolean, value?: string): void {
    const languageSelectors = this.translationsContainer.querySelectorAll('select[id^="languageSelect-"]');
    languageSelectors.forEach(selector => {
      const selectElement = selector as HTMLSelectElement;
      selectElement.disabled = disabled;
      if (value) {
        selectElement.value = value;
      }
    });
  }

  private updateAllAuthorSelectors(disabled: boolean, value?: string): void {
    // Update author selectors in lyrics column only
    const lyricsAuthorSelectors = this.lyricsContainer.querySelectorAll('select[id^="songSelect-"]');
    lyricsAuthorSelectors.forEach(selector => {
      const selectElement = selector as HTMLSelectElement;
      selectElement.disabled = disabled;
      if (value) {
        selectElement.value = value;
      }
    });
  }



  private mapLanguageCodeToName(code: string): SupportedLanguage {
    switch (code) {
      case 'en': return 'english';
      case 'es': return 'español';
      default: return 'english';
    }
  }

  private getLanguageDisplayName(language: SupportedLanguage): string {
    switch (language) {
      case 'português': return 'Portuguese';
      case 'english': return 'English';
      case 'español': return 'Spanish';
      default: return language;
    }
  }

  getState(): AppState {
    return { ...this.state };
  }

  private notifyContentUpdated(): void {
    // Dispatch a custom event to notify scroll tracker of content updates
    const event = new CustomEvent('contentUpdated');
    window.dispatchEvent(event);
  }
} 