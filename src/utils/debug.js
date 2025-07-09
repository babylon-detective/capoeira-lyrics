export function debugSongStructure(song) {
    console.log('Song structure:', {
        author: song.author,
        album: song.album,
        track: song.track,
        type: song.type,
        title: song.title,
        lyrics: {
            portuguese: song.lyrics.português?.length || 0,
            translations: {
                english: song.lyrics.translations?.english?.length || 0,
                spanish: song.lyrics.translations?.español?.length || 0
            }
        }
    });
}
export function validateSongForLanguage(song, language) {
    try {
        if (language === 'português') {
            return Array.isArray(song.lyrics.português) && song.lyrics.português.length > 0;
        }
        else {
            const translationKey = language;
            return Array.isArray(song.lyrics.translations[translationKey]) &&
                song.lyrics.translations[translationKey].length > 0;
        }
    }
    catch (error) {
        console.error(`Validation failed for song ${song.title.português} in language ${language}:`, error);
        return false;
    }
}
//# sourceMappingURL=debug.js.map