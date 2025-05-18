#!/bin/bash

# Install Desktop Commander server control alias
SCRIPT_PATH="/Users/robertlee/GitHubProjects/DesktopCommanderMCP/dccommander"

# Detect shell
SHELL_RC=""
if [ -n "$ZSH_VERSION" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_RC="$HOME/.bashrc"
    # Also check .bash_profile on macOS
    if [ -f "$HOME/.bash_profile" ]; then
        SHELL_RC="$HOME/.bash_profile"
    fi
fi

if [ -z "$SHELL_RC" ]; then
    echo "Could not detect shell configuration file"
    echo "Please manually add the following alias to your shell config:"
    echo "alias dcserver='$SCRIPT_PATH'"
    exit 1
fi

# Check if alias already exists
if grep -q "alias dccommander=" "$SHELL_RC"; then
    echo "Updating existing dccommander alias in $SHELL_RC"
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