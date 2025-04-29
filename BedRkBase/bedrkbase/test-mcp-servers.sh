#!/bin/bash

# BedRkBase MCP Servers Test Script
# This script tests the functionality of each installed MCP server

# Set up variables
CLINE_PATH="/mnt/c/Users/calvi/AppData/Roaming/npm/cline"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Error handling function
function handle_error {
  echo -e "${RED}Error: $1${NC}"
}

# Success notification function
function success {
  echo -e "${GREEN}Success: $1${NC}"
}

# Test function
function test_mcp_server {
  echo -e "${YELLOW}Testing $1...${NC}"
  $CLINE_PATH call $2 || handle_error "Failed to test $1"
  success "$1 test completed"
  echo ""
}

echo -e "${YELLOW}Starting MCP servers tests...${NC}"

# 1. React Analyzer MCP test
test_mcp_server "React Analyzer MCP" "react-analyzer-mcp analyze-react --file pages/establishments/index.tsx"

# 2. Supabase MCP test
read -p "Enter your Supabase project ID (default: ulbkeztfjegfchgzfosc): " SUPABASE_PROJECT_ID
SUPABASE_PROJECT_ID=${SUPABASE_PROJECT_ID:-ulbkeztfjegfchgzfosc}
test_mcp_server "Supabase MCP" "supabase-mcp listTables --project-id $SUPABASE_PROJECT_ID"

# 3. Prisma MCP test
test_mcp_server "Prisma MCP" "prisma-mcp migrate --schema prisma/schema.prisma"

# 4. Postgres & PostGIS MCP test
read -p "Enter your Postgres password: " PG_PASSWORD
test_mcp_server "Postgres & PostGIS MCP" "pg-mcp listTables --database-url \"postgres://postgres:$PG_PASSWORD@localhost:5432/postgres\""

# 5. XiYan Text2SQL MCP test
test_mcp_server "XiYan Text2SQL MCP" "xiyan-mcp text2sql --prompt \"List all establishments within 5km of latitude X, longitude Y\""

# 6. MariaCCC Text2SQL MCP test
test_mcp_server "MariaCCC Text2SQL MCP" "text2sql-mcp text2sql --prompt \"Show user activity in the last month\""

# 7. Markdownify MCP test
test_mcp_server "Markdownify MCP" "markdownify-mcp convert --file README.md"

# 8. MarkItDown MCP test
test_mcp_server "MarkItDown MCP" "markitdown-mcp convert --file docs/presentation.txt"

# 9. CLI MCP Server test
test_mcp_server "CLI MCP Server" "cli-mcp-server run --command \"echo 'CLI MCP Server is working!'\""

echo -e "${GREEN}All MCP server tests completed!${NC}"
