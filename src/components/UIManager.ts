import { AppState, SupportedLanguage } from '../types';
import { LyricsService } from '../services/LyricsService';
import { LyricsRenderer } from './LyricsRenderer';

export class UIManager {
  private state: AppState;
  private lyricsService: LyricsService;
  private renderer: LyricsRenderer;
  
  // DOM elements
  private songSelect: HTMLSelectElement;
  private languageSelect: HTMLSelectElement;
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
    this.songSelect = document.getElementById('songSelect') as HTMLSelectElement;
    this.languageSelect = document.getElementById('languageSelect') as HTMLSelectElement;
    this.lyricsContainer = document.querySelector('.lyrics-column .content-container') as HTMLElement;
    this.translationsContainer = document.querySelector('.translation-column .content-container') as HTMLElement;

    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.songSelect.addEventListener('change', this.handleAuthorChange.bind(this));
    this.languageSelect.addEventListener('change', this.handleLanguageChange.bind(this));
  }

  private async handleAuthorChange(event: Event): Promise<void> {
    const target = event.target as HTMLSelectElement;
    const selectedAuthor = target.value;

    if (!selectedAuthor) {
      this.clearDisplay();
      this.languageSelect.disabled = true;
      return;
    }

    this.state.selectedAuthor = selectedAuthor;
    this.languageSelect.disabled = false;

    try {
      this.setState({ isLoading: true, error: null });
      const songs = this.lyricsService.getSongsByAuthor(selectedAuthor);
      
      if (songs.length === 0) {
        this.setState({ error: 'No songs found for this author' });
        return;
      }

      this.renderer.renderLyrics(songs, this.lyricsContainer);
      
      // Set default language and render translations
      this.languageSelect.value = 'en'; // Use short code for HTML
      this.renderer.renderTranslations(songs, this.state.selectedLanguage, this.translationsContainer);
      
      this.setState({ isLoading: false });
    } catch (error) {
      console.error('Error in handleAuthorChange:', error);
      this.setState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    }
  }

  private handleLanguageChange(event: Event): Promise<void> {
    const target = event.target as HTMLSelectElement;
    const selectedLanguageCode = target.value;
    
    if (!selectedLanguageCode || !this.state.selectedAuthor) {
      this.translationsContainer.innerHTML = '';
      return Promise.resolve();
    }

    // Map short code to full language name
    const selectedLanguage = this.mapLanguageCodeToName(selectedLanguageCode);
    this.state.selectedLanguage = selectedLanguage;

    try {
      const songs = this.lyricsService.getSongsByAuthor(this.state.selectedAuthor);
      this.renderer.renderTranslations(songs, selectedLanguage, this.translationsContainer);
    } catch (error) {
      this.setState({ 
        error: error instanceof Error ? error.message : 'Error loading translations' 
      });
    }

    return Promise.resolve();
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
    const authors = this.lyricsService.getAuthors();
    
    // Clear existing options except the first one
    while (this.songSelect.children.length > 1) {
      this.songSelect.removeChild(this.songSelect.lastChild!);
    }

    // Add author options
    authors.forEach(author => {
      const option = document.createElement('option');
      option.value = author.name;
      option.textContent = author.name;
      this.songSelect.appendChild(option);
    });

    // Populate language selector
    this.populateLanguageSelect();
  }

  private populateLanguageSelect(): void {
    // Use short codes for HTML values, but map to full language names
    const languageOptions = [
      { code: 'en', name: 'English', fullName: 'english' },
      { code: 'es', name: 'Spanish', fullName: 'español' }
    ];
    
    // Clear existing options except the first one
    while (this.languageSelect.children.length > 1) {
      this.languageSelect.removeChild(this.languageSelect.lastChild!);
    }

    // Add language options using short codes
    languageOptions.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.code;
      option.textContent = lang.name;
      this.languageSelect.appendChild(option);
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
} 