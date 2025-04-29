# MCP Servers Scripts Summary

This document provides a summary of all the scripts included in the MCP Servers installation package.

## Main Scripts

| Script | Purpose |
|--------|---------|
| `setup-mcp-servers.sh` | Master script that runs all the necessary steps in sequence to set up the MCP servers |
| `install-mcp-servers.sh` | Registers each MCP server with Cline and runs a test command to verify it's working |
| `test-mcp-servers.sh` | Tests all MCP servers after installation to verify they're working correctly |

## Utility Scripts

| Script | Purpose |
|--------|---------|
| `check-dependencies.sh` | Checks if all required dependencies for MCP servers are installed |
| `verify-files.sh` | Verifies that all required files for MCP servers installation are present |
| `make-scripts-executable.sh` | Makes all MCP server scripts executable |
| `update-postgres-password.sh` | Updates the PostgreSQL password in all scripts |
| `list-mcp-servers.sh` | Lists all registered MCP servers and their status |
| `update-mcp-servers.sh` | Updates all MCP servers to their latest versions |
| `create-archive.sh` | Creates a ZIP archive of all MCP server files for easy distribution |
| `test-archive.sh` | Tests the archive creation process |
| `uninstall-mcp-servers.sh` | Uninstalls all MCP servers and optionally removes all files |

## Configuration Files

| File | Purpose |
|------|---------|
| `cli-mcp-config.json` | Configuration for the CLI MCP Server |
| `MCP-SERVERS-README.md` | Documentation for the MCP Servers installation package |
| `mcp-usage-examples.js` | Examples of how to use the MCP servers in Node.js applications |
| `docs/presentation.txt` | Sample file for testing the MarkItDown MCP server |

## Installation Workflow

1. Run `verify-files.sh` to check if all required files are present
2. Run `check-dependencies.sh` to check if all required dependencies are installed
3. Run `make-scripts-executable.sh` to make all scripts executable
4. Run `update-postgres-password.sh` to update the PostgreSQL password in all scripts
5. Run `install-mcp-servers.sh` to install all MCP servers
6. Run `test-mcp-servers.sh` to verify all MCP servers are working correctly
7. Run `list-mcp-servers.sh` to check the status of all registered MCP servers

Alternatively, you can run `setup-mcp-servers.sh` to perform all these steps in sequence.

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
