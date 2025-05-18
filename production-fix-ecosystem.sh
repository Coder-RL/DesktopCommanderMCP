#!/bin/bash

# Production-Grade Fix for MCP Ecosystem
MCP_ECOSYSTEM_DIR="/Users/robertlee/GitHubProjects/claude-desktop-mcp-ecosystem"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}    Production-Grade MCP Ecosystem Setup          ${NC}"
echo -e "${BLUE}==================================================${NC}"

# Function to check if a service is running
check_service() {
    local service_name=$1
    local port=$2
    local url=$3
    
    echo -n "Checking $service_name on port $port... "
    if curl -s $url > /dev/null 2>&1; then
        echo -e "${GREEN}RUNNING${NC}"
        return 0
    else
        echo -e "${RED}NOT RUNNING${NC}"
        return 1
    fi
}

# Function to forcefully start ChromaDB
start_chromadb() {
    echo -e "${YELLOW}Starting ChromaDB...${NC}"
    
    # Kill any existing ChromaDB processes
    pkill -f "chromadb" 2>/dev/null
    sleep 2
    
    # Check if ChromaDB is installed
    if ! command -v chromadb &> /dev/null; then
        echo "Installing ChromaDB..."
        pip3 install chromadb
    fi
    
    # Create ChromaDB data directory
    CHROMA_DIR="$MCP_ECOSYSTEM_DIR/data/chroma"
    mkdir -p "$CHROMA_DIR"
    
    # Start ChromaDB with specific settings
    cd "$CHROMA_DIR"
    echo "Starting ChromaDB server..."
    CHROMA_SERVER_SSL_ENABLED=false \
    CHROMA_SERVER_HOST=0.0.0.0 \
    CHROMA_SERVER_PORT=8000 \
    chromadb run --path "$CHROMA_DIR" > "$MCP_ECOSYSTEM_DIR/logs/chromadb.log" 2>&1 &
    
    CHROMADB_PID=$!
    echo "ChromaDB started with PID: $CHROMADB_PID"
    
    # Wait for ChromaDB to be ready
    echo -n "Waiting for ChromaDB to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:8000/api/v1 > /dev/null 2>&1; then
            echo -e " ${GREEN}READY${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
    done
    echo -e " ${RED}TIMEOUT${NC}"
    return 1
}

# Function to forcefully start OpenSearch
start_opensearch() {
    echo -e "${YELLOW}Starting OpenSearch...${NC}"
    
    # Check if OpenSearch is installed
    if ! command -v opensearch &> /dev/null; then
        echo "OpenSearch not found. Installing with Docker..."
        
        # Check if Docker is installed
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}Docker is required for OpenSearch. Please install Docker.${NC}"
            return 1
        fi
        
        # Run OpenSearch in Docker
        docker pull opensearchproject/opensearch:latest
        
        # Stop any existing OpenSearch containers
        docker stop opensearch 2>/dev/null
        docker rm opensearch 2>/dev/null
        
        # Start OpenSearch
        docker run -d \
            --name opensearch \
            -p 9200:9200 \
            -p 9600:9600 \
            -e "discovery.type=single-node" \
            -e "DISABLE_SECURITY_PLUGIN=true" \
            opensearchproject/opensearch:latest
        
        echo "OpenSearch Docker container started"
    else
        # Use native OpenSearch installation
        opensearch > "$MCP_ECOSYSTEM_DIR/logs/opensearch.log" 2>&1 &
        echo "Native OpenSearch started"
    fi
    
    # Wait for OpenSearch to be ready
    echo -n "Waiting for OpenSearch to be ready..."
    for i in {1..60}; do
        if curl -s http://localhost:9200 > /dev/null 2>&1; then
            echo -e " ${GREEN}READY${NC}"
            return 0
        fi
        echo -n "."
        sleep 1
    done
    echo -e " ${RED}TIMEOUT${NC}"
    return 1
}

