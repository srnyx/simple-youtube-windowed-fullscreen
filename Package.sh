# Package (ZIP/compress) all the necessary files
# Requires 7-ZIP!

# Colors used for echo
GREEN='\033[0;32m'
L_GREEN='\033[1;92m'
YELLOW='\033[0;33m'

# Extract version from manifest.json
VERSION=$(grep -oP '"version": "\K[0-9.]+(?=")' "Extension/manifest.json")

# Create ZIP file using 7-Zip
ZIP_FILE="Simple YouTube Windowed Fullscreen $VERSION.zip"
(
  cd "Extension" || exit
  7z a -tzip "../$ZIP_FILE" ./* ./.* > /dev/null
)

# Notify user
echo -e "${GREEN}Files packaged into ${L_GREEN}$ZIP_FILE${GREEN} successfully\n${YELLOW}"
# Keep terminal window open
read -n 1 -s -r -p "Press any key to exit..."
