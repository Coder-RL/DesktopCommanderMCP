#!/bin/bash

# Install Desktop Commander control alias for zsh
SCRIPT_PATH="/Users/robertlee/GitHubProjects/DesktopCommanderMCP/dccommander"
SHELL_RC="$HOME/.zshrc"

echo "Installing dccommander alias for zsh..."

# Check if alias already exists
if grep -q "alias dccommander=" "$SHELL_RC"; then
    echo "Updating existing dccommander alias in $SHELL_RC"
    # Use different syntax for macOS sed
    sed -i '' "s|alias dccommander=.*|alias dccommander='$SCRIPT_PATH'|" "$SHELL_RC"
else
    echo "Adding dccommander alias to $SHELL_RC"
    echo "" >> "$SHELL_RC"
    echo "# Desktop Commander MCP Control" >> "$SHELL_RC"
    echo "alias dccommander='$SCRIPT_PATH'" >> "$SHELL_RC"
fi

echo "Alias installed successfully!"
echo "Please run: source $SHELL_RC"
echo "Or open a new terminal to use the 'dccommander' command"
echo ""
echo "Usage:"
echo "  dccommander build   - Build the server"
echo "  dccommander test    - Test the server"
echo "  dccommander install - Configure for Claude Desktop"
echo "  dccommander status  - Check server status"
echo "  dccommander logs    - View logs"