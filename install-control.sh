#!/bin/bash

# Install Desktop Commander control alias
SCRIPT_PATH="/Users/robertlee/GitHubProjects/DesktopCommanderMCP/dccontrol"
SHELL_RC="$HOME/.zshrc"

echo "Installing dccontrol alias for Desktop Commander..."

# Remove old aliases if they exist
sed -i '' '/alias dcserver=/d' "$SHELL_RC" 2>/dev/null
sed -i '' '/alias dccommander=/d' "$SHELL_RC" 2>/dev/null

# Check if new alias already exists
if grep -q "alias dccontrol=" "$SHELL_RC"; then
    echo "Updating existing dccontrol alias in $SHELL_RC"
    sed -i '' "s|alias dccontrol=.*|alias dccontrol='$SCRIPT_PATH'|" "$SHELL_RC"
else
    echo "Adding dccontrol alias to $SHELL_RC"
    echo "" >> "$SHELL_RC"
    echo "# Desktop Commander MCP Control" >> "$SHELL_RC"
    echo "alias dccontrol='$SCRIPT_PATH'" >> "$SHELL_RC"
fi

echo "Alias installed successfully!"
echo ""
echo "Please run: source ~/.zshrc"
echo "Or open a new terminal to use the 'dccontrol' command"
echo ""
echo "Usage:"
echo "  dccontrol start  - Enable Desktop Commander in Claude"
echo "  dccontrol stop   - Disable Desktop Commander in Claude"
echo "  dccontrol status - Check current status"
echo "  dccontrol list   - List all MCP servers"
echo "  dccontrol build  - Build the server"
echo "  dccontrol test   - Test the server locally"