import { LyricsData, Song, Author, SupportedLanguage } from '../types';
export declare class LyricsService {
    private data;
    private authors;
    private songTypes;
    loadData(): Promise<LyricsData>;
    private processData;
    private groupSongsByStructure;
    getAuthors(): Author[];
    getAuthorById(authorId: string): Author | undefined;
    getSongsByAuthor(authorName: string): Song[];
    getSongTypes(): string[];
    getSongsByType(type: string): Song[];
    getSupportedLanguages(): SupportedLanguage[];
    formatLyrics(lyrics: string[]): string;
    getLanguageKey(language: SupportedLanguage): string;
}
//# sourceMappingURL=LyricsService.d.ts.map