#!/bin/bash

set -euo pipefail

# Global variables
PLUGIN_NAME="pika"
PLUGIN_FILE="pika.php"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if buildignore exists
if [ ! -f .buildignore ]; then
    echo -e "❌ ${RED}Error: .buildignore file not found. Please run this script from the root directory of the project.${NC}"
    exit 1
fi

# Get version from plugin file
if ! VERSION=$(grep -oP "Version:\s*\K[0-9.]+" "$PLUGIN_FILE"); then
    echo -e "${RED}❌ Could not extract version from plugin file${NC}"
    exit 1
fi

if [ -z "$VERSION" ]; then
    echo -e "${RED}❌ Version string is empty in plugin file${NC}"
    exit 1
fi

ZIP_NAME="${PLUGIN_NAME}-v${VERSION}.zip"

cat << "EOF"
 ____  _ _         
|  _ \(_) | ____ _ 
| |_) | | |/ / _` |
|  __/| |   < (_| |
|_|   |_|_|\_\__,_|

EOF

echo -e "${BLUE}=== Building ${PLUGIN_NAME} v${VERSION} ===${NC}\n"

# Check if zip file already exists
if [ -f "$ZIP_NAME" ]; then
    echo -e "⚠️ ${YELLOW}Zip file '$ZIP_NAME' already exists.${NC}"
    read -r -p "Do you want to replace it? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo -e "${RED}Exiting without replacing the zip file.${NC}"
        exit 1
    else
        rm -f "$ZIP_NAME"
        echo -e "${GREEN}Old zip file removed. Continuing build...${NC}"
    fi
fi

# Build frontend
echo -e "⚙️ ${YELLOW}Stage 1: Building frontend...${NC}"
if [ ! -d frontend ]; then
    echo -e "❌ ${RED}Frontend directory not found!${NC}"
    exit 1
fi
pushd frontend > /dev/null
if ! npm run build; then
    echo -e "❌ ${RED}Build failed!${NC}"
    popd > /dev/null
    exit 1
fi
popd > /dev/null
echo -e "${GREEN}✅ Frontend built successfully${NC}\n"

# Create temporary directory
TEMP_DIR="temp-${PLUGIN_NAME}"
rm -rf "${TEMP_DIR}"
mkdir -p "${TEMP_DIR}"
echo -e "⚙️ ${YELLOW}Stage 2: Creating temporary directory: ${TEMP_DIR}${NC}"

# Copy files except those in .buildignore
echo -e "${YELLOW}⚙️ Stage 3: Copying files to temp directory...${NC}"
rsync -av --exclude-from='.buildignore' ./ "${TEMP_DIR}/" > /dev/null

# Create zip file
echo -e "${YELLOW}⚙️ Stage 4: Creating zip file...${NC}"
pushd "${TEMP_DIR}" > /dev/null
if ! zip -r "../${ZIP_NAME}" . > /dev/null; then
    echo -e "❌ ${RED}Zip creation failed!${NC}"
    popd > /dev/null
    exit 1
fi
popd > /dev/null
echo -e "✅ ${GREEN}Zip file created: ${ZIP_NAME}${NC}\n"

# Clean up
echo -e "${YELLOW}⚙️ Stage 5: Cleaning up...${NC}"
rm -rf "${TEMP_DIR}"
echo -e "✅ ${GREEN}Cleanup complete${NC}\n"

echo -e "${BLUE}=== Build completed successfully! ===${NC}"
echo -e "Plugin zip: ${GREEN}${ZIP_NAME}${NC}" 
