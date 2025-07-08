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
      container.innerHTML = '<p>No lyrics available.</p>';
      return;
    }

    // Group songs by track
    const trackGroups = this.groupSongsByTrack(songs);
    let lyricsHTML = '';

    // Sort track names for consistent display
    const sortedTrackNames = Object.keys(trackGroups).sort();
    
    sortedTrackNames.forEach(trackName => {
      const trackId = trackName.replace(/\s+/g, '-');
      lyricsHTML += `<h2 id="lyrics-track-${trackId}">${trackName}</h2>`;
      
      trackGroups[trackName].forEach((song, index) => {
        const songId = `lyrics-song-${index}-${trackId}`;
        lyricsHTML += `
          <div class="song-section" id="${songId}">
            <i class="song-type">${song.type}</i><br><br>
            <b>${song.title.português}</b><br><br>
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
      container.innerHTML = '<p>No translations available.</p>';
      return;
    }

    const trackGroups = this.groupSongsByTrack(songs);
    let translationsHTML = '';

    // Sort track names for consistent display
    const sortedTrackNames = Object.keys(trackGroups).sort();
    
    sortedTrackNames.forEach(trackName => {
      const trackId = trackName.replace(/\s+/g, '-');
      translationsHTML += `<h2 id="trans-track-${trackId}">${trackName}</h2>`;
      
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
        
        translationsHTML += `
          <div class="translation-section" id="${songId}">
            <i class="song-type">${song.type}</i><br><br>
            <b>${title}</b><br><br>
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