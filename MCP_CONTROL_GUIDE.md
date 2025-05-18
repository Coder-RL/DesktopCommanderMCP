# Desktop Commander MCP Control Guide

## Overview

You have two different ways to control Desktop Commander MCP Server:

1. **Direct Control (`dccontrol`)** - Works independently, modifies Claude Desktop config directly
2. **Router Control (`dc-router-control`)** - Works with your MCP Router ecosystem

## Which One Should You Use?

### Use `dccontrol` if:
- You want Desktop Commander to work independently
- You're not using the MCP Router ecosystem
- You prefer direct Claude Desktop integration
- You want simple start/stop functionality

### Use `dc-router-control` if:
- You're using the MCP Router ecosystem (`claude-desktop-mcp-ecosystem`)
- You want Desktop Commander managed alongside other MCP servers
- You prefer centralized MCP server management
- You need the advanced features of the router system

## Command Reference

### Direct Control (`dccontrol`)

```bash
# Enable Desktop Commander in Claude Desktop
dccontrol start

# Disable Desktop Commander in Claude Desktop  
dccontrol stop

# Check current status
dccontrol status

# Build the server
dccontrol build

# List all MCP servers in Claude config
dccontrol list

# Test the server locally
dccontrol test
```

### Router Control (`dc-router-control`)

```bash
# Build Desktop Commander
dc-router-control build

# Start the MCP Router ecosystem
dc-router-control start-router

# Register Desktop Commander with the router
dc-router-control register

# Check status
dc-router-control status

# List all servers registered with router
dc-router-control list
```

## Switching Between Approaches

### To Use Direct Control:
1. Stop the MCP Router if running:
   ```bash
   cd /Users/robertlee/GitHubProjects/claude-desktop-mcp-ecosystem
   ./stop-all-services.sh
   ```

2. Enable Desktop Commander directly:
   ```bash
   dccontrol start
   ```

3. Restart Claude Desktop

### To Use Router Control:
1. Remove direct configuration:
   ```bash
   dccontrol stop
   ```

2. Start the router ecosystem:
   ```bash
   dc-router-control start-router
   ```

3. Register Desktop Commander:
   ```bash
   dc-router-control register
   ```

4. Restart Claude Desktop

## How They Work

### Direct Control (`dccontrol`)
- Modifies `~/Library/Application Support/Claude/claude_desktop_config.json` directly
- Desktop Commander runs as a standalone MCP server
- Claude Desktop launches it when needed
- Simple and straightforward

### Router Control (`dc-router-control`)
- Registers Desktop Commander with the MCP Router at `http://localhost:3099`
- Router manages all MCP servers centrally
- Provides advanced features like health monitoring, service discovery
- Part of the larger MCP ecosystem

## Typical Workflows

### Direct Control Workflow
```bash
# Initial setup
dccontrol build    # Build the server
dccontrol start    # Enable in Claude Desktop
# Restart Claude Desktop

# Daily use
dccontrol status   # Check if enabled
dccontrol stop     # Disable when not needed
dccontrol start    # Re-enable when needed
```

### Router Control Workflow
```bash
# Initial setup
dc-router-control build         # Build the server
dc-router-control start-router  # Start router ecosystem
dc-router-control register      # Register with router
# Restart Claude Desktop

# Daily use
dc-router-control status        # Check registration
dc-router-control list          # See all MCP servers
```

## Troubleshooting

### Direct Control Issues
- If `dccontrol start` fails, check file permissions
- If Claude doesn't see the server, restart Claude Desktop
- Check logs at `/Users/robertlee/GitHubProjects/DesktopCommanderMCP/logs/`

### Router Control Issues
- If registration fails, ensure router is running on port 3099
- Check router logs at `/Users/robertlee/GitHubProjects/claude-desktop-mcp-ecosystem/logs/`
- Make sure no port conflicts exist

## Important Notes

1. **Don't use both approaches simultaneously** - they may conflict
2. **Always restart Claude Desktop** after making configuration changes
3. **The router approach** is more complex but offers better integration with other MCP servers
4. **The direct approach** is simpler and perfect for standalone use

## Current Status

As of now, you have:
- ✅ Both control scripts installed and ready
- ✅ Aliases configured in your `.zshrc`
- ✅ Desktop Commander built and ready to use
- ✅ Choice between direct and router-based control