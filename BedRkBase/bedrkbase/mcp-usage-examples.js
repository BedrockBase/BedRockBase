/**
 * MCP Servers Usage Examples
 * 
 * This file contains examples of how to use the MCP servers in your Node.js applications.
 * You can run these examples using: node mcp-usage-examples.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper function to execute Cline MCP commands and return the output
function callMCP(server, tool, args) {
  const argsStr = Object.entries(args)
    .map(([key, value]) => `--${key} "${value}"`)
    .join(' ');
  
  const command = `cline call ${server} ${tool} ${argsStr}`;
  console.log(`Executing: ${command}`);
  
  try {
    const output = execSync(command, { encoding: 'utf8' });
    return output;
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    return null;
  }
}

// Example 1: Analyze a React component
function analyzeReactComponent(filePath) {
  console.log('\n=== Example 1: Analyze a React Component ===');
  const result = callMCP('react-analyzer-mcp', 'analyze-react', { file: filePath });
  
  if (result) {
    console.log('Component Analysis:');
    console.log(result);
  }
}

// Example 2: Convert natural language to SQL
function naturalLanguageToSQL(question) {
  console.log('\n=== Example 2: Convert Natural Language to SQL ===');
  const result = callMCP('xiyan-mcp', 'text2sql', { prompt: question });
  
  if (result) {
    console.log('Generated SQL:');
    console.log(result);
  }
}

// Example 3: Convert a file to Markdown
function convertToMarkdown(filePath) {
  console.log('\n=== Example 3: Convert a File to Markdown ===');
  const result = callMCP('markdownify-mcp', 'convert', { file: filePath });
  
  if (result) {
    console.log('Markdown Conversion:');
    console.log(result);
    
    // Save the result to a file
    const outputPath = `${path.basename(filePath, path.extname(filePath))}.md`;
    fs.writeFileSync(outputPath, result);
    console.log(`Saved to ${outputPath}`);
  }
}

// Example 4: Run a backup script using CLI MCP
function runBackupScript() {
  console.log('\n=== Example 4: Run a Backup Script ===');
  const result = callMCP('cli-mcp-server', 'run', { command: 'bash backup.sh' });
  
  if (result) {
    console.log('Backup Script Output:');
    console.log(result);
  }
}

// Example 5: List tables in Supabase project
function listSupabaseTables(projectId) {
  console.log('\n=== Example 5: List Supabase Tables ===');
  const result = callMCP('supabase-mcp', 'listTables', { 'project-id': projectId });
  
  if (result) {
    console.log('Supabase Tables:');
    console.log(result);
  }
}

// Run the examples
(async function runExamples() {
  try {
    // Replace these paths and values with your actual files and project IDs
    analyzeReactComponent('pages/index.tsx');
    naturalLanguageToSQL('Find all establishments created in the last month');
    convertToMarkdown('README.md');
    runBackupScript();
    listSupabaseTables('ulbkeztfjegfchgzfosc');
    
    console.log('\nAll examples completed!');
  } catch (error) {
    console.error('Error running examples:', error);
  }
})();
