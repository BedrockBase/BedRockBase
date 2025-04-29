#!/bin/bash

# Script to check if all required dependencies for MCP servers are installed
# Usage: ./check-dependencies.sh

echo "Checking dependencies for MCP servers installation..."
echo "===================================================="

# Function to check if a command exists
check_command() {
  if command -v $1 &> /dev/null; then
    echo "✅ $2 is installed"
    return 0
  else
    echo "❌ $2 is NOT installed"
    return 1
  fi
}

# Check Cline
check_command "cline" "Cline"
CLINE_INSTALLED=$?

# Check Node.js and npm
check_command "node" "Node.js"
NODE_INSTALLED=$?

check_command "npm" "npm"
NPM_INSTALLED=$?

# Check Python
check_command "python" "Python" || check_command "python3" "Python 3"
PYTHON_INSTALLED=$?

# Check PostgreSQL
check_command "psql" "PostgreSQL client"
POSTGRES_INSTALLED=$?

# Check Maven
check_command "mvn" "Maven"
MAVEN_INSTALLED=$?

# Check if PostgreSQL server is running
if [ $POSTGRES_INSTALLED -eq 0 ]; then
  echo -n "Checking if PostgreSQL server is running... "
  if pg_isready &> /dev/null; then
    echo "✅ PostgreSQL server is running"
  else
    echo "❌ PostgreSQL server is NOT running"
    echo "   Please start your PostgreSQL server before installing MCP servers"
  fi
fi

echo -e "\nSummary:"
echo "========"

MISSING=0

if [ $CLINE_INSTALLED -ne 0 ]; then
  echo "❌ Cline is required for MCP servers"
  echo "   Install Cline: https://github.com/cline-ai/cline"
  MISSING=1
fi

if [ $NODE_INSTALLED -ne 0 ] || [ $NPM_INSTALLED -ne 0 ]; then
  echo "❌ Node.js and npm are required for most MCP servers"
  echo "   Install Node.js: https://nodejs.org/"
  MISSING=1
fi

if [ $PYTHON_INSTALLED -ne 0 ]; then
  echo "❌ Python is required for some MCP servers"
  echo "   Install Python: https://www.python.org/downloads/"
  MISSING=1
fi

if [ $POSTGRES_INSTALLED -ne 0 ]; then
  echo "❌ PostgreSQL is required for database-related MCP servers"
  echo "   Install PostgreSQL: https://www.postgresql.org/download/"
  MISSING=1
fi

if [ $MAVEN_INSTALLED -ne 0 ]; then
  echo "❌ Maven is required for MariaCCC Text2SQL MCP"
  echo "   Install Maven: https://maven.apache.org/install.html"
  MISSING=1
fi

if [ $MISSING -eq 0 ]; then
  echo "✅ All required dependencies are installed!"
  echo "   You can proceed with the MCP servers installation."
else
  echo "❌ Some dependencies are missing. Please install them before proceeding."
fi
