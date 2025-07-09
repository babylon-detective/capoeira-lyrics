#!/bin/bash

# Clean up old files after TypeScript migration
echo "Cleaning up old files..."

# Remove old JavaScript file
if [ -f "script.js" ]; then
    echo "Removing old script.js..."
    rm script.js
fi

# Remove old JSON file from root (it's now in public/)
if [ -f "palmares_lyrics.json" ]; then
    echo "Removing palmares_lyrics.json from root (it's now in public/)..."
    rm palmares_lyrics.json
fi

echo "Cleanup complete!"
echo ""
echo "To start development: npm run dev"
echo "To build for production: npm run build" 