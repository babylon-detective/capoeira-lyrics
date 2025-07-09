export class LyricsService {
    constructor() {
        this.authorsIndex = null;
        this.authorData = new Map();
        this.authors = new Map();
        this.songTypes = new Set();
    }
    async loadAuthorsIndex() {
        try {
            const cacheBuster = `?cb=${new Date().getTime()}`;
            const response = await fetch(`/authors-index.json${cacheBuster}`);
            if (!response.ok) {
                throw new Error(`Failed to load authors index: ${response.statusText}`);
            }
            const data = await response.json();
            this.authorsIndex = data;
            return data;
        }
        catch (error) {
            console.error('Error loading authors index:', error);
            throw error;
        }
    }
    async loadAuthorData(authorId) {
        if (this.authorData.has(authorId)) {
            return this.authorData.get(authorId);
        }
        if (!this.authorsIndex) {
            await this.loadAuthorsIndex();
        }
        const authorInfo = this.authorsIndex.authors.find(a => a.id === authorId);
        if (!authorInfo) {
            throw new Error(`Author ${authorId} not found in index`);
        }
        try {
            const cacheBuster = `?cb=${new Date().getTime()}`;
            const response = await fetch(`/authors/${authorInfo.file}${cacheBuster}`);
            if (!response.ok) {
                throw new Error(`Failed to load data for author ${authorId}: ${response.statusText}`);
            }
            const data = await response.json();
            this.authorData.set(authorId, data);
            this.processAuthorData(authorId, data);
            return data;
        }
        catch (error) {
            console.error(`Error loading data for author ${authorId}:`, error);
            throw error;
        }
    }
    async loadData() {
        // Load authors index first
        await this.loadAuthorsIndex();
        // Load all author data
        const allSongs = [];
        for (const authorInfo of this.authorsIndex.authors) {
            try {
                const authorData = await this.loadAuthorData(authorInfo.id);
                allSongs.push(...authorData.songs);
            }
            catch (error) {
                console.warn(`Failed to load data for author ${authorInfo.id}:`, error);
            }
        }
        // Return combined data
        return { songs: allSongs };
    }
    processAuthorData(authorId, data) {
        if (!data)
            return;
        // Extract unique song types
        data.songs.forEach(song => {
            this.songTypes.add(song.type);
            if (!this.authors.has(song.author)) {
                this.authors.set(song.author, {
                    id: song.author.toLowerCase().replace(/\s+/g, '-'),
                    name: song.author,
                    albums: []
                });
            }
        });
        // Group songs by author, album, and track for this specific author
        this.groupSongsByStructure(data);
    }
    groupSongsByStructure(data) {
        if (!data)
            return;
        const authorGroups = new Map();
        data.songs.forEach(song => {
            if (!authorGroups.has(song.author)) {
                authorGroups.set(song.author, new Map());
            }
            const authorMap = authorGroups.get(song.author);
            if (!authorMap.has(song.album)) {
                authorMap.set(song.album, new Map());
            }
            const albumMap = authorMap.get(song.album);
            if (!albumMap.has(song.track)) {
                albumMap.set(song.track, []);
            }
            albumMap.get(song.track).push(song);
        });
        // Convert to Author structure
        authorGroups.forEach((albumMap, authorName) => {
            let author = this.authors.get(authorName);
            if (!author) {
                author = {
                    id: authorName.toLowerCase().replace(/\s+/g, '-'),
                    name: authorName,
                    albums: []
                };
                this.authors.set(authorName, author);
            }
            const albums = [];
            albumMap.forEach((trackMap, albumName) => {
                const tracks = [];
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
    getAvailableAuthors() {
        return this.authorsIndex?.authors || [];
    }
    getAuthors() {
        return Array.from(this.authors.values());
    }
    getAuthorById(authorId) {
        return Array.from(this.authors.values()).find(author => author.id === authorId);
    }
    async getSongsByAuthor(authorName) {
        // Find the author ID from the index
        const authorInfo = this.authorsIndex?.authors.find(a => a.name === authorName);
        if (!authorInfo)
            return [];
        // Load the author's data if not already loaded
        const data = await this.loadAuthorData(authorInfo.id);
        return data.songs.filter(song => song.author === authorName);
    }
    getSongTypes() {
        return Array.from(this.songTypes).sort();
    }
    async getSongsByType(type) {
        const allSongs = [];
        for (const [authorId, data] of this.authorData.entries()) {
            allSongs.push(...data.songs.filter(song => song.type === type));
        }
        return allSongs;
    }
    getSupportedLanguages() {
        return ['english', 'español'];
    }
    formatLyrics(lyrics) {
        return lyrics.map((line, index) => {
            let formatted = line;
            // Replace chorus markers with <b> tags (chorus lines start with ^)
            if (formatted.startsWith('^')) {
                formatted = formatted.substring(1); // Remove the ^
                formatted = formatted.replace(/\|$/, ''); // Remove the trailing |
                formatted = `<b>${formatted}</b><br>`;
            }
            else {
                // Replace bold markers with <b> tags
                formatted = formatted.replace(/\*(.*?)\*/g, '<b>$1</b>');
                // Replace line break markers with <br> tags
                formatted = formatted.replace(/\|/g, '<br>');
            }
            return formatted;
        }).join('');
    }
    getLanguageKey(language) {
        switch (language) {
            case 'english': return 'english';
            case 'español': return 'español';
            default: return 'português';
        }
    }
}
//# sourceMappingURL=LyricsService.js.map