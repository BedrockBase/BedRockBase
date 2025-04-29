#!/bin/bash

# Script to update MCP servers to their latest versions
# Usage: ./update-mcp-servers.sh

echo "MCP Servers Update"
echo "================="

# Check if cline is installed
if ! command -v cline &> /dev/null; then
  echo "❌ Cline is not installed. Please install Cline first."
  exit 1
fi

# Confirm update
echo "This script will update the following MCP servers to their latest versions:"
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
read -p "Do you want to continue? (y/n): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
  echo "Update aborted."
  exit 0
fi

# Function to check if a server is registered
is_registered() {
  cline list-servers 2>/dev/null | grep -q "$1"
  return $?
}

# Function to update an MCP server
update_server() {
  local server_name=$1
  local url=$2
  local command=$3
  local args=$4
  
  echo -e "\nUpdating $server_name..."
  
  # Check if the server is registered
  if is_registered "$server_name"; then
    # Unregister the server first
    echo "Unregistering existing $server_name..."
    cline unregister-server "$server_name" 2>/dev/null
    
    # Register the server with the latest version
    echo "Registering $server_name with the latest version..."
    cline register-server "$server_name" --url "$url" --command "$command" --args "$args"
    
    if [ $? -eq 0 ]; then
      echo "✅ $server_name updated successfully"
    else
      echo "❌ Failed to update $server_name"
    fi
  else
    echo "❌ $server_name is not registered. Run install-mcp-servers.sh to install it."
  fi
}

# Update each MCP server
update_server "react-analyzer-mcp" "https://github.com/azer/react-analyzer-mcp" "npx" '["react-analyzer-mcp","serve"]'
update_server "supabase-mcp" "https://github.com/supabase-community/supabase-mcp" "npx" '["supabase","mcp","start"]'
update_server "prisma-mcp" "https://github.com/prisma/prisma" "npx" '["prisma","mcp"]'
update_server "pg-mcp" "https://github.com/stuzero/pg-mcp-server" "npx" '["pg-mcp-server","serve"]'
update_server "xiyan-mcp" "https://github.com/XGenerationLab/xiyan_mcp_server" "node" '["index.js"]'
update_server "text2sql-mcp" "https://github.com/mariaccc/text2sql-mcp-server" "./mvnw" '["spring-boot:run"]'
update_server "markdownify-mcp" "https://github.com/zcaceres/markdownify-mcp" "python" '["-m","markdownify_mcp"]'
update_server "markitdown-mcp" "https://github.com/KorigamiK/markitdown_mcp_server" "python" '["markitdown_mcp_server"]'
update_server "cli-mcp-server" "https://github.com/MladenSU/cli-mcp-server" "cli-mcp-server" '["--config","cli-mcp-config.json"]'

echo -e "\nUpdate process completed!"
echo "Run ./list-mcp-servers.sh to check the status of your MCP servers."
echo "Run ./test-mcp-servers.sh to verify that the updated servers are working correctly."
