// Core types for lyrics data structure
export interface SongTitle {
  português: string;
  english: string;
  español: string;
}

export interface SongLyrics {
  português: string[];
  translations: {
    english: string[];
    español: string[];
  };
}

export interface Song {
  author: string;
  album: string;
  track: string;
  type: string;
  title: SongTitle;
  lyrics: SongLyrics;
}

export interface LyricsData {
  songs: Song[];
}

// Extended types for future expansion
export interface Author {
  id: string;
  name: string;
  bio?: string;
  albums: Album[];
}

export interface Album {
  id: string;
  name: string;
  year?: number;
  tracks: Track[];
}

export interface Track {
  id: string;
  name: string;
  songs: Song[];
}

export interface SongType {
  id: string;
  name: string;
  description?: string;
  category: string;
}

// Language support
export type SupportedLanguage = 'português' | 'english' | 'español';

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

// UI State types
export interface AppState {
  selectedAuthor: string | null;
  selectedLanguage: SupportedLanguage;
  isLoading: boolean;
  error: string | null;
}

// Event types
export interface LyricsEvent {
  type: 'author-changed' | 'language-changed' | 'song-loaded' | 'error';
  data?: any;
} 