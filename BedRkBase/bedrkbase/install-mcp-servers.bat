@echo off
echo Installing MCP Servers using TypeScript implementation...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Run the TypeScript installation script
echo Running the TypeScript MCP server installer...
npx ts-node scripts/installMcpServers.ts

REM Check if installation was successful
if %ERRORLEVEL% NEQ 0 (
    echo Error: MCP server installation failed.
    exit /b 1
)

echo.
echo MCP Servers installation completed successfully!
echo You can now use the MCP servers in your BedRkBase project.