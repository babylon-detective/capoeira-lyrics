// Function to format lyrics with HTML tags
function formatLyrics(lyrics) {
    return lyrics.map(line => {
        // Replace bold markers with <b> tags
        let formatted = line.replace(/\*(.*?)\*/g, '<b>$1</b>');
        
        // Replace line break markers with <br> tags
        formatted = formatted.replace(/\|/g, '<br>');
        
        return formatted;
    }).join('');
}

// Function to update the lyrics display
function updateLyricsDisplay(songs) {
    console.log('Updating lyrics display with songs:', songs);
    if (!songs || songs.length === 0) {
        console.error('No songs provided to display');
        return;
    }
    
    // Group songs by track and sort track names to ensure Track 1 appears before Track 2
    const trackGroups = {};
    songs.forEach(song => {
        if (!trackGroups[song.track]) {
            trackGroups[song.track] = [];
        }
        trackGroups[song.track].push(song);
    });
    
    // Store track groups for alignment with translations
    window.currentTrackGroups = trackGroups;
    
    // Build HTML for each track group with sorted track names
    let lyricsHTML = '';
    
    // Sort track names to ensure Track 1 comes before Track 2
    const sortedTrackNames = Object.keys(trackGroups).sort();
    
    sortedTrackNames.forEach(trackName => {
        // Add track header with ID for alignment
        lyricsHTML += `<h2 id="lyrics-track-${trackName.replace(/\s+/g, '-')}">${trackName}</h2>`;
        
        // Add songs for this track
        trackGroups[trackName].forEach((song, index) => {
            lyricsHTML += `
                <div class="song-section" id="lyrics-song-${index}-${trackName.replace(/\s+/g, '-')}">
                    <b>${song.type}</b><br>
                    <b>${song.title['português']}</b><br>
                    ${formatLyrics(song.lyrics['português'])}
                </div>
                <hr>
            `;
        });
    });
    
    // Insert into DOM
    document.querySelector('.lyrics-column .content-container').innerHTML = lyricsHTML;
    
    // Don't remove the track title - we want to keep it
    // document.querySelector('.lyrics-column h2').textContent = '';
}

// Function to update the translation display
function updateTranslationDisplay(songs, language) {
    console.log('Updating translation display with songs:', songs);
    if (!songs || songs.length === 0) {
        console.error('No songs provided to display');
        return;
    }
    
    // Convert language code to match JSON keys
    const languageKey = language === 'en' ? 'english' : 'español';
    
    // Use the same track groups as lyrics for perfect alignment
    const trackGroups = window.currentTrackGroups || {};
    if (!window.currentTrackGroups) {
        // If not already grouped (shouldn't happen normally), do it again
        songs.forEach(song => {
            if (!trackGroups[song.track]) {
                trackGroups[song.track] = [];
            }
            trackGroups[song.track].push(song);
        });
    }
    
    // Build HTML for each track group
    let translationsHTML = '';
    
    // Sort track names to ensure Track 1 comes before Track 2
    const sortedTrackNames = Object.keys(trackGroups).sort();
    
    sortedTrackNames.forEach(trackName => {
        // Add track header with ID for alignment
        translationsHTML += `<h2 id="trans-track-${trackName.replace(/\s+/g, '-')}">${trackName}</h2>`;
        
        // Add translations for this track
        trackGroups[trackName].forEach((song, index) => {
            translationsHTML += `
                <div class="translation-section" id="trans-song-${index}-${trackName.replace(/\s+/g, '-')}">
                    <b>${song.type}</b><br>
                    <b>${song.title[languageKey]}</b><br>
                    ${formatLyrics(song.lyrics.translations[languageKey])}
                </div>
                <hr>
            `;
        });
    });
    
    // Insert into DOM
    document.querySelector('.translation-column .content-container').innerHTML = translationsHTML;
    
    // Don't remove the track title - we want to keep it
    // document.querySelector('.translation-column h2').textContent = '';
}

// Function to clear the display
function clearDisplay() {
    document.querySelector('.lyrics-column h2').textContent = '';
    document.querySelector('.lyrics-column .content-container').innerHTML = '';
    document.querySelector('.translation-column .content-container').innerHTML = '';
}

// Load and initialize the data
async function initializeApp() {
    try {
        // Add cache-busting parameter to prevent browser from using cached version
        const cacheBuster = `?cb=${new Date().getTime()}`;
        const response = await fetch('capoeira_lyrics.json' + cacheBuster);
        const data = await response.json();
        console.log('Loaded data:', data);
        console.log('Total number of songs:', data.songs.length);
        console.log('Songs array:', data.songs);
        console.log('Author names in songs array:', data.songs.map(song => song.author));
        
        // Set up event listeners
        const songSelect = document.getElementById('songSelect');
        const languageSelect = document.getElementById('languageSelect');
        
        // Initially disable language selector
        languageSelect.disabled = true;
        
        songSelect.addEventListener('change', (e) => {
            console.log('Song select changed to:', e.target.value);
            if (e.target.value === '') {
                clearDisplay();
                languageSelect.disabled = true;
                return;
            }
            
            // Enable language selector
            languageSelect.disabled = false;
            
            // Get all songs for the selected author
            const selectedAuthor = e.target.value;
            console.log('Selected author:', selectedAuthor);
            console.log('Available authors:', data.songs.map(song => song.author));
            
            const authorSongs = data.songs.filter(song => song.author === selectedAuthor);
            console.log('Songs for author:', authorSongs);
            
            if (authorSongs.length === 0) {
                console.error('No songs found for author:', selectedAuthor);
                return;
            }
            
            // Update displays with all songs for the author
            updateLyricsDisplay(authorSongs);
            
            // Set default language to English and update translation
            languageSelect.value = 'en';
            updateTranslationDisplay(authorSongs, 'en');
        });

        languageSelect.addEventListener('change', (e) => {
            console.log('Language select changed to:', e.target.value);
            if (e.target.value === '') {
                document.querySelector('.translation-column .content-container').innerHTML = '';
                return;
            }
            
            const selectedAuthor = songSelect.value;
            const authorSongs = data.songs.filter(song => song.author === selectedAuthor);
            updateTranslationDisplay(authorSongs, e.target.value);
        });

    } catch (error) {
        console.error('Error loading lyrics:', error);
        document.querySelector('.lyrics-column .content-container').innerHTML = 'Error loading lyrics. Please try again.';
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', initializeApp);