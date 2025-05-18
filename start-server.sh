#!/bin/bash

# Start Desktop Commander MCP Server
echo "Starting Desktop Commander MCP Server..."

# Kill any existing instances
pkill -f "node.*DesktopCommanderMCP/dist/index.js" 2>/dev/null

# Start the server in the background
NODE_ENV=production nohup node /Users/robertlee/GitHubProjects/DesktopCommanderMCP/dist/index.js > /Users/robertlee/GitHubProjects/DesktopCommanderMCP/logs/server.log 2>&1 &

# Get the PID and save it
echo $! > /Users/robertlee/GitHubProjects/DesktopCommanderMCP/server.pid

echo "Desktop Commander MCP Server started with PID: $(cat /Users/robertlee/GitHubProjects/DesktopCommanderMCP/server.pid)"
echo "Logs are available at: /Users/robertlee/GitHubProjects/DesktopCommanderMCP/logs/server.log"
echo "Use ./stop-server.sh to stop the server"