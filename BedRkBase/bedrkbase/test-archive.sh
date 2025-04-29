#!/bin/bash

# Script to test the create-archive.sh script
# Usage: ./test-archive.sh

echo "Testing Archive Creation"
echo "======================="

# Run the create-archive.sh script
echo "Creating archive..."
./create-archive.sh

# Check if the archive was created
echo -e "\nChecking for created archive..."
ARCHIVE=$(ls -t mcp-servers-*.zip 2>/dev/null | head -n 1)

if [ -n "$ARCHIVE" ] && [ -f "$ARCHIVE" ]; then
  echo "✅ Archive created successfully: $ARCHIVE"
  echo "Archive size: $(du -h "$ARCHIVE" | cut -f1)"
  
  # Create a test directory
  TEST_DIR="test-extract"
  echo -e "\nExtracting archive to $TEST_DIR directory..."
  mkdir -p "$TEST_DIR"
  
  # Extract the archive
  unzip -q "$ARCHIVE" -d "$TEST_DIR"
  
  # Check if extraction was successful
  if [ $? -eq 0 ]; then
    echo "✅ Archive extracted successfully"
    
    # Check if all required files are present in the extracted directory
    echo -e "\nVerifying extracted files..."
    cd "$TEST_DIR/mcp-servers-temp"
    
    # Run the verify-files.sh script from the extracted directory
    if [ -f "verify-files.sh" ]; then
      chmod +x verify-files.sh
      ./verify-files.sh
    else
      echo "❌ verify-files.sh not found in the extracted directory"
    fi
    
    # Return to the original directory
    cd ../..
    
    # Clean up
    echo -e "\nCleaning up..."
    rm -rf "$TEST_DIR"
    echo "✅ Test directory removed"
  else
    echo "❌ Failed to extract archive"
  fi
else
  echo "❌ No archive found"
fi

echo -e "\nTest completed!"
