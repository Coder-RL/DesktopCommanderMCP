#!/bin/bash

# Force Restart All Services with Proper Configuration
MCP_ECOSYSTEM_DIR="/Users/robertlee/GitHubProjects/claude-desktop-mcp-ecosystem"
DESKTOP_COMMANDER_DIR="/Users/robertlee/GitHubProjects/DesktopCommanderMCP"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${RED}==================================================${NC}"
echo -e "${RED}    FORCE KILLING ALL PROCESSES                   ${NC}"
echo -e "${RED}==================================================${NC}"

# Kill EVERYTHING first
echo -e "${YELLOW}Killing all MCP-related processes...${NC}"

# Kill Node.js processes
pkill -f "node.*mcp-" 2>/dev/null
pkill -f "node.*desktop-commander" 2>/dev/null
pkill -f "node.*DesktopCommanderMCP" 2>/dev/null
pkill -f "node.*claude-desktop-mcp-ecosystem" 2>/dev/null

# Kill Python processes
pkill -f "python.*mcp-" 2>/dev/null
pkill -f "python.*semantic" 2>/dev/null

# Kill ChromaDB processes (native)
pkill -f "chromadb" 2>/dev/null

# Kill any dashboard processes
pkill -f "vite" 2>/dev/null
pkill -f "dashboard" 2>/dev/null

echo "All processes killed. Waiting for cleanup..."
sleep 3

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}    CHECKING DOCKER CHROMADB                      ${NC}"
echo -e "${BLUE}==================================================${NC}"

# Check if ChromaDB is running in Docker
CHROMADB_CONTAINER=$(docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "chroma|chromadb")

if [ ! -z "$CHROMADB_CONTAINER" ]; then
    echo -e "${GREEN}ChromaDB is running in Docker:${NC}"
    echo "$CHROMADB_CONTAINER"
    
    # Get the actual port mapping
    CHROMADB_PORT=$(docker port $(docker ps -q -f name=chroma) 8000/tcp 2>/dev/null | cut -d: -f2)
    if [ -z "$CHROMADB_PORT" ]; then
        CHROMADB_PORT=$(docker port $(docker ps -q -f name=chromadb) 8000/tcp 2>/dev/null | cut -d: -f2)
    fi
    
    if [ ! -z "$CHROMADB_PORT" ]; then
        echo -e "${GREEN}ChromaDB is accessible on port: $CHROMADB_PORT${NC}"
        CHROMADB_URL="http://localhost:$CHROMADB_PORT"
    else
        echo -e "${YELLOW}Warning: Could not determine ChromaDB port mapping${NC}"
        CHROMADB_URL="http://localhost:8000"
    fi
else
    echo -e "${YELLOW}ChromaDB not found in Docker. Will start native version.${NC}"
    CHROMADB_URL="http://localhost:8000"
fi

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}    CONFIGURING SERVICES                          ${NC}"
echo -e "${BLUE}==================================================${NC}"

# Create environment configuration file
cat > "$MCP_ECOSYSTEM_DIR/.env" << EOF
CHROMADB_URL=$CHROMADB_URL
CHROMADB_PORT=${CHROMADB_PORT:-8000}
NODE_OPTIONS=--max-old-space-size=4096
EOF

# Update service configurations to use the correct ChromaDB URL
echo -e "${YELLOW}Updating service configurations...${NC}"

# Fix working memory service
WORKING_MEMORY_CONFIG="$MCP_ECOSYSTEM_DIR/src/mcp-working-memory/index.js"
if [ -f "$WORKING_MEMORY_CONFIG" ]; then
    # Backup original
    cp "$WORKING_MEMORY_CONFIG" "$WORKING_MEMORY_CONFIG.bak"
    
    # Update ChromaDB URL in the file
    sed -i '' "s|http://localhost:8000|$CHROMADB_URL|g" "$WORKING_MEMORY_CONFIG"
fi

# Fix context allocator service
CONTEXT_ALLOCATOR_CONFIG="$MCP_ECOSYSTEM_DIR/src/mcp-context-allocator/index.js"
if [ -f "$CONTEXT_ALLOCATOR_CONFIG" ]; then
    cp "$CONTEXT_ALLOCATOR_CONFIG" "$CONTEXT_ALLOCATOR_CONFIG.bak"
    sed -i '' "s|http://localhost:8000|$CHROMADB_URL|g" "$CONTEXT_ALLOCATOR_CONFIG"
fi

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}    STARTING SERVICES WITH CORRECT CONFIG         ${NC}"
echo -e "${BLUE}==================================================${NC}"

# Start ChromaDB if not in Docker
if [ -z "$CHROMADB_CONTAINER" ]; then
    echo -e "${YELLOW}Starting native ChromaDB...${NC}"
    mkdir -p "$MCP_ECOSYSTEM_DIR/data/chroma"
    cd "$MCP_ECOSYSTEM_DIR/data/chroma"
    
    CHROMA_SERVER_SSL_ENABLED=false \
    CHROMA_SERVER_HOST=0.0.0.0 \
    CHROMA_SERVER_PORT=8000 \
    chromadb run --path . > "$MCP_ECOSYSTEM_DIR/logs/chromadb.log" 2>&1 &
    
    sleep 5
fi

# Test ChromaDB connectivity
echo -e "${YELLOW}Testing ChromaDB connectivity...${NC}"
if curl -s "$CHROMADB_URL/api/v1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ ChromaDB is accessible at $CHROMADB_URL${NC}"
else
    echo -e "${RED}✗ ChromaDB is NOT accessible at $CHROMADB_URL${NC}"
    echo "Please check Docker logs: docker logs chromadb"
fi

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}    SYSTEM READY FOR STARTUP                      ${NC}"
echo -e "${GREEN}==================================================${NC}"
echo ""
echo "Configuration complete. Now run:"
echo "  dc start"
echo ""
echo "Services will use ChromaDB at: $CHROMADB_URL"