#!/bin/bash

# Script to list all registered MCP servers and their status
# Usage: ./list-mcp-servers.sh

echo "MCP Servers Status"
echo "================="

# Check if cline is installed
if ! command -v cline &> /dev/null; then
  echo "❌ Cline is not installed. Please install Cline first."
  exit 1
fi

# Get the list of registered MCP servers
echo "Fetching registered MCP servers..."
echo ""

# Function to check if a server is registered
is_registered() {
  cline list-servers 2>/dev/null | grep -q "$1"
  return $?
}

# List of MCP servers we expect to be installed
SERVERS=(
  "react-analyzer-mcp"
  "supabase-mcp"
  "prisma-mcp"
  "pg-mcp"
  "xiyan-mcp"
  "text2sql-mcp"
  "markdownify-mcp"
  "markitdown-mcp"
  "cli-mcp-server"
  "cline-community"
  "github.com/upstash/context7-mcp"
)

# Check each server
for server in "${SERVERS[@]}"; do
  echo -n "Checking $server... "
  if is_registered "$server"; then
    echo "✅ Registered"
  else
    echo "❌ Not registered"
  fi
done

echo -e "\nTo see the full list of registered servers, run:"
echo "cline list-servers"

echo -e "\nTo get detailed information about a specific server, run:"
echo "cline server-info <server-name>"
