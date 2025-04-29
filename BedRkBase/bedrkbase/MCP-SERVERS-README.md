# MCP Servers Installation Guide

This guide provides instructions for installing and testing 9 different MCP (Model Context Protocol) servers that extend Cline's capabilities with various tools.

## Quick Start

For a guided setup experience, run the master setup script:

```bash
# Make the script executable
chmod +x setup-mcp-servers.sh

# Run the setup script
./setup-mcp-servers.sh
```

This script will:
1. Check if all required dependencies are installed
2. Help you update the PostgreSQL password in all scripts
3. Install all MCP servers
4. Optionally run tests to verify the installations
5. Show information about usage examples

Before running the setup, you can verify that all required files are present:

```bash
# Make the script executable
chmod +x verify-files.sh

# Run the verification script
./verify-files.sh
```

This will check that all necessary files are present and executable.

Alternatively, you can follow the manual setup instructions below.

## Prerequisites

- Cline installed and configured
- Node.js and npm installed
- Python installed (for some MCP servers)
- PostgreSQL installed and configured (for database-related MCP servers)
- Maven installed (for MariaCCC Text2SQL MCP)

You can check if all required dependencies are installed by running:

```bash
# Make the script executable
chmod +x check-dependencies.sh

# Run the dependency check
./check-dependencies.sh
```

This script will verify that all necessary software is installed and provide installation links for any missing dependencies.

## Files Prepared

1. `install-mcp-servers.sh` - The main installation script
2. `test-mcp-servers.sh` - Script to test all MCP servers after installation
3. `cli-mcp-config.json` - Configuration for the CLI MCP Server
4. `docs/presentation.txt` - Sample file for testing the MarkItDown MCP server
5. `SCRIPTS-SUMMARY.md` - Summary of all scripts and their purposes

For a complete list of all scripts and their purposes, see the `SCRIPTS-SUMMARY.md` file.

## Important: Before Running the Script

1. Make all scripts executable using the provided helper script:

```bash
# First make this script executable
chmod +x make-scripts-executable.sh

# Then run it to make all other scripts executable
./make-scripts-executable.sh
```

This will automatically make all the scripts executable in one step.

2. Update the PostgreSQL password in all scripts using the provided helper script:

```bash
# Run the script with your actual PostgreSQL password
./update-postgres-password.sh your_actual_password
```

This will automatically update the password in all relevant files.

Alternatively, you can manually edit the `install-mcp-servers.sh` file to replace `YOUR_LOCAL_PASSWORD` with your actual PostgreSQL password:

```bash
# Find this line in the script:
cline call pg-mcp listTables --database-url "postgres://postgres:YOUR_LOCAL_PASSWORD@localhost:5432/postgres"
# Replace YOUR_LOCAL_PASSWORD with your actual PostgreSQL password
```

## Running the Installation Script

Execute the script from your terminal:

```bash
./install-mcp-servers.sh
```

The script will:
1. Register each MCP server with Cline
2. Run a test command for each server to verify it's working correctly

## Testing the MCP Servers

After installation, you can run the test script to verify all MCP servers are working correctly:

```bash
./test-mcp-servers.sh
```

This script will:
1. Test each MCP server with a specific command
2. Display the results of each test
3. Help identify any issues with the MCP server installations

**Note:** Remember to replace `YOUR_LOCAL_PASSWORD` in this script with your actual PostgreSQL password before running it.

## Checking MCP Server Status

You can check the status of all registered MCP servers using the provided script:

```bash
# Make the script executable
chmod +x list-mcp-servers.sh

# Run the status check
./list-mcp-servers.sh
```

This script will:
1. Check if each MCP server is registered with Cline
2. Display the registration status of each server
3. Provide commands for getting more detailed information

## MCP Servers Included

1. **React Analyzer MCP** - Analyzes React/TSX components
2. **Supabase MCP** - Manages Supabase projects & tables
3. **Prisma MCP** - Handles Prisma Postgres management
4. **Postgres & PostGIS MCP** - Provides PostgreSQL and PostGIS support
5. **XiYan Text2SQL MCP** - Converts natural language to SQL
6. **MariaCCC Text2SQL MCP** - Alternative natural language to SQL converter
7. **Markdownify MCP** - Converts files to Markdown
8. **MarkItDown MCP** - Rich file to Markdown converter
9. **CLI MCP Server** - Secure shell & script execution

## Already Registered MCP Servers

The following MCP servers are already registered in your environment:

1. **cline-community** - Provides GitHub integration tools
2. **github.com/upstash/context7-mcp** - Upstash Context7 MCP

## Troubleshooting

- If a server fails to register, check that you have the required dependencies installed
- For database-related servers, ensure your PostgreSQL server is running
- Check the terminal output for specific error messages
- Some servers may require additional configuration or environment variables

## Updating MCP Servers

To update all MCP servers to their latest versions, use the provided update script:

```bash
# Make the script executable
chmod +x update-mcp-servers.sh

# Run the update script
./update-mcp-servers.sh
```

This script will:
1. Unregister each MCP server
2. Re-register it with the latest version
3. Provide status updates for each server

## Creating a Distribution Archive

If you want to share these MCP server scripts with others, you can create a distribution archive:

```bash
# Make the script executable
chmod +x create-archive.sh

# Run the archive creation script
./create-archive.sh
```

This script will:
1. Create a temporary directory with all the necessary files
2. Create a ZIP archive with a timestamp in the filename
3. Clean up the temporary directory

The resulting archive can be shared with others, who can extract it and run the setup script.

You can test the archive creation process using:

```bash
# Make the script executable
chmod +x test-archive.sh

# Run the archive test script
./test-archive.sh
```

This script will:
1. Create an archive using `create-archive.sh`
2. Extract the archive to a temporary directory
3. Verify the contents of the extracted archive
4. Clean up the test directory

## Uninstalling MCP Servers

If you need to uninstall the MCP servers, you can use the provided uninstall script:

```bash
# Make the script executable
chmod +x uninstall-mcp-servers.sh

# Run the uninstall script
./uninstall-mcp-servers.sh
```

This script will:
1. Unregister all MCP servers from Cline
2. Optionally remove all the files created during installation

## Using MCP Servers in Your Projects

Once registered, these MCP servers can be used by Cline and other MCP-aware clients. For example:

```
cline call react-analyzer-mcp analyze-react --file src/components/MyComponent.tsx
```

This enables AI-driven code generation, schema introspection, natural-language SQL, and document conversion directly within your development environment.

## Usage Examples

A JavaScript example file `mcp-usage-examples.js` has been created to demonstrate how to use the MCP servers in your Node.js applications. This file includes examples of:

1. Analyzing React components
2. Converting natural language to SQL
3. Converting files to Markdown
4. Running a backup script using CLI MCP
5. Listing tables in a Supabase project

To run the examples:

```bash
node mcp-usage-examples.js
```

You can use this file as a starting point for integrating MCP servers into your own applications.
