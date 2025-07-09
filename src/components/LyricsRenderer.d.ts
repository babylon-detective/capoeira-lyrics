import { Song, SupportedLanguage } from '../types';
import { LyricsService } from '../services/LyricsService';
export declare class LyricsRenderer {
    private lyricsService;
    constructor(lyricsService: LyricsService);
    renderLyrics(songs: Song[], container: HTMLElement): void;
    renderTranslations(songs: Song[], language: SupportedLanguage, container: HTMLElement): void;
    private groupSongsByTrack;
    clearDisplay(lyricsContainer: HTMLElement, translationsContainer: HTMLElement): void;
}
//# sourceMappingURL=LyricsRenderer.d.ts.map