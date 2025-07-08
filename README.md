# Lyrics HTML - TypeScript Edition

A modern, TypeScript-based lyrics viewer with support for multiple authors, tracks, categories, and translations.

## Features

- **Multi-Author Support**: Organize lyrics by different authors
- **Track Management**: Group songs by tracks within albums
- **Song Categories**: Categorize songs by type (LADAINHA, CORRIDO, etc.)
- **Multi-Language Translations**: Support for Portuguese, English, and Spanish
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript Architecture**: Clean, maintainable code with strong typing
- **Modern Build System**: Vite for fast development and optimized builds

## Project Structure

```
src/
├── types/
│   └── index.ts          # TypeScript type definitions
├── services/
│   └── LyricsService.ts  # Data loading and management
├── components/
│   ├── LyricsRenderer.ts # Lyrics rendering logic
│   └── UIManager.ts      # UI state and event handling
└── app.ts               # Main application entry point
```

## Architecture

### Core Components

1. **LyricsService**: Handles data loading, processing, and provides access to lyrics data
2. **LyricsRenderer**: Responsible for rendering lyrics and translations to HTML
3. **UIManager**: Manages UI state, event handling, and user interactions
4. **Types**: Comprehensive TypeScript interfaces for type safety

### Data Structure

The application supports a hierarchical data structure:

- **Authors** → **Albums** → **Tracks** → **Songs**
- Each song has:
  - Metadata (author, album, track, type)
  - Titles in multiple languages
  - Lyrics in Portuguese
  - Translations in English and Spanish

### Extensibility

The architecture is designed for easy expansion:

- **New Authors**: Simply add to the JSON data
- **New Languages**: Extend the `SupportedLanguage` type and update rendering logic
- **New Song Types**: Add to the data structure and UI will automatically adapt
- **Additional Metadata**: Extend the type interfaces as needed

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

### Development Commands

- `npm run dev` - Start Vite development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run clean` - Clean build artifacts

## Data Format

The application expects a JSON file with the following structure:

```json
{
  "songs": [
    {
      "author": "Author Name",
      "album": "Album Name",
      "track": "Track Name",
      "type": "SONG_TYPE",
      "title": {
        "português": "Portuguese Title",
        "english": "English Title",
        "español": "Spanish Title"
      },
      "lyrics": {
        "português": ["Line 1|", "Line 2|"],
        "translations": {
          "english": ["Line 1|", "Line 2|"],
          "español": ["Line 1|", "Line 2|"]
        }
      }
    }
  ]
}
```

## Future Enhancements

- **Search Functionality**: Search across authors, songs, and lyrics
- **Filtering**: Filter by song type, language, or other criteria
- **Export Features**: Export lyrics to various formats
- **Audio Integration**: Link to audio files for each song
- **User Preferences**: Save user language and author preferences
- **Offline Support**: Service worker for offline access

## Browser Support

- Modern browsers with ES2020 support
- Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

## License

MIT License - see LICENSE file for details 