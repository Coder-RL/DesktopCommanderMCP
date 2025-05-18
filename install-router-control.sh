#!/bin/bash

# Install Desktop Commander Router Control alias
SCRIPT_PATH="/Users/robertlee/GitHubProjects/DesktopCommanderMCP/dc-router-control"
SHELL_RC="$HOME/.zshrc"

echo "Installing dc-router-control alias..."

# Remove old aliases if they exist
sed -i '' '/alias dccontrol=/d' "$SHELL_RC" 2>/dev/null

# Check if new alias already exists
if grep -q "alias dc-router-control=" "$SHELL_RC"; then
    echo "Updating existing dc-router-control alias in $SHELL_RC"
    sed -i '' "s|alias dc-router-control=.*|alias dc-router-control='$SCRIPT_PATH'|" "$SHELL_RC"
else
    echo "Adding dc-router-control alias to $SHELL_RC"
    echo "" >> "$SHELL_RC"
    echo "# Desktop Commander MCP Router Control" >> "$SHELL_RC"
    echo "alias dc-router-control='$SCRIPT_PATH'" >> "$SHELL_RC"
fi

echo "Alias installed successfully!"
echo ""
echo "Please run: source ~/.zshrc"
echo "Or open a new terminal to use the 'dc-router-control' command"
echo ""
echo "Usage:"
echo "  dc-router-control build        - Build Desktop Commander"
echo "  dc-router-control start-router - Start MCP Router ecosystem"
echo "  dc-router-control register     - Register with MCP Router"
echo "  dc-router-control status       - Check current status"
echo "  dc-router-control list         - List all registered servers"