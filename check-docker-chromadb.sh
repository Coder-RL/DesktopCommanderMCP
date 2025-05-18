#!/bin/bash

# Check Docker ChromaDB Status
echo "Docker ChromaDB Status Check"
echo "==========================="

# Check running containers
echo -e "\n1. Running Docker containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "chroma|chromadb|NAMES"

# Check ChromaDB specifically
echo -e "\n2. ChromaDB container details:"
CHROMA_CONTAINER=$(docker ps -q -f name=chroma)
if [ -z "$CHROMA_CONTAINER" ]; then
    CHROMA_CONTAINER=$(docker ps -q -f name=chromadb)
fi

if [ ! -z "$CHROMA_CONTAINER" ]; then
    echo "Container ID: $CHROMA_CONTAINER"
    echo "Port mapping:"
    docker port $CHROMA_CONTAINER
    
    echo -e "\n3. Container logs (last 10 lines):"
    docker logs --tail 10 $CHROMA_CONTAINER
    
    echo -e "\n4. Testing ChromaDB API:"
    # Get the actual port
    PORT=$(docker port $CHROMA_CONTAINER 8000/tcp | cut -d: -f2)
    echo "ChromaDB port: $PORT"
    
    # Test the API
    echo "Testing http://localhost:$PORT/api/v1 ..."
    curl -s http://localhost:$PORT/api/v1 | python3 -m json.tool || echo "API test failed"
    
    echo -e "\n5. Container environment:"
    docker exec $CHROMA_CONTAINER env | grep -E "CHROMA|PORT" || echo "No CHROMA env vars found"
else
    echo "No ChromaDB container found running"
    echo -e "\nTo start ChromaDB in Docker:"
    echo "docker run -d --name chromadb -p 8000:8000 chromadb/chroma"
fi

echo -e "\n6. Port 8000 usage:"
lsof -i :8000 || echo "Port 8000 is free"