import { LyricsData, Song, Author, SupportedLanguage, AuthorIndex, AuthorsIndexData } from '../types';
export declare class LyricsService {
    private authorsIndex;
    private authorData;
    private authors;
    private songTypes;
    loadAuthorsIndex(): Promise<AuthorsIndexData>;
    loadAuthorData(authorId: string): Promise<LyricsData>;
    loadData(): Promise<LyricsData>;
    private processAuthorData;
    private groupSongsByStructure;
    getAvailableAuthors(): AuthorIndex[];
    getAuthors(): Author[];
    getAuthorById(authorId: string): Author | undefined;
    getSongsByAuthor(authorName: string): Promise<Song[]>;
    getSongTypes(): string[];
    getSongsByType(type: string): Promise<Song[]>;
    getSupportedLanguages(): SupportedLanguage[];
    formatLyrics(lyrics: string[]): string;
    getLanguageKey(language: SupportedLanguage): string;
}
//# sourceMappingURL=LyricsService.d.ts.map