# Function to fix Node.js module mismatches
fix_node_modules() {
    echo -e "${YELLOW}Fixing Node.js module mismatches...${NC}"
    
    # Get current Node.js version
    NODE_VERSION=$(node -v)
    echo "Current Node.js version: $NODE_VERSION"
    
    # Services that need rebuilding
    SERVICES=(
        "mcp-working-memory"
        "mcp-context-allocator"
        "mcp-documentation-agent"
        "mcp-codebase-indexer"
        "mcp-semantic-memory-manager"
    )
    
    for service in "${SERVICES[@]}"; do
        SERVICE_DIR="$MCP_ECOSYSTEM_DIR/src/$service"
        if [ -d "$SERVICE_DIR" ]; then
            echo "Rebuilding $service..."
            cd "$SERVICE_DIR"
            rm -rf node_modules package-lock.json
            npm cache clean --force
            npm install
            npm rebuild
        fi
    done
}

# Function to create systemd services (for Linux) or launchd services (for macOS)
create_system_services() {
    echo -e "${YELLOW}Creating system services...${NC}"
    
    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS - create launchd services
        echo "Creating launchd services for macOS..."
        
        # ChromaDB service
        cat > ~/Library/LaunchAgents/com.mcp.chromadb.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.mcp.chromadb</string>
    <key>ProgramArguments</key>
    <array>
        <string>$(which chromadb)</string>
        <string>run</string>
        <string>--path</string>
        <string>$MCP_ECOSYSTEM_DIR/data/chroma</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$MCP_ECOSYSTEM_DIR/logs/chromadb.log</string>
    <key>StandardErrorPath</key>
    <string>$MCP_ECOSYSTEM_DIR/logs/chromadb.error.log</string>
</dict>
</plist>
EOF
        
        # Load the service
        launchctl load ~/Library/LaunchAgents/com.mcp.chromadb.plist
        
    else
        # Linux - create systemd services
        echo "Creating systemd services for Linux..."
        
        # ChromaDB service
        sudo cat > /etc/systemd/system/chromadb.service << EOF
[Unit]
Description=ChromaDB Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$MCP_ECOSYSTEM_DIR/data/chroma
ExecStart=$(which chromadb) run --path $MCP_ECOSYSTEM_DIR/data/chroma
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
        
        # Enable and start the service
        sudo systemctl daemon-reload
        sudo systemctl enable chromadb
        sudo systemctl start chromadb
    fi
}

# Main execution
echo -e "${BLUE}1. Checking current service status...${NC}"
check_service "ChromaDB" 8000 "http://localhost:8000/api/v1"
CHROMA_RUNNING=$?

check_service "OpenSearch" 9200 "http://localhost:9200"
OPENSEARCH_RUNNING=$?

echo -e "\n${BLUE}2. Starting required services...${NC}"
if [ $CHROMA_RUNNING -ne 0 ]; then
    start_chromadb
fi

if [ $OPENSEARCH_RUNNING -ne 0 ]; then
    start_opensearch
fi

echo -e "\n${BLUE}3. Fixing Node.js modules...${NC}"
fix_node_modules

echo -e "\n${BLUE}4. Creating persistent service configurations...${NC}"
create_system_services

echo -e "\n${BLUE}5. Creating startup script...${NC}"
cat > "$DESKTOP_COMMANDER_DIR/ensure-services.sh" << 'EOF'
#!/bin/bash
# Ensure MCP services are running

# Check and start ChromaDB
if ! curl -s http://localhost:8000/api/v1 > /dev/null 2>&1; then
    echo "Starting ChromaDB..."
    chromadb run --path "$MCP_ECOSYSTEM_DIR/data/chroma" > "$MCP_ECOSYSTEM_DIR/logs/chromadb.log" 2>&1 &
    sleep 5
fi

# Check and start OpenSearch
if ! curl -s http://localhost:9200 > /dev/null 2>&1; then
    echo "Starting OpenSearch..."
    if command -v docker &> /dev/null; then
        docker start opensearch 2>/dev/null || docker run -d --name opensearch -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" -e "DISABLE_SECURITY_PLUGIN=true" opensearchproject/opensearch:latest
    fi
fi
EOF

chmod +x "$DESKTOP_COMMANDER_DIR/ensure-services.sh"

echo -e "\n${GREEN}==================================================${NC}"
echo -e "${GREEN}    Production Setup Complete!                    ${NC}"
echo -e "${GREEN}==================================================${NC}"
echo ""
echo "Services are now configured to run persistently."
echo "Use '$DESKTOP_COMMANDER_DIR/ensure-services.sh' to verify services before starting."
echo ""
echo "Next steps:"
echo "1. dc stop"
echo "2. dc start"