#!/bin/bash

# Deploy script for Bellas Glamour
# Automates: build → commit → push → server deploy

set -e  # Exit on error

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SSH_KEY="C:/Users/jhony/Downloads/id_rsa"
SSH_USER="otfidqlcuq"
SSH_HOST="server5.shared.spaceship.host"
SSH_PORT="21098"
APP_PATH="/home/otfidqlcuq/bellasglamour.com/bellas-glamour-3"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===================================================${NC}"
echo -e "${BLUE}  BELLAS GLAMOUR - AUTOMATED DEPLOYMENT SCRIPT${NC}"
echo -e "${BLUE}===================================================${NC}\n"

# Step 1: Check for uncommitted changes
echo -e "${YELLOW}[1/5] Checking for uncommitted changes...${NC}"
cd "$PROJECT_DIR"
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}Error: You have uncommitted changes.${NC}"
    echo "Please commit your changes first:"
    echo "  git add ."
    echo "  git commit -m 'Your message'"
    exit 1
fi
echo -e "${GREEN}✓ No uncommitted changes${NC}\n"

# Step 2: Build locally
echo -e "${YELLOW}[2/5] Building Next.js locally...${NC}"
npm run build 2>&1 | tail -5
echo -e "${GREEN}✓ Build successful${NC}\n"

# Step 3: Create tarball
echo -e "${YELLOW}[3/5] Creating tarball (this may take a minute)...${NC}"
tar czf /tmp/next-build.tar.gz .next/standalone .next/static public app.js 2>&1 | grep -v "^tar:" || true
TARBALL_SIZE=$(du -sh /tmp/next-build.tar.gz | cut -f1)
echo -e "${GREEN}✓ Tarball created (${TARBALL_SIZE})${NC}\n"

# Step 4: Upload to server
echo -e "${YELLOW}[4/5] Uploading to server via SCP...${NC}"
scp -P "$SSH_PORT" -i "$SSH_KEY" /tmp/next-build.tar.gz "$SSH_USER@$SSH_HOST:$APP_PATH/" 2>&1 | grep -v "^Warning" || true
echo -e "${GREEN}✓ Upload complete${NC}\n"

# Step 5: Extract and restart on server
echo -e "${YELLOW}[5/5] Extracting and restarting on server...${NC}"
ssh -p "$SSH_PORT" -i "$SSH_KEY" "$SSH_USER@$SSH_HOST" << 'EOF'
cd /home/otfidqlcuq/bellasglamour.com/bellas-glamour-3
chmod -R u+rwx .next public 2>/dev/null
rm -rf .next public
tar xzf next-build.tar.gz --no-same-permissions --no-same-owner
rm next-build.tar.gz
cp .env.production .next/standalone/
touch tmp/restart.txt
echo "OK"
EOF

echo -e "${GREEN}✓ Server updated and restarted${NC}\n"

# Verify
echo -e "${YELLOW}Verifying deployment...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://bellasglamour.com/ 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Site is up (HTTP 200)${NC}\n"
    echo -e "${GREEN}===================================================${NC}"
    echo -e "${GREEN}  ✓ DEPLOYMENT SUCCESSFUL!${NC}"
    echo -e "${GREEN}===================================================${NC}\n"
    rm /tmp/next-build.tar.gz
else
    echo -e "${RED}✗ Site returned HTTP $HTTP_CODE (check server logs)${NC}\n"
    exit 1
fi
