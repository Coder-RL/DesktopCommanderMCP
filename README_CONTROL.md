# Desktop Commander MCP Control Guide

## How MCP Servers Work

MCP (Model Context Protocol) servers are designed to be launched by Claude Desktop, not run as standalone services. They communicate through standard input/output (stdio) with Claude Desktop.

## Available Commands

After running `source ~/.bashrc` or opening a new terminal, you can use:

### `dccommander status`
Shows the current status of your Desktop Commander installation:
- Whether the server files are built
- Whether it's configured in Claude Desktop
- Available commands

### `dccommander build`
Rebuilds the server from TypeScript source files:
```bash
dccommander build
```
Run this after making any changes to the source code.

### `dccommander test`
Tests the server in interactive mode:
```bash
dccommander test
```
This runs the server directly in your terminal. Press Ctrl+C to stop.
Note: This is only for testing - the server normally runs through Claude Desktop.

### `dccommander install`
Configures the server in Claude Desktop:
```bash
dccommander install
```
This updates your Claude Desktop configuration to use the local Desktop Commander server.
After running this, restart Claude Desktop to use the server.

## Normal Usage

1. **Initial Setup**:
   ```bash
   dccommander build    # Build the server
   dccommander install  # Configure for Claude Desktop
   ```

2. **Restart Claude Desktop**

3. **The server will now run automatically** when you use Claude Desktop

## Troubleshooting

- If you make changes to the code, run `dccommander build`
- To test the server directly, use `dccommander test`
- The server doesn't run in the background - it's launched by Claude Desktop when needed
- Check Claude Desktop logs if you experience issues

## Important Notes

- MCP servers are NOT traditional web servers or background services
- They only run when Claude Desktop needs them
- Communication happens through stdio, not HTTP
- The integrated task manager and sequential thinking tools are available through Claude Desktop, not through direct server commands