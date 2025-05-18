#!/bin/bash

# Update Desktop Commander to use V4 with integrated Docker checks
SCRIPT_PATH="/Users/robertlee/GitHubProjects/DesktopCommanderMCP/dc-unified-v4"
SHELL_RC="$HOME/.zshrc"

echo "Updating dc alias to use V4..."

# Update the alias to point to V4
sed -i '' "s|alias dc=.*|alias dc='$SCRIPT_PATH'|" "$SHELL_RC"

echo "Alias updated successfully!"
echo ""
echo "Please run: source ~/.zshrc"
echo "Or open a new terminal to use the updated 'dc' command"
echo ""
echo "What's new in V4:"
echo "  ✓ Integrated Docker service checks in all commands"
echo "  ✓ 'dc start' now shows Docker status before starting"
echo "  ✓ 'dc status' includes full Docker service check"
echo "  ✓ 'dc stop' shows what's running before stopping"
echo "  ✓ New 'dc check' command for Docker services only"
echo "  ✓ Better visual feedback with status indicators"
echo ""
echo "Usage:"
echo "  dc start   - Check services, then start everything"
echo "  dc stop    - Show status, then stop everything"
echo "  dc restart - Full restart with checks"
echo "  dc status  - Complete system status with Docker check"
echo "  dc build   - Build Desktop Commander"
echo "  dc check   - Check Docker services only"
echo ""
echo "The check-docker-services.sh functionality is now built into the dc command!"