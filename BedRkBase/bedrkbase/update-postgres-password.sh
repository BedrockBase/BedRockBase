#!/bin/bash

# Script to update PostgreSQL password in all MCP server scripts
# Usage: ./update-postgres-password.sh YOUR_ACTUAL_PASSWORD

if [ $# -ne 1 ]; then
  echo "Usage: ./update-postgres-password.sh YOUR_ACTUAL_PASSWORD"
  echo "Example: ./update-postgres-password.sh mySecurePassword123"
  exit 1
fi

NEW_PASSWORD=$1
FILES=("install-mcp-servers.sh" "test-mcp-servers.sh" "mcp-usage-examples.js")

echo "Updating PostgreSQL password in MCP server scripts..."

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Updating $file..."
    # Use different sed syntax based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      sed -i '' "s/YOUR_LOCAL_PASSWORD/$NEW_PASSWORD/g" "$file"
    else
      # Linux and others
      sed -i "s/YOUR_LOCAL_PASSWORD/$NEW_PASSWORD/g" "$file"
    fi
  else
    echo "Warning: $file not found, skipping."
  fi
done

echo "Password update complete!"
echo "Note: If your password contains special characters, you may need to manually edit the files."
