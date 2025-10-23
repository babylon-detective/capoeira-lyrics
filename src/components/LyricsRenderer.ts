import { Song, SupportedLanguage } from '../types';
import { LyricsService } from '../services/LyricsService';
import { validateSongForLanguage } from '../utils/debug';

export class LyricsRenderer {
  private lyricsService: LyricsService;

  constructor(lyricsService: LyricsService) {
    this.lyricsService = lyricsService;
  }

  renderLyrics(songs: Song[], container: HTMLElement): void {
    if (!songs || songs.length === 0) {
      // Get available authors from the index
      const availableAuthors = this.lyricsService.getAvailableAuthors();
      const authorOptions = availableAuthors.map(author => 
        `<option value="${author.name}">${author.name}</option>`
      ).join('');
      
      container.innerHTML = `
        <div class="sticky-header" data-track="Default">
          <div class="song-selector">
            <select id="songSelect-default">
              <option value="" disabled selected>Choose an Author...</option>
              ${authorOptions}
            </select>
          </div>
        </div>
        <h2 id="lyrics-track-heading" class="track-heading">Select an Author</h2>
        <p>No lyrics available.</p>
      `;
      return;
    }

    // Group songs by track
    const trackGroups = this.groupSongsByTrack(songs);
    let lyricsHTML = '';

    // Get available authors from the index
    const availableAuthors = this.lyricsService.getAvailableAuthors();
    const authorOptions = availableAuthors.map(author => 
      `<option value="${author.name}">${author.name}</option>`
    ).join('');

    // Add sticky header for lyrics column with song selector only
    lyricsHTML += `
      <div class="sticky-header">
        <div class="song-selector">
          <select id="songSelect-main">
            <option value="" disabled selected>Choose an Author...</option>
            ${authorOptions}
          </select>
        </div>
      </div>
      <h2 id="lyrics-track-heading" class="track-heading">Track 1</h2>
    `;

    // Sort track names for consistent display
    const sortedTrackNames = Object.keys(trackGroups).sort();
    
    sortedTrackNames.forEach((trackName, trackIndex) => {
      const trackId = trackName.replace(/\s+/g, '-');
      
      // Create track nest component for communication
      lyricsHTML += `
        <div class="track-nest" data-track="${trackName}" id="lyrics-nest-${trackId}">
          <!-- Track ${trackIndex + 1} Content -->
        </div>
      `;
      
      trackGroups[trackName].forEach((song, index) => {
        const songId = `lyrics-song-${index}-${trackId}`;
        const titleHtml = song.title.português ? `<b>${song.title.português}</b><br><br>` : '';
        lyricsHTML += `
          <div class="song-section" id="${songId}">
            <i class="song-type">${song.type}</i><br><br>
            ${titleHtml}
            ${this.lyricsService.formatLyrics(song.lyrics.português)}
          </div>
          <hr>
        `;
      });
    });

    container.innerHTML = lyricsHTML;
  }

  renderTranslations(songs: Song[], language: SupportedLanguage, container: HTMLElement): void {
    if (!songs || songs.length === 0) {
      // Get available authors from the index
      const availableAuthors = this.lyricsService.getAvailableAuthors();
      const authorOptions = availableAuthors.map(author => 
        `<option value="${author.name}">${author.name}</option>`
      ).join('');
      
      container.innerHTML = `
        <div class="sticky-header" data-track="Default">
          <div class="language-selector">
            <select id="languageSelect-default" disabled>
              <option value="" disabled selected>Choose language...</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>
        <h2 id="trans-track-heading" class="track-heading">Select a Language</h2>
        <p>No translations available.</p>
      `;
      return;
    }

    const trackGroups = this.groupSongsByTrack(songs);
    let translationsHTML = '';

    // Get available authors from the index
    const availableAuthors = this.lyricsService.getAvailableAuthors();
    const authorOptions = availableAuthors.map(author => 
      `<option value="${author.name}">${author.name}</option>`
    ).join('');

    // Add sticky header for translations column with language selector only
    translationsHTML += `
      <div class="sticky-header">
        <div class="language-selector">
          <select id="languageSelect-main">
            <option value="" disabled selected>Choose language...</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </select>
        </div>
      </div>
      <h2 id="trans-track-heading" class="track-heading">Track 1</h2>
    `;

    // Sort track names for consistent display
    const sortedTrackNames = Object.keys(trackGroups).sort();
    
    sortedTrackNames.forEach((trackName, trackIndex) => {
      const trackId = trackName.replace(/\s+/g, '-');
      
      // Create track nest component for communication
      translationsHTML += `
        <div class="track-nest" data-track="${trackName}" id="trans-nest-${trackId}">
          <!-- Track ${trackIndex + 1} Content -->
        </div>
      `;
      
      trackGroups[trackName].forEach((song, index) => {
        const songId = `trans-song-${index}-${trackId}`;
        
        // Validate song has the required language data
        if (!validateSongForLanguage(song, language)) {
          translationsHTML += `
            <div class="translation-section" id="${songId}">
              <i class="song-type">${song.type}</i><br>
              <b>${song.title.português}</b><br>
              <p class="error">Translation not available for ${language}</p>
            </div>
            <hr>
          `;
          return;
        }
        
        // Get the correct lyrics and title based on language
        let lyrics: string[];
        let title: string;
        
        try {
          if (language === 'português') {
            lyrics = song.lyrics.português;
            title = song.title.português;
          } else {
            // For translations, use the language key directly
            const translationKey = language as keyof typeof song.lyrics.translations;
            lyrics = song.lyrics.translations[translationKey];
            title = song.title[language as keyof typeof song.title];
          }
        } catch (error) {
          console.error(`Error processing song ${song.title.português} for language ${language}:`, error);
          lyrics = ['Translation not available'];
          title = song.title.português;
        }
        
        const titleHtml = title ? `<b>${title}</b><br><br>` : '';
        translationsHTML += `
          <div class="translation-section" id="${songId}">
            <i class="song-type">${song.type}</i><br><br>
            ${titleHtml}
            ${this.lyricsService.formatLyrics(lyrics)}
          </div>
          <hr>
        `;
      });
    });

    container.innerHTML = translationsHTML;
  }

  private groupSongsByTrack(songs: Song[]): Record<string, Song[]> {
    const trackGroups: Record<string, Song[]> = {};
    
    songs.forEach(song => {
      if (!trackGroups[song.track]) {
        trackGroups[song.track] = [];
      }
      trackGroups[song.track].push(song);
    });
    
    return trackGroups;
  }

  clearDisplay(lyricsContainer: HTMLElement, translationsContainer: HTMLElement): void {
    lyricsContainer.innerHTML = '';
    translationsContainer.innerHTML = '';
  }
} 