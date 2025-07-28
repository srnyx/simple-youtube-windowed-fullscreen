# Get extension path
CURRENT_DIRECTORY=$(pwd)
EXTENSION_PATH=$(cygpath -w "$CURRENT_DIRECTORY/Extension")

# Get private key file
PEM_FILE=$(cygpath -w "$CURRENT_DIRECTORY/$(ls *.pem 2>/dev/null | head -n 1)")

# Package using Chrome
"C:\Program Files\Google\Chrome\Application\chrome.exe" --pack-extension="$EXTENSION_PATH" --pack-extension-key="$PEM_FILE"

# Extract version from manifest.json for file name
VERSION=$(grep -oP '"version": "\K[0-9.]+(?=")' "Extension/manifest.json")
FILE_NAME="Simple YouTube Windowed Fullscreen $VERSION.crx"

# Rename Extension.crx to FILE_NAME
mv Extension.crx "$FILE_NAME"

# Notify user
echo -e "${GREEN}Files packaged into ${L_GREEN}$FILE_NAME${GREEN} successfully\n${YELLOW}"
# Keep terminal window open
read -n 1 -s -r -p "Press any key to exit..."
