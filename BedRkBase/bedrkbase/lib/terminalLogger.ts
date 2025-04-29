import fs from 'fs';
import path from 'path';

/**
 * Terminal logger for BedRkBase
 * Provides logging utilities for terminal operations and diagnostics
 */

// Use a more reliable path for the log file
const logsDir = path.join(process.cwd(), 'logs');
const logFilePath = path.join(logsDir, 'terminal.log');

/**
 * Ensure the logs directory exists
 */
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  console.error('Failed to create logs directory:', error instanceof Error ? error.message : String(error));
}

/**
 * Log a message to both the terminal and log file
 * 
 * @param message - The message to log
 * @param errorDetails - Optional error details to include
 */
export function logMessage(message: string, errorDetails?: string): void {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}${errorDetails ? `\nError: ${errorDetails}` : ''}\n`;
  
  try {
    fs.appendFileSync(logFilePath, logEntry);
  } catch (error) {
    console.error('Failed to write to log file:', error instanceof Error ? error.message : String(error));
  }
  
  console.log(`[${timestamp}] ${message}`);
  if (errorDetails) {
    console.error(`[${timestamp}] Error details: ${errorDetails}`);
  }
}

/**
 * Log a startup diagnostic message
 * Includes environment and system information
 */
export function logStartupDiagnostics(): void {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    pid: process.pid,
    cwd: process.cwd(),
    env: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      PORT: process.env.PORT || 'not set',
      DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'not set',
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'not set'
    }
  };
  
  logMessage('Startup diagnostics', JSON.stringify(diagnostics, null, 2));
}

/**
 * Log system error information
 * 
 * @param error - The error to log
 * @param context - Optional context information
 */
export function logSystemError(error: unknown, context?: string): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  logMessage(
    `System Error${context ? ` in ${context}` : ''}`, 
    `${errorMessage}\n${errorStack ? `Stack: ${errorStack}` : ''}`
  );
}

/**
 * Log a CSS loading error to the terminal and log file
 * 
 * @param details - Details about the CSS loading failure
 */
export function logCssLoadError(details?: string): void {
  logMessage('CSS failed to load in the frontend application', details);
}

export default {
  logMessage,
  logStartupDiagnostics,
  logSystemError,
  logCssLoadError
};
