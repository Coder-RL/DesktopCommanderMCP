#!/bin/bash

# Update Desktop Commander to use V2 unified control
SCRIPT_PATH="/Users/robertlee/GitHubProjects/DesktopCommanderMCP/dc-unified-v2"
SHELL_RC="$HOME/.zshrc"

echo "Updating dc alias to use V2..."

# Update the alias to point to V2
sed -i '' "s|alias dc=.*|alias dc='$SCRIPT_PATH'|" "$SHELL_RC"

echo "Alias updated successfully!"
echo ""
echo "Please run: source ~/.zshrc"
echo "Or open a new terminal to use the updated 'dc' command"
echo ""
echo "What's new in V2:"
echo "  ✓ Aggressively kills all processes before starting"
echo "  ✓ Properly detects and uses Docker ChromaDB"
echo "  ✓ Exports ChromaDB URL to all services"
echo "  ✓ Better error handling and status reporting"
echo ""
echo "Usage:"
echo "  dc start   - Kill all, then start everything"
echo "  dc stop    - Stop everything"
echo "  dc restart - Full restart"
echo "  dc status  - Show detailed status"
echo "  dc build   - Build Desktop Commander"