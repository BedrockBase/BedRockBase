@echo off
echo Installing MCP Servers for Windows...

REM Check if npx is installed
where npx >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: npx is not installed. Please install Node.js and npm first.
    exit /b 1
)

REM Check if cline is installed
where cline >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing cline globally...
    npm install -g @anthropic-ai/cline
)

echo.
echo 1. Installing React Analyzer MCP...
call cline register-server react-analyzer-mcp ^
  --url https://github.com/azer/react-analyzer-mcp ^
  --command "npx" --args ["react-analyzer-mcp","serve"]

echo Testing React Analyzer MCP...
call cline call react-analyzer-mcp analyze-react --file pages/establishments.tsx

echo.
echo 2. Installing Supabase MCP...
call cline register-server supabase-mcp ^
  --url https://github.com/supabase-community/supabase-mcp ^
  --command "npx" --args ["supabase","mcp","start"]

echo Testing Supabase MCP...
call cline call supabase-mcp listTables --project-id ulbkeztfjegfchgzfosc

echo.
echo 3. Installing Prisma MCP...
call cline register-server prisma-mcp ^
  --url https://github.com/prisma/prisma ^
  --command "npx" --args ["prisma","mcp"]

echo Testing Prisma MCP...
call cline call prisma-mcp migrate --schema prisma/schema.prisma

echo.
echo 4. Installing Postgres & PostGIS MCP...
call cline register-server pg-mcp ^
  --url https://github.com/stuzero/pg-mcp-server ^
  --command "npx" --args ["pg-mcp-server","serve"]

echo Testing Postgres & PostGIS MCP...
call cline call pg-mcp listTables --database-url "postgres://postgres:YOUR_LOCAL_PASSWORD@localhost:5432/postgres"

echo.
echo 5. Installing XiYan Text2SQL MCP...
call cline register-server xiyan-mcp ^
  --url https://github.com/XGenerationLab/xiyan_mcp_server ^
  --command "node" --args ["index.js"]

echo Testing XiYan Text2SQL MCP...
call cline call xiyan-mcp text2sql --prompt "List all establishments within 5km of latitude X, longitude Y"

echo.
echo 6. Installing MariaCCC Text2SQL MCP...
call cline register-server text2sql-mcp ^
  --url https://github.com/mariaccc/text2sql-mcp-server ^
  --command "./mvnw" --args ["spring-boot:run"]

echo Testing MariaCCC Text2SQL MCP...
call cline call text2sql-mcp text2sql --prompt "Show user activity in the last month"

echo.
echo 7. Installing Markdownify MCP...
call cline register-server markdownify-mcp ^
  --url https://github.com/zcaceres/markdownify-mcp ^
  --command "python" --args ["-m","markdownify_mcp"]

echo Testing Markdownify MCP...
call cline call markdownify-mcp convert --file README.md

echo.
echo 8. Installing MarkItDown MCP...
call cline register-server markitdown-mcp ^
  --url https://github.com/KorigamiK/markitdown_mcp_server ^
  --command "python" --args ["markitdown_mcp_server"]

echo Testing MarkItDown MCP...
call cline call markitdown-mcp convert --file docs/presentation.txt

echo.
echo 9. Installing CLI MCP Server...
call cline register-server cli-mcp-server ^
  --url https://github.com/MladenSU/cli-mcp-server ^
  --command "cli-mcp-server" --args ["--config","cli-mcp-config.json"]

echo Testing CLI MCP Server...
call cline call cli-mcp-server run --command "bash backup.sh"

echo.
echo MCP Servers installation completed!