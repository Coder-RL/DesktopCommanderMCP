#!/bin/bash

# Fix MCP Ecosystem Issues
MCP_ECOSYSTEM_DIR="/Users/robertlee/GitHubProjects/claude-desktop-mcp-ecosystem"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}       Fixing MCP Ecosystem Issues                ${NC}"
echo -e "${BLUE}==================================================${NC}"

# Fix 1: ChromaDB issues
echo -e "${YELLOW}1. Installing/Starting ChromaDB...${NC}"
if ! command -v chromadb &> /dev/null; then
    echo "Installing ChromaDB..."
    pip3 install chromadb
fi

# Check if ChromaDB is running
if ! curl -s http://localhost:8000/api/v1 > /dev/null 2>&1; then
    echo "Starting ChromaDB server..."
    cd "$MCP_ECOSYSTEM_DIR"
    # Start ChromaDB in the background
    chromadb &
    CHROMADB_PID=$!
    echo "ChromaDB started with PID: $CHROMADB_PID"
    sleep 5
fi

# Fix 2: Tree-sitter module version mismatch
echo -e "${YELLOW}2. Fixing tree-sitter module mismatch...${NC}"
cd "$MCP_ECOSYSTEM_DIR/src/mcp-context-allocator"
npm rebuild tree-sitter
npm install

# Fix 3: Rebuild all services that have node_modules issues
echo -e "${YELLOW}3. Rebuilding services with native modules...${NC}"
SERVICES_TO_REBUILD=(
    "mcp-working-memory"
    "mcp-context-allocator"
    "mcp-documentation-agent"
    "mcp-codebase-indexer"
)

for service in "${SERVICES_TO_REBUILD[@]}"; do
    SERVICE_DIR="$MCP_ECOSYSTEM_DIR/src/$service"
    if [ -d "$SERVICE_DIR" ]; then
        echo "Rebuilding $service..."
        cd "$SERVICE_DIR"
        rm -rf node_modules package-lock.json
        npm install
        npm rebuild
    fi
done

# Fix 4: Ensure OpenSearch is running (alternative to ChromaDB)
echo -e "${YELLOW}4. Checking OpenSearch status...${NC}"
cd "$MCP_ECOSYSTEM_DIR"
if [ -f "./scripts/ensure-opensearch.sh" ]; then
    ./scripts/ensure-opensearch.sh
fi

# Fix 5: Create necessary data directories
echo -e "${YELLOW}5. Creating data directories...${NC}"
mkdir -p "$MCP_ECOSYSTEM_DIR/data/chroma"
mkdir -p "$MCP_ECOSYSTEM_DIR/data/metrics"
mkdir -p "$MCP_ECOSYSTEM_DIR/data/logs"
mkdir -p "$MCP_ECOSYSTEM_DIR/logs"

# Fix 6: Install Python dependencies for ecosystem
echo -e "${YELLOW}6. Installing Python dependencies...${NC}"
cd "$MCP_ECOSYSTEM_DIR"
if [ -f "requirements.txt" ]; then
    pip3 install -r requirements.txt
fi

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}       MCP Ecosystem Issues Fixed!                ${NC}"
echo -e "${GREEN}==================================================${NC}"
echo ""
echo "Next steps:"
echo "1. Run: dc stop   (to stop everything)"
echo "2. Run: dc start  (to start with fixes applied)"