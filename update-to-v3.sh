#!/bin/bash

# Update Desktop Commander to use V3 with OpenSearch support
SCRIPT_PATH="/Users/robertlee/GitHubProjects/DesktopCommanderMCP/dc-unified-v3"
SHELL_RC="$HOME/.zshrc"

echo "Updating dc alias to use V3..."

# Update the alias to point to V3
sed -i '' "s|alias dc=.*|alias dc='$SCRIPT_PATH'|" "$SHELL_RC"

echo "Alias updated successfully!"
echo ""
echo "Please run: source ~/.zshrc"
echo "Or open a new terminal to use the updated 'dc' command"
echo ""
echo "What's new in V3:"
echo "  ✓ Full Docker OpenSearch support"
echo "  ✓ Automatic OpenSearch detection and configuration"
echo "  ✓ Exports both ChromaDB and OpenSearch URLs to services"
echo "  ✓ Better status reporting for both services"
echo "  ✓ Automatic restart if services not responding"
echo ""
echo "Usage:"
echo "  dc start   - Start everything with Docker service support"
echo "  dc stop    - Stop everything"
echo "  dc restart - Full restart"
echo "  dc status  - Show detailed status including Docker services"
echo "  dc build   - Build Desktop Commander"
echo ""
echo "Check Docker services with:"
echo "  ./check-docker-services.sh"