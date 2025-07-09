export class UIManager {
    constructor(lyricsService, renderer) {
        this.lyricsService = lyricsService;
        this.renderer = renderer;
        this.state = {
            selectedAuthor: null,
            selectedLanguage: 'english',
            isLoading: false,
            error: null
        };
        // Initialize DOM elements
        this.lyricsContainer = document.querySelector('.lyrics-column .content-container');
        this.translationsContainer = document.querySelector('.translation-column .content-container');
        this.initializeEventListeners();
    }
    initializeEventListeners() {
        // Use event delegation for dynamically created selectors
        this.lyricsContainer.addEventListener('change', this.handleLyricsContainerChange.bind(this));
        this.translationsContainer.addEventListener('change', this.handleTranslationsContainerChange.bind(this));
    }
    handleLyricsContainerChange(event) {
        const target = event.target;
        if (target.id && (target.id.startsWith('songSelect-') || target.id === 'songSelect-main')) {
            this.handleAuthorChange(event);
        }
    }
    handleTranslationsContainerChange(event) {
        const target = event.target;
        if (target.id && (target.id.startsWith('languageSelect-') || target.id === 'languageSelect-main')) {
            this.handleLanguageChange(event);
        }
    }
    async handleAuthorChange(event) {
        const target = event.target;
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
            const songs = this.lyricsService.getSongsByAuthor(selectedAuthor);
            if (songs.length === 0) {
                this.setState({ error: 'No songs found for this author' });
                return;
            }
            this.renderer.renderLyrics(songs, this.lyricsContainer);
            // Set default language and render translations
            this.updateAllLanguageSelectors(false, 'en'); // Set all language selectors to English
            this.renderer.renderTranslations(songs, this.state.selectedLanguage, this.translationsContainer);
            // Notify that content has been updated (for scroll tracking)
            this.notifyContentUpdated();
            this.setState({ isLoading: false });
        }
        catch (error) {
            console.error('Error in handleAuthorChange:', error);
            this.setState({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }
    handleLanguageChange(event) {
        const target = event.target;
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
        }
        catch (error) {
            this.setState({
                error: error instanceof Error ? error.message : 'Error loading translations'
            });
        }
        return Promise.resolve();
    }
    clearDisplay() {
        this.renderer.clearDisplay(this.lyricsContainer, this.translationsContainer);
    }
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.updateUI();
    }
    updateUI() {
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
    populateAuthorSelect() {
        // This method is now handled by the renderer when it creates the dynamic selectors
        // We just need to load the initial data
        this.loadInitialData();
    }
    loadInitialData() {
        // Load authors and render empty state
        const authors = this.lyricsService.getAuthors();
        if (authors.length > 0) {
            // Render empty state with selectors
            this.renderer.renderLyrics([], this.lyricsContainer);
            this.renderer.renderTranslations([], 'english', this.translationsContainer);
        }
    }
    updateAllLanguageSelectors(disabled, value) {
        const languageSelectors = this.translationsContainer.querySelectorAll('select[id^="languageSelect-"]');
        languageSelectors.forEach(selector => {
            const selectElement = selector;
            selectElement.disabled = disabled;
            if (value) {
                selectElement.value = value;
            }
        });
    }
    updateAllAuthorSelectors(disabled, value) {
        // Update author selectors in lyrics column only
        const lyricsAuthorSelectors = this.lyricsContainer.querySelectorAll('select[id^="songSelect-"]');
        lyricsAuthorSelectors.forEach(selector => {
            const selectElement = selector;
            selectElement.disabled = disabled;
            if (value) {
                selectElement.value = value;
            }
        });
    }
    mapLanguageCodeToName(code) {
        switch (code) {
            case 'en': return 'english';
            case 'es': return 'español';
            default: return 'english';
        }
    }
    getLanguageDisplayName(language) {
        switch (language) {
            case 'português': return 'Portuguese';
            case 'english': return 'English';
            case 'español': return 'Spanish';
            default: return language;
        }
    }
    getState() {
        return { ...this.state };
    }
    notifyContentUpdated() {
        // Dispatch a custom event to notify scroll tracker of content updates
        const event = new CustomEvent('contentUpdated');
        window.dispatchEvent(event);
    }
}
//# sourceMappingURL=UIManager.js.map