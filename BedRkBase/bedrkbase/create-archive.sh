#!/bin/bash

# Script to create a ZIP archive of all MCP server files for easy distribution
# Usage: ./create-archive.sh

echo "Creating MCP Servers Archive"
echo "=========================="

# Define archive name with timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
ARCHIVE_NAME="mcp-servers-$TIMESTAMP.zip"

# List of files to include in the archive
FILES=(
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
)

# Create a temporary directory
TEMP_DIR="mcp-servers-temp"
mkdir -p "$TEMP_DIR"
mkdir -p "$TEMP_DIR/docs"

# Copy files to the temporary directory
echo "Copying files to temporary directory..."
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    cp "$file" "$TEMP_DIR/"
    echo "✅ Copied $file"
  else
    echo "❌ $file not found, skipping."
  fi
done

# Copy docs directory
if [ -d "docs" ] && [ -f "docs/presentation.txt" ]; then
  cp docs/presentation.txt "$TEMP_DIR/docs/"
  echo "✅ Copied docs/presentation.txt"
else
  echo "❌ docs/presentation.txt not found, skipping."
fi

# Create the ZIP archive
echo -e "\nCreating ZIP archive..."
zip -r "$ARCHIVE_NAME" "$TEMP_DIR" > /dev/null

# Clean up
rm -rf "$TEMP_DIR"

if [ -f "$ARCHIVE_NAME" ]; then
  echo "✅ Archive created successfully: $ARCHIVE_NAME"
  echo "Archive size: $(du -h "$ARCHIVE_NAME" | cut -f1)"
else
  echo "❌ Failed to create archive."
fi

echo -e "\nYou can distribute this archive to others who want to install the MCP servers."
echo "They should extract the archive and run ./setup-mcp-servers.sh to start the installation process."
