#!/bin/bash

# Script to uninstall MCP servers
# Usage: ./uninstall-mcp-servers.sh

echo "MCP Servers Uninstallation"
echo "=========================="

# Confirm uninstallation
echo "This script will uninstall the following MCP servers:"
echo "1. React Analyzer MCP"
echo "2. Supabase MCP"
echo "3. Prisma MCP"
echo "4. Postgres & PostGIS MCP"
echo "5. XiYan Text2SQL MCP"
echo "6. MariaCCC Text2SQL MCP"
echo "7. Markdownify MCP"
echo "8. MarkItDown MCP"
echo "9. CLI MCP Server"
echo ""
read -p "Are you sure you want to uninstall these MCP servers? (y/n): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
  echo "Uninstallation aborted."
  exit 0
fi

# Uninstall each MCP server
echo -e "\nUninstalling MCP servers..."

# Function to unregister an MCP server
unregister_server() {
  echo "Unregistering $1..."
  cline unregister-server $1 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "✅ $1 unregistered successfully"
  else
    echo "❌ Failed to unregister $1 (it may not be registered)"
  fi
}

# Unregister all MCP servers
unregister_server "react-analyzer-mcp"
unregister_server "supabase-mcp"
unregister_server "prisma-mcp"
unregister_server "pg-mcp"
unregister_server "xiyan-mcp"
unregister_server "text2sql-mcp"
unregister_server "markdownify-mcp"
unregister_server "markitdown-mcp"
unregister_server "cli-mcp-server"

# Ask if user wants to remove the files
echo -e "\nDo you want to remove the MCP server files?"
read -p "This will delete all scripts and configuration files (y/n): " remove_files
if [[ $remove_files =~ ^[Yy]$ ]]; then
  echo "Removing files..."
  rm -f install-mcp-servers.sh test-mcp-servers.sh update-postgres-password.sh check-dependencies.sh setup-mcp-servers.sh uninstall-mcp-servers.sh list-mcp-servers.sh update-mcp-servers.sh make-scripts-executable.sh verify-files.sh create-archive.sh test-archive.sh cli-mcp-config.json mcp-usage-examples.js MCP-SERVERS-README.md SCRIPTS-SUMMARY.md
  rm -rf docs
  echo "✅ Files removed successfully"
fi

echo -e "\nUninstallation complete!"
