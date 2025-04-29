#!/bin/bash

# Master script to set up MCP servers
# This script will run all the necessary steps in sequence

echo "MCP Servers Setup"
echo "================="

# Step 1: Verify files
echo -e "\n[Step 1/6] Verifying installation files..."
./verify-files.sh

# Step 2: Check dependencies
echo -e "\n[Step 2/6] Checking dependencies..."
./check-dependencies.sh

# Ask if user wants to continue
read -p "Continue with MCP server setup? (y/n): " continue_setup
if [[ ! $continue_setup =~ ^[Yy]$ ]]; then
  echo "Setup aborted."
  exit 0
fi

# Step 3: Update PostgreSQL password
echo -e "\n[Step 3/6] Updating PostgreSQL password..."
read -sp "Enter your PostgreSQL password: " pg_password
echo ""
./update-postgres-password.sh "$pg_password"

# Step 4: Install MCP servers
echo -e "\n[Step 4/6] Installing MCP servers..."
echo "This may take some time. Please be patient."
./install-mcp-servers.sh

# Step 5: Test MCP servers
echo -e "\n[Step 5/6] Testing MCP servers..."
read -p "Do you want to run the test script now? (y/n): " run_tests
if [[ $run_tests =~ ^[Yy]$ ]]; then
  ./test-mcp-servers.sh
else
  echo "Skipping tests. You can run them later with: ./test-mcp-servers.sh"
fi

# Step 6: Show usage examples
echo -e "\n[Step 6/6] Usage examples..."
echo "A JavaScript example file has been created: mcp-usage-examples.js"
echo "You can run it with: node mcp-usage-examples.js"

echo -e "\nSetup complete!"
echo "For more information, see MCP-SERVERS-README.md"
