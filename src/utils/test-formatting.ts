import { LyricsService } from '../services/LyricsService';

export function testFormatting() {
  const service = new LyricsService();
  
  const testLyrics = [
    "Normal line|",
    "^Chorus line|",
    "Another normal line|",
    "^Another chorus line|"
  ];
  
  console.log('Testing lyrics formatting:');
  console.log('Input:', testLyrics);
  console.log('Output:', service.formatLyrics(testLyrics));
} 