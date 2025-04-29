/**
 * Unified logger for BedRkBase frontend application
 * Compatible with both browser and Node.js environments
 */
import { mapError } from './types/errors';

/**
 * Logger level type
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log entry metadata type
 */
export interface LogMetadata {
  [key: string]: unknown;
}

/**
 * Logger interface
 */
export interface Logger {
  debug(message: string, meta?: LogMetadata): void;
  info(message: string, meta?: LogMetadata): void;
  warn(message: string, meta?: LogMetadata): void;
  error(message: string, meta?: LogMetadata | Error | unknown): void;
}

/**
 * Formats the log message with metadata for consistent output
 */
function formatLog(level: LogLevel, message: string, meta?: LogMetadata): string {
  const timestamp = new Date().toISOString();
  
  if (meta) {
    // Filter out sensitive information
    const sanitizedMeta = { ...meta };
    const sensitiveKeys = ['password', 'token', 'key', 'secret', 'auth'];
    
    sensitiveKeys.forEach(key => {
      if (Object.keys(sanitizedMeta).some(k => k.toLowerCase().includes(key))) {
        const matchingKeys = Object.keys(sanitizedMeta).filter(k => 
          k.toLowerCase().includes(key)
        );
        
        matchingKeys.forEach(k => {
          sanitizedMeta[k] = '[REDACTED]';
        });
      }
    });
    
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${JSON.stringify(sanitizedMeta)}`;
  }
  
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

/**
 * Simple logger implementation that works in both browser and Node.js
 */
const logger: Logger = {
  debug: (message: string, meta?: LogMetadata) => {
    if (process.env.NODE_ENV === 'production') return;
    console.debug(formatLog('debug', message, meta));
  },
  
  info: (message: string, meta?: LogMetadata) => {
    console.info(formatLog('info', message, meta));
  },
  
  warn: (message: string, meta?: LogMetadata) => {
    console.warn(formatLog('warn', message, meta));
  },
  
  error: (message: string, meta?: LogMetadata | Error | unknown) => {
    // Handle the case where an Error object is passed instead of metadata
    if (meta instanceof Error) {
      const errorMeta: LogMetadata = {
        message: meta.message,
        stack: meta.stack,
        name: meta.name
      };
      console.error(formatLog('error', message, errorMeta));
      return;
    }
    
    // Handle unknown error types
    if (meta && !(typeof meta === 'object')) {
      const error = mapError(meta);
      console.error(formatLog('error', message, {
        message: error.message,
        name: error.name
      }));
      return;
    }
    
    console.error(formatLog('error', message, meta as LogMetadata));
  }
};

export default logger;
