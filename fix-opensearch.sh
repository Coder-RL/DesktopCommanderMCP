#!/bin/bash

# Fix OpenSearch Issues
MCP_ECOSYSTEM_DIR="/Users/robertlee/GitHubProjects/claude-desktop-mcp-ecosystem"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}       Fixing OpenSearch Issues                   ${NC}"
echo -e "${BLUE}==================================================${NC}"

# Check if OpenSearch is in Docker
OPENSEARCH_CONTAINER=$(docker ps -q -f name=opensearch)

if [ ! -z "$OPENSEARCH_CONTAINER" ]; then
    echo -e "${GREEN}OpenSearch is already running in Docker${NC}"
    
    # Get logs
    echo -e "${YELLOW}Recent OpenSearch logs:${NC}"
    docker logs --tail 20 $OPENSEARCH_CONTAINER
    
    # Check health
    echo -e "${YELLOW}Checking OpenSearch health...${NC}"
    OPENSEARCH_PORT=$(docker port $OPENSEARCH_CONTAINER 9200/tcp | cut -d: -f2)
    curl -s http://localhost:$OPENSEARCH_PORT/_cluster/health | python3 -m json.tool
    
    # Restart if needed
    echo -e "${YELLOW}Do you want to restart OpenSearch? (y/n)${NC}"
    read -p "> " restart_answer
    if [ "$restart_answer" = "y" ]; then
        docker restart $OPENSEARCH_CONTAINER
        sleep 10
    fi
else
    echo -e "${YELLOW}OpenSearch not found in Docker. Starting it...${NC}"
    
    # Pull latest image
    docker pull opensearchproject/opensearch:latest
    
    # Stop any existing container
    docker stop opensearch 2>/dev/null
    docker rm opensearch 2>/dev/null
    
    # Start OpenSearch with production settings
    docker run -d \
        --name opensearch \
        -p 9200:9200 \
        -p 9600:9600 \
        -e "discovery.type=single-node" \
        -e "DISABLE_SECURITY_PLUGIN=true" \
        -e "bootstrap.memory_lock=true" \
        -e "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m" \
        -e "cluster.routing.allocation.disk.threshold_enabled=false" \
        -v opensearch-data:/usr/share/opensearch/data \
        opensearchproject/opensearch:latest
    
    echo -e "${YELLOW}Waiting for OpenSearch to start...${NC}"
    for i in {1..60}; do
        if curl -s http://localhost:9200 > /dev/null 2>&1; then
            echo -e "${GREEN}OpenSearch is ready!${NC}"
            break
        fi
        echo -n "."
        sleep 1
    done
fi

# Create/update service configuration files
echo -e "${YELLOW}Updating service configurations for OpenSearch...${NC}"

# Update semantic memory manager config
SEMANTIC_MEMORY_CONFIG="$MCP_ECOSYSTEM_DIR/src/mcp-semantic-memory-manager/index.js"
if [ -f "$SEMANTIC_MEMORY_CONFIG" ]; then
    # Backup
    cp "$SEMANTIC_MEMORY_CONFIG" "$SEMANTIC_MEMORY_CONFIG.bak"
    
    # Update OpenSearch URL
    sed -i '' "s|http://localhost:9200|${OPENSEARCH_URL:-http://localhost:9200}|g" "$SEMANTIC_MEMORY_CONFIG"
fi

# Update codebase indexer config
CODEBASE_INDEXER_CONFIG="$MCP_ECOSYSTEM_DIR/src/mcp-codebase-indexer/index.js"
if [ -f "$CODEBASE_INDEXER_CONFIG" ]; then
    # Backup
    cp "$CODEBASE_INDEXER_CONFIG" "$CODEBASE_INDEXER_CONFIG.bak"
    
    # Update OpenSearch URL
    sed -i '' "s|http://localhost:9200|${OPENSEARCH_URL:-http://localhost:9200}|g" "$CODEBASE_INDEXER_CONFIG"
fi

# Create OpenSearch indices if needed
echo -e "${YELLOW}Creating required OpenSearch indices...${NC}"

OPENSEARCH_URL="http://localhost:9200"

# Create codebase index
curl -X PUT "$OPENSEARCH_URL/codebase" -H 'Content-Type: application/json' -d '{
  "mappings": {
    "properties": {
      "file_path": { "type": "keyword" },
      "content": { "type": "text" },
      "language": { "type": "keyword" },
      "size": { "type": "long" },
      "last_modified": { "type": "date" },
      "file_type": { "type": "keyword" },
      "embedding": { "type": "dense_vector", "dims": 384 }
    }
  }
}' 2>/dev/null

# Create semantic memories index
curl -X PUT "$OPENSEARCH_URL/semantic-memories" -H 'Content-Type: application/json' -d '{
  "mappings": {
    "properties": {
      "content": { "type": "text" },
      "type": { "type": "keyword" },
      "timestamp": { "type": "date" },
      "metadata": { "type": "object" },
      "embedding": { "type": "dense_vector", "dims": 384 }
    }
  }
}' 2>/dev/null

echo -e "${GREEN}==================================================${NC}"
echo -e "${GREEN}       OpenSearch Setup Complete!                 ${NC}"
echo -e "${GREEN}==================================================${NC}"

# Final status check
echo -e "${YELLOW}Final OpenSearch status:${NC}"
curl -s http://localhost:9200 | python3 -m json.tool

echo ""
echo "Next steps:"
echo "1. Run: dc stop"
echo "2. Run: dc start"
echo ""
echo "The V3 dc command will now properly detect and use Docker OpenSearch!"