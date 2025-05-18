#!/bin/bash

# Diagnose ChromaDB Issues
echo "ChromaDB Diagnostic Report"
echo "========================="

# Check if ChromaDB is installed
echo -n "1. ChromaDB installation: "
if command -v chromadb &> /dev/null; then
    echo "FOUND at $(which chromadb)"
    chromadb --version
else
    echo "NOT FOUND"
    echo "   Install with: pip3 install chromadb"
fi

# Check Python and pip
echo -e "\n2. Python environment:"
echo "   Python3: $(which python3)"
echo "   Version: $(python3 --version)"
echo "   Pip3: $(which pip3)"

# Check if ChromaDB is running
echo -e "\n3. ChromaDB service status:"
if pgrep -f "chromadb" > /dev/null; then
    echo "   ChromaDB processes found:"
    ps aux | grep chromadb | grep -v grep
else
    echo "   No ChromaDB processes running"
fi

# Check port 8000
echo -e "\n4. Port 8000 status:"
if lsof -i :8000 > /dev/null 2>&1; then
    echo "   Port 8000 is in use by:"
    lsof -i :8000
else
    echo "   Port 8000 is free"
fi

# Check ChromaDB data directory
echo -e "\n5. ChromaDB data directory:"
CHROMA_DIR="/Users/robertlee/GitHubProjects/claude-desktop-mcp-ecosystem/data/chroma"
if [ -d "$CHROMA_DIR" ]; then
    echo "   Directory exists: $CHROMA_DIR"
    echo "   Contents: $(ls -la $CHROMA_DIR | wc -l) items"
    echo "   Permissions: $(ls -ld $CHROMA_DIR)"
else
    echo "   Directory NOT FOUND: $CHROMA_DIR"
fi

# Check logs
echo -e "\n6. ChromaDB logs:"
LOG_FILE="/Users/robertlee/GitHubProjects/claude-desktop-mcp-ecosystem/logs/chromadb.log"
if [ -f "$LOG_FILE" ]; then
    echo "   Last 10 lines of log:"
    tail -10 "$LOG_FILE"
else
    echo "   No log file found at: $LOG_FILE"
fi

# Test ChromaDB API
echo -e "\n7. ChromaDB API test:"
if curl -s http://localhost:8000/api/v1 > /dev/null 2>&1; then
    echo "   API is responding"
    echo "   Response: $(curl -s http://localhost:8000/api/v1)"
else
    echo "   API is NOT responding"
fi

# Check for common issues
echo -e "\n8. Common issues check:"

# Check for permission issues
if [ ! -w "$CHROMA_DIR" ] 2>/dev/null; then
    echo "   WARNING: Cannot write to ChromaDB directory"
fi

# Check for zombie processes
if ps aux | grep -v grep | grep defunct | grep chromadb > /dev/null; then
    echo "   WARNING: Zombie ChromaDB processes found"
fi

# Recommendations
echo -e "\n9. Recommendations:"
echo "   - If ChromaDB is not installed: pip3 install chromadb"
echo "   - If port 8000 is in use: Kill the process using it"
echo "   - If permission issues: sudo chown -R $USER:$USER $CHROMA_DIR"
echo "   - To force restart: pkill -f chromadb && chromadb run --path $CHROMA_DIR"