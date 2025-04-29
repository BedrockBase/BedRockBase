#!/bin/bash

# BedRkBase MCP Servers Installation Script
# This script installs and registers various MCP (Model Control Protocol) servers
# for use with the BedRkBase project.

# Set up variables
CLINE_PATH="/mnt/c/Users/calvi/AppData/Roaming/npm/cline"
CLINE_JS_PATH="/mnt/c/Users/calvi/AppData/Roaming/npm/cline.js"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Error handling function
function handle_error {
  echo -e "${RED}Error: $1${NC}"
  exit 1
}

# Success notification function
function success {
  echo -e "${GREEN}Success: $1${NC}"
}

# Check if cline is installed
if ! command -v $CLINE_PATH &> /dev/null; then
  handle_error "cline is not installed. Please install it first."
fi

echo -e "${YELLOW}Starting MCP servers installation...${NC}"

# 1. React Analyzer MCP (analyze React/TSX components)
echo "Installing React Analyzer MCP..."
node $CLINE_JS_PATH register-server react-analyzer-mcp \
  --url https://github.com/azer/react-analyzer-mcp \
  --command "npx" --args ["react-analyzer-mcp","serve"] || handle_error "Failed to register React Analyzer MCP"
success "React Analyzer MCP installed successfully"

# 2. Supabase MCP (manage Supabase projects & tables)
echo "Installing Supabase MCP..."
$CLINE_PATH register-server supabase-mcp \
  --url https://github.com/supabase-community/supabase-mcp \
  --command "npx" --args ["supabase","mcp","start"] || handle_error "Failed to register Supabase MCP"
success "Supabase MCP installed successfully"

# 3. Prisma MCP (Prisma Postgres management)
echo "Installing Prisma MCP..."
$CLINE_PATH register-server prisma-mcp \
  --url https://github.com/prisma/prisma \
  --command "npx" --args ["prisma","mcp"] || handle_error "Failed to register Prisma MCP"
success "Prisma MCP installed successfully"

# 4. Postgres & PostGIS MCP (PG-MCP with PostGIS support)
echo "Installing Postgres & PostGIS MCP..."
$CLINE_PATH register-server pg-mcp \
  --url https://github.com/stuzero/pg-mcp-server \
  --command "npx" --args ["pg-mcp-server","serve"] || handle_error "Failed to register Postgres & PostGIS MCP"
success "Postgres & PostGIS MCP installed successfully"

# 5. XiYan Text2SQL MCP (NL→SQL)
echo "Installing XiYan Text2SQL MCP..."
$CLINE_PATH register-server xiyan-mcp \
  --url https://github.com/XGenerationLab/xiyan_mcp_server \
  --command "node" --args ["index.js"] || handle_error "Failed to register XiYan Text2SQL MCP"
success "XiYan Text2SQL MCP installed successfully"

# 6. MariaCCC Text2SQL MCP (alternative NL→SQL)
echo "Installing MariaCCC Text2SQL MCP..."
$CLINE_PATH register-server text2sql-mcp \
  --url https://github.com/mariaccc/text2sql-mcp-server \
  --command "./mvnw" --args ["spring-boot:run"] || handle_error "Failed to register MariaCCC Text2SQL MCP"
success "MariaCCC Text2SQL MCP installed successfully"

# 7. Markdownify MCP (file→Markdown)
echo "Installing Markdownify MCP..."
$CLINE_PATH register-server markdownify-mcp \
  --url https://github.com/zcaceres/markdownify-mcp \
  --command "python" --args ["-m","markdownify_mcp"] || handle_error "Failed to register Markdownify MCP"
success "Markdownify MCP installed successfully"

# 8. MarkItDown MCP (rich file→Markdown)
echo "Installing MarkItDown MCP..."
$CLINE_PATH register-server markitdown-mcp \
  --url https://github.com/KorigamiK/markitdown_mcp_server \
  --command "python" --args ["markitdown_mcp_server"] || handle_error "Failed to register MarkItDown MCP"
success "MarkItDown MCP installed successfully"

# 9. CLI MCP Server (secure shell & script exec)
echo "Installing CLI MCP Server..."
$CLINE_PATH register-server cli-mcp-server \
  --url https://github.com/MladenSU/cli-mcp-server \
  --command "cli-mcp-server" --args ["--config","cli-mcp-config.json"] || handle_error "Failed to register CLI MCP Server"
success "CLI MCP Server installed successfully"

echo -e "${GREEN}All MCP servers have been successfully installed!${NC}"
echo "To test the servers, run the test-mcp-servers.sh script."
