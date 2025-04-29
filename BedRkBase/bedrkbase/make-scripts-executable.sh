#!/bin/bash

# Script to make all MCP server scripts executable
# Usage: ./make-scripts-executable.sh

echo "Making all MCP server scripts executable..."

# List of scripts to make executable
SCRIPTS=(
  "install-mcp-servers.sh"
  "test-mcp-servers.sh"
  "update-postgres-password.sh"
  "check-dependencies.sh"
  "setup-mcp-servers.sh"
  "uninstall-mcp-servers.sh"
  "list-mcp-servers.sh"
  "update-mcp-servers.sh"
  "make-scripts-executable.sh"
  "verify-files.sh"
  "create-archive.sh"
  "test-archive.sh"
)

# Make each script executable
for script in "${SCRIPTS[@]}"; do
  if [ -f "$script" ]; then
    echo "Making $script executable..."
    chmod +x "$script"
    echo "✅ $script is now executable"
  else
    echo "❌ $script not found, skipping."
  fi
done

echo -e "\nAll scripts are now executable!"
echo "You can now run ./setup-mcp-servers.sh to start the installation process."
