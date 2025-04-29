#!/bin/bash

# Backup script for BedRkBase project

# Define backup directory and timestamp
BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/project_backup_$TIMESTAMP.zip"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create a zip archive of the project excluding unnecessary files
zip -r "$BACKUP_FILE" . -x "*.git*" -x "node_modules/*" -x "*.log" -x "*.tmp" -x "*.bak"

# Print success message
echo "Backup created at $BACKUP_FILE"
