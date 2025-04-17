# Package (ZIP/compress) all the necessary files
# Requires 7-ZIP!

# Colors used for echo
GREEN='\033[0;32m'
L_GREEN='\033[1;92m'
YELLOW='\033[0;33m'

# The files/folders to be included in the package
FILES=(
  "icons"
  "manifest.json"
  "background.js")

# Extract version from manifest.json
VERSION=$(grep -oP '"version": "\K[0-9.]+(?=")' manifest.json)

# Create ZIP file using 7-Zip
ZIP_FILE="Simple YouTube Windowed Fullscreen $VERSION.zip"
7z a -tzip "$ZIP_FILE" "${FILES[@]}" > /dev/null

# Notify user
echo -e "${GREEN}Files packaged into ${L_GREEN}$ZIP_FILE${GREEN} successfully\n${YELLOW}"
# Keep terminal window open
read -n 1 -s -r -p "Press any key to exit..."
