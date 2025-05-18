#!/bin/bash

# Quick Fix for MCP Ecosystem Issues
MCP_ECOSYSTEM_DIR="/Users/robertlee/GitHubProjects/claude-desktop-mcp-ecosystem"

echo "Quick fix for MCP Ecosystem issues..."

# Fix 1: ChromaDB - Install and run if not available
echo "1. Starting ChromaDB (if installed)..."
if command -v chromadb &> /dev/null; then
    # Kill any existing ChromaDB instances
    pkill -f "chromadb"
    sleep 1
    # Start ChromaDB
    cd "$MCP_ECOSYSTEM_DIR/data"
    chromadb &
    echo "ChromaDB started"
    sleep 3
else
    echo "ChromaDB not found. Services will use in-memory fallback."
fi

# Fix 2: Tree-sitter module mismatch
echo "2. Fixing tree-sitter module..."
cd "$MCP_ECOSYSTEM_DIR/src/mcp-context-allocator"
npm rebuild

# Fix 3: Quick rebuild of problematic services
echo "3. Rebuilding key services..."
cd "$MCP_ECOSYSTEM_DIR/src/mcp-working-memory"
npm rebuild

cd "$MCP_ECOSYSTEM_DIR/src/mcp-context-allocator"
npm rebuild

# Fix 4: Ensure data directories exist
echo "4. Creating data directories..."
mkdir -p "$MCP_ECOSYSTEM_DIR/data/chroma"
mkdir -p "$MCP_ECOSYSTEM_DIR/data/logs"
mkdir -p "$MCP_ECOSYSTEM_DIR/logs"

echo "Quick fixes applied!"
echo ""
echo "Now try: dc start"