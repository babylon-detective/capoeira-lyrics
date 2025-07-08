import { LyricsData, Song, Author, Album, Track, SupportedLanguage } from '../types';

export class LyricsService {
  private data: LyricsData | null = null;
  private authors: Map<string, Author> = new Map();
  private songTypes: Set<string> = new Set();

  async loadData(): Promise<LyricsData> {
    try {
      const cacheBuster = `?cb=${new Date().getTime()}`;
      const response = await fetch(`/capoeira_lyrics.json${cacheBuster}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load lyrics data: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.data = data;
      this.processData();
      return data;
    } catch (error) {
      console.error('Error loading lyrics data:', error);
      throw error;
    }
  }

  private processData(): void {
    if (!this.data) return;

    // Extract unique authors and song types
    this.data.songs.forEach(song => {
      this.songTypes.add(song.type);
      
      if (!this.authors.has(song.author)) {
        this.authors.set(song.author, {
          id: song.author.toLowerCase().replace(/\s+/g, '-'),
          name: song.author,
          albums: []
        });
      }
    });

    // Group songs by author, album, and track
    this.groupSongsByStructure();
  }

  private groupSongsByStructure(): void {
    if (!this.data) return;

    const authorGroups = new Map<string, Map<string, Map<string, Song[]>>>();

    this.data.songs.forEach(song => {
      if (!authorGroups.has(song.author)) {
        authorGroups.set(song.author, new Map());
      }
      
      const authorMap = authorGroups.get(song.author)!;
      
      if (!authorMap.has(song.album)) {
        authorMap.set(song.album, new Map());
      }
      
      const albumMap = authorMap.get(song.album)!;
      
      if (!albumMap.has(song.track)) {
        albumMap.set(song.track, []);
      }
      
      albumMap.get(song.track)!.push(song);
    });

    // Convert to Author structure
    authorGroups.forEach((albumMap, authorName) => {
      const author = this.authors.get(authorName)!;
      const albums: Album[] = [];

      albumMap.forEach((trackMap, albumName) => {
        const tracks: Track[] = [];
        
        trackMap.forEach((songs, trackName) => {
          tracks.push({
            id: trackName.toLowerCase().replace(/\s+/g, '-'),
            name: trackName,
            songs
          });
        });

        albums.push({
          id: albumName.toLowerCase().replace(/\s+/g, '-'),
          name: albumName,
          tracks
        });
      });

      author.albums = albums;
    });
  }

  getAuthors(): Author[] {
    return Array.from(this.authors.values());
  }

  getAuthorById(authorId: string): Author | undefined {
    return Array.from(this.authors.values()).find(author => author.id === authorId);
  }

  getSongsByAuthor(authorName: string): Song[] {
    if (!this.data) return [];
    return this.data.songs.filter(song => song.author === authorName);
  }

  getSongTypes(): string[] {
    return Array.from(this.songTypes).sort();
  }

  getSongsByType(type: string): Song[] {
    if (!this.data) return [];
    return this.data.songs.filter(song => song.type === type);
  }

  getSupportedLanguages(): SupportedLanguage[] {
    return ['english', 'español'];
  }

  formatLyrics(lyrics: string[]): string {
    return lyrics.map((line, index) => {
      let formatted = line;
      
      // Replace chorus markers with <b> tags (chorus lines start with ^)
      if (formatted.startsWith('^')) {
        formatted = formatted.substring(1); // Remove the ^
        formatted = formatted.replace(/\|$/, ''); // Remove the trailing |
        formatted = `<b>${formatted}</b><br>`;
      } else {
        // Replace bold markers with <b> tags
        formatted = formatted.replace(/\*(.*?)\*/g, '<b>$1</b>');
        
        // Replace line break markers with <br> tags
        formatted = formatted.replace(/\|/g, '<br>');
      }
      
      return formatted;
    }).join('');
  }

  getLanguageKey(language: SupportedLanguage): string {
    switch (language) {
      case 'english': return 'english';
      case 'español': return 'español';
      default: return 'português';
    }
  }
} 