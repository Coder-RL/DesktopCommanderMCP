#!/bin/bash

# Install Desktop Commander Unified Control alias
SCRIPT_PATH="/Users/robertlee/GitHubProjects/DesktopCommanderMCP/dc-unified"
SHELL_RC="$HOME/.zshrc"

echo "Installing dc-unified alias..."

# Remove old aliases if they exist
sed -i '' '/alias dc-router-control=/d' "$SHELL_RC" 2>/dev/null
sed -i '' '/alias dccontrol=/d' "$SHELL_RC" 2>/dev/null

# Remove existing dc alias if it exists to avoid conflicts
sed -i '' '/alias dc=/d' "$SHELL_RC" 2>/dev/null

# Add new unified alias
echo "Adding dc alias to $SHELL_RC"
echo "" >> "$SHELL_RC"
echo "# Desktop Commander Unified Control" >> "$SHELL_RC"
echo "alias dc='$SCRIPT_PATH'" >> "$SHELL_RC"

echo "Alias installed successfully!"
echo ""
echo "Please run: source ~/.zshrc"
echo "Or open a new terminal to use the 'dc' command"
echo ""
echo "Usage:"
echo "  dc start   - Start MCP ecosystem and Desktop Commander"
echo "  dc stop    - Stop everything"
echo "  dc restart - Restart everything"  
echo "  dc status  - Show system status"
echo "  dc build   - Build Desktop Commander"
echo ""
echo "This uses your special launch-claude-desktop-enhanced.sh script"
echo "to properly start the MCP Router ecosystem."