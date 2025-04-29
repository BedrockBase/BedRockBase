#!/bin/bash

# Script to verify that all required files for MCP servers installation are present
# Usage: ./verify-files.sh

echo "Verifying MCP Server Installation Files"
echo "======================================"

# List of required files
REQUIRED_FILES=(
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
  "cli-mcp-config.json"
  "MCP-SERVERS-README.md"
  "SCRIPTS-SUMMARY.md"
  "mcp-usage-examples.js"
  "docs/presentation.txt"
)

# Check each required file
MISSING=0
for file in "${REQUIRED_FILES[@]}"; do
  echo -n "Checking for $file... "
  if [ -f "$file" ] || [ -d "$file" ]; then
    echo "✅ Found"
  else
    echo "❌ Missing"
    MISSING=1
  fi
done

# Check if docs directory exists
echo -n "Checking for docs directory... "
if [ -d "docs" ]; then
  echo "✅ Found"
else
  echo "❌ Missing"
  MISSING=1
fi

# Summary
echo -e "\nVerification Summary:"
if [ $MISSING -eq 0 ]; then
  echo "✅ All required files are present!"
  echo "You can proceed with the MCP servers installation."
else
  echo "❌ Some required files are missing. Please make sure all files are present before proceeding."
fi

# Check if scripts are executable
echo -e "\nChecking if scripts are executable:"
for file in "${REQUIRED_FILES[@]}"; do
  if [[ $file == *.sh ]]; then
    echo -n "Checking if $file is executable... "
    if [ -x "$file" ]; then
      echo "✅ Executable"
    else
      echo "❌ Not executable"
      echo "   Run ./make-scripts-executable.sh to make all scripts executable."
      break
    fi
  fi
done
