#!/bin/bash

# Check Docker Services (ChromaDB & OpenSearch)
echo "Docker Services Status Check"
echo "============================"

# Check all Docker containers
echo -e "\n1. Running Docker containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Check ChromaDB
echo -e "\n2. ChromaDB Status:"
CHROMA_CONTAINER=$(docker ps -q -f name=chroma)
if [ -z "$CHROMA_CONTAINER" ]; then
    CHROMA_CONTAINER=$(docker ps -q -f name=chromadb)
fi

if [ ! -z "$CHROMA_CONTAINER" ]; then
    echo "✓ ChromaDB Container: $CHROMA_CONTAINER"
    CHROMA_PORT=$(docker port $CHROMA_CONTAINER 8000/tcp | cut -d: -f2)
    echo "✓ ChromaDB Port: $CHROMA_PORT"
    
    # Test API
    echo -n "✓ ChromaDB API Test: "
    if curl -s http://localhost:$CHROMA_PORT/api/v1 > /dev/null; then
        echo "SUCCESS"
    else
        echo "FAILED"
        docker logs --tail 10 $CHROMA_CONTAINER
    fi
else
    echo "✗ ChromaDB not found in Docker"
fi

# Check OpenSearch
echo -e "\n3. OpenSearch Status:"
OPENSEARCH_CONTAINER=$(docker ps -q -f name=opensearch)

if [ ! -z "$OPENSEARCH_CONTAINER" ]; then
    echo "✓ OpenSearch Container: $OPENSEARCH_CONTAINER"
    OPENSEARCH_PORT=$(docker port $OPENSEARCH_CONTAINER 9200/tcp | cut -d: -f2)
    echo "✓ OpenSearch Port: $OPENSEARCH_PORT"
    
    # Test API
    echo -n "✓ OpenSearch API Test: "
    if curl -s http://localhost:$OPENSEARCH_PORT > /dev/null; then
        echo "SUCCESS"
        # Get cluster health
        echo "✓ Cluster Health:"
        curl -s http://localhost:$OPENSEARCH_PORT/_cluster/health | python3 -m json.tool
    else
        echo "FAILED"
        docker logs --tail 10 $OPENSEARCH_CONTAINER
    fi
else
    echo "✗ OpenSearch not found in Docker"
fi

# Port usage summary
echo -e "\n4. Port Usage Summary:"
echo "Port 8000 (ChromaDB):"
lsof -i :8000 2>/dev/null || echo "  Free"
echo ""
echo "Port 9200 (OpenSearch):"
lsof -i :9200 2>/dev/null || echo "  Free"
echo ""
echo "Port 9600 (OpenSearch Admin):"
lsof -i :9600 2>/dev/null || echo "  Free"

# Recommendations
echo -e "\n5. Recommendations:"
if [ -z "$CHROMA_CONTAINER" ]; then
    echo "- Start ChromaDB: docker run -d --name chromadb -p 8000:8000 chromadb/chroma"
fi
if [ -z "$OPENSEARCH_CONTAINER" ]; then
    echo "- Start OpenSearch: docker run -d --name opensearch -p 9200:9200 -p 9600:9600 -e 'discovery.type=single-node' -e 'DISABLE_SECURITY_PLUGIN=true' opensearchproject/opensearch:latest"
fi