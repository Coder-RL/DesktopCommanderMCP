#!/bin/bash

# Stop Desktop Commander MCP Server
echo "Stopping Desktop Commander MCP Server..."

# Check if PID file exists
if [ -f /Users/robertlee/GitHubProjects/DesktopCommanderMCP/server.pid ]; then
    PID=$(cat /Users/robertlee/GitHubProjects/DesktopCommanderMCP/server.pid)
    
    # Check if process is running
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        echo "Stopped server with PID: $PID"
    else
        echo "Server process (PID: $PID) is not running"
    fi
    
    # Remove PID file
    rm /Users/robertlee/GitHubProjects/DesktopCommanderMCP/server.pid
else
    echo "PID file not found. Attempting to find and kill any running instances..."
    # Try to find and kill any running instances
    pkill -f "node.*DesktopCommanderMCP/dist/index.js"
fi

echo "Desktop Commander MCP Server stopped"