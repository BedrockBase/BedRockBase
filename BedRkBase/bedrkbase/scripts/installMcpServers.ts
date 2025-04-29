/**
 * MCP Server Installation Script
 * 
 * This script handles the installation and registration of Model Context Protocol (MCP) servers
 * for use with the BedRkBase project.
 * 
 * @module scripts/installMcpServers
 */

import { spawn, SpawnOptions } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { logger } from '../lib/logger';

// Load environment variables
dotenv.config();

/**
 * Interface representing an MCP server configuration
 */
interface McpServer {
  name: string;
  description: string;
  url: string;
  command: string;
  args: string[];
  testCommand?: {
    action: string;
    params: Record<string, string>;
  };
}

/**
 * Represents the result of an MCP server operation
 */
interface McpOperationResult {
  success: boolean;
  name: string;
  message: string;
  error?: Error;
}

/**
 * Class responsible for managing MCP server installations
 */
class McpServerInstaller {
  private _servers: McpServer[];
  private _clineCommand: string;
  private _postgresPassword: string;
  
  /**
   * Creates a new instance of the MCP Server Installer
   * 
   * @param postgresPassword - The password for PostgreSQL connection
   */
  constructor(postgresPassword: string = '') {
    this._postgresPassword = postgresPassword || process.env.PG_PASSWORD || 'YOUR_LOCAL_PASSWORD';
    
    // Determine the cline command based on the operating system
    this._clineCommand = this._detectClineCommand();
    
    // Define MCP servers to install
    this._servers = [
      {
        name: 'react-analyzer-mcp',
        description: 'Analyze React/TSX components',
        url: 'https://github.com/azer/react-analyzer-mcp',
        command: 'npx',
        args: ['react-analyzer-mcp', 'serve'],
        testCommand: {
          action: 'analyze-react',
          params: { file: 'pages/establishments.tsx' }
        }
      },
      {
        name: 'supabase-mcp',
        description: 'Manage Supabase projects & tables',
        url: 'https://github.com/supabase-community/supabase-mcp',
        command: 'npx',
        args: ['supabase', 'mcp', 'start'],
        testCommand: {
          action: 'listTables',
          params: { 'project-id': 'ulbkeztfjegfchgzfosc' }
        }
      },
      {
        name: 'prisma-mcp',
        description: 'Prisma Postgres management',
        url: 'https://github.com/prisma/prisma',
        command: 'npx',
        args: ['prisma', 'mcp'],
        testCommand: {
          action: 'migrate',
          params: { schema: 'prisma/schema.prisma' }
        }
      },
      {
        name: 'pg-mcp',
        description: 'Postgres & PostGIS support',
        url: 'https://github.com/stuzero/pg-mcp-server',
        command: 'npx',
        args: ['pg-mcp-server', 'serve'],
        testCommand: {
          action: 'listTables',
          params: { 'database-url': `postgres://postgres:${this._postgresPassword}@localhost:5432/postgres` }
        }
      },
      {
        name: 'xiyan-mcp',
        description: 'NL→SQL conversion',
        url: 'https://github.com/XGenerationLab/xiyan_mcp_server',
        command: 'node',
        args: ['index.js'],
        testCommand: {
          action: 'text2sql',
          params: { prompt: 'List all establishments within 5km of latitude X, longitude Y' }
        }
      },
      {
        name: 'text2sql-mcp',
        description: 'Alternative NL→SQL conversion',
        url: 'https://github.com/mariaccc/text2sql-mcp-server',
        command: './mvnw',
        args: ['spring-boot:run'],
        testCommand: {
          action: 'text2sql',
          params: { prompt: 'Show user activity in the last month' }
        }
      },
      {
        name: 'markdownify-mcp',
        description: 'File to Markdown conversion',
        url: 'https://github.com/zcaceres/markdownify-mcp',
        command: 'python',
        args: ['-m', 'markdownify_mcp'],
        testCommand: {
          action: 'convert',
          params: { file: 'README.md' }
        }
      },
      {
        name: 'markitdown-mcp',
        description: 'Rich file to Markdown conversion',
        url: 'https://github.com/KorigamiK/markitdown_mcp_server',
        command: 'python',
        args: ['markitdown_mcp_server'],
        testCommand: {
          action: 'convert',
          params: { file: 'docs/presentation.txt' }
        }
      },
      {
        name: 'cli-mcp-server',
        description: 'Secure shell & script execution',
        url: 'https://github.com/MladenSU/cli-mcp-server',
        command: 'cli-mcp-server',
        args: ['--config', 'cli-mcp-config.json'],
        testCommand: {
          action: 'run',
          params: { command: 'bash backup.sh' }
        }
      }
    ];
  }

  /**
   * Detects the appropriate cline command based on the current OS
   * 
   * @returns The path to the cline command
   */
  private _detectClineCommand(): string {
    const isWindows = process.platform === 'win32';
    
    // Check if bao-cline is globally installed
    try {
      // First, check if bao-cline is available
      const testCommand = isWindows ? 'where bao-cline' : 'which bao-cline';
      const result = require('child_process').execSync(testCommand, { encoding: 'utf8' });
      
      if (result && result.trim()) {
        return 'bao-cline'; // bao-cline is globally available
      }
    } catch (error) {
      logger.warn('bao-cline not found in global path, trying alternatives...');
    }
    
    // Check in specific paths
    if (isWindows) {
      const npmPath = path.join(process.env.APPDATA || '', 'npm', 'bao-cline.cmd');
      if (existsSync(npmPath)) {
        return npmPath;
      }
      
      // Try npx as fallback
      return 'npx bao-cline';
    } else {
      // Linux/MacOS path
      const defaultPath = '/usr/local/bin/bao-cline';
      if (existsSync(defaultPath)) {
        return defaultPath;
      }
      
      return 'npx bao-cline';
    }
  }

  /**
   * Executes a command and returns a promise
   * 
   * @param command - The command to execute
   * @param args - Arguments for the command
   * @param options - Spawn options
   * @returns A promise that resolves with the command output
   */
  private async _executeCommand(
    command: string, 
    args: string[] = [], 
    options: SpawnOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, { shell: true, ...options });
      
      let stdout = '';
      let stderr = '';
      
      process.stdout?.on('data', (data) => {
        stdout += data.toString();
      });
      
      process.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`Command failed with code ${code}: ${stderr}`));
        }
      });
      
      process.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Registers an MCP server with cline
   * 
   * @param server - The MCP server to register
   * @returns A promise that resolves with the operation result
   */
  public async registerServer(server: McpServer): Promise<McpOperationResult> {
    try {
      logger.info(`Registering ${server.name} (${server.description})...`);
      
      const args = [
        'register-server',
        server.name,
        '--url',
        server.url,
        '--command',
        `"${server.command}"`,
        '--args',
        JSON.stringify(server.args)
      ];
      
      const output = await this._executeCommand(this._clineCommand, args);
      
      logger.info(`Successfully registered ${server.name}`);
      return {
        success: true,
        name: server.name,
        message: `Successfully registered ${server.name}`
      };
    } catch (error) {
      logger.error(`Failed to register ${server.name}: ${(error as Error).message}`);
      return {
        success: false,
        name: server.name,
        message: `Failed to register ${server.name}`,
        error: error as Error
      };
    }
  }

  /**
   * Tests an MCP server
   * 
   * @param server - The MCP server to test
   * @returns A promise that resolves with the operation result
   */
  public async testServer(server: McpServer): Promise<McpOperationResult> {
    if (!server.testCommand) {
      return {
        success: false,
        name: server.name,
        message: 'No test command defined'
      };
    }
    
    try {
      logger.info(`Testing ${server.name}...`);
      
      const args = ['call', server.name, server.testCommand.action];
      
      // Add parameters
      Object.entries(server.testCommand.params).forEach(([key, value]) => {
        args.push(`--${key}`, `"${value}"`);
      });
      
      const output = await this._executeCommand(this._clineCommand, args);
      
      logger.info(`Successfully tested ${server.name}`);
      return {
        success: true,
        name: server.name,
        message: `Successfully tested ${server.name}`
      };
    } catch (error) {
      logger.error(`Failed to test ${server.name}: ${(error as Error).message}`);
      return {
        success: false,
        name: server.name,
        message: `Failed to test ${server.name}`,
        error: error as Error
      };
    }
  }

  /**
   * Installs all MCP servers
   * 
   * @param testAfterInstall - Whether to test servers after installation
   * @returns A promise that resolves with the operation results
   */
  public async installAllServers(testAfterInstall: boolean = true): Promise<McpOperationResult[]> {
    const results: McpOperationResult[] = [];
    
    for (const server of this._servers) {
      const registrationResult = await this.registerServer(server);
      results.push(registrationResult);
      
      if (registrationResult.success && testAfterInstall && server.testCommand) {
        const testResult = await this.testServer(server);
        results.push(testResult);
      }
    }
    
    return results;
  }
}

/**
 * Main function to run the installer
 */
async function main(): Promise<void> {
  try {
    const postgresPassword = process.env.PG_PASSWORD || '';
    const installer = new McpServerInstaller(postgresPassword);
    
    console.log('Starting MCP server installation...');
    const results = await installer.installAllServers();
    
    // Count success and failures
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log('\nMCP Server Installation Summary:');
    console.log(`✅ Successfully completed: ${successful}`);
    console.log(`❌ Failed operations: ${failed}`);
    
    if (failed > 0) {
      console.log('\nFailed operations:');
      results
        .filter(r => !r.success)
        .forEach(r => console.log(`- ${r.name}: ${r.message}`));
    }
    
    console.log('\nInstallation completed.');
  } catch (error) {
    console.error('Installation failed with error:', error);
    process.exit(1);
  }
}

// Run the installer if this file is executed directly
if (require.main === module) {
  main();
}

export { McpServerInstaller, McpServer, McpOperationResult };