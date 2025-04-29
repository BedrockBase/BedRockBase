/**
 * Structured logging utility for consistent application logging
 * Handles different log levels and formats with contextual information
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, unknown>;

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

/**
 * Determines if full debug logs should be shown
 * Uses environment variable in Node or localStorage in browser
 */
const isDebugMode = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('debug') === 'true';
  }
  return process.env.NODE_ENV === 'development';
};

/**
 * Formats error objects for logging, avoiding exposure of sensitive data
 */
const formatError = (error: unknown): LogEntry['error'] => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: isDebugMode() ? error.stack : undefined,
    };
  }
  return {
    name: 'UnknownError',
    message: String(error),
  };
};

/**
 * Creates a structured log entry
 */
const createLogEntry = (
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: unknown
): LogEntry => {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context: sanitizeContext(context),
    error: error ? formatError(error) : undefined,
  };
};

/**
 * Sanitizes log context to avoid logging sensitive data
 */
const sanitizeContext = (context?: LogContext): LogContext | undefined => {
  if (!context) return undefined;
  
  const sanitized: LogContext = {};
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];
  
  Object.entries(context).forEach(([key, value]) => {
    // Mask sensitive fields
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      sanitized[key] = '***REDACTED***';
    } 
    // Handle nested objects
    else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeContext(value as LogContext);
    } 
    // Pass safe values through
    else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};

/**
 * Outputs log entry to appropriate destination
 */
const outputLog = (entry: LogEntry): void => {
  const logString = JSON.stringify(entry);
  
  switch (entry.level) {
    case 'debug':
      if (isDebugMode()) console.debug(logString);
      break;
    case 'info':
      console.info(logString);
      break;
    case 'warn':
      console.warn(logString);
      break;
    case 'error':
      console.error(logString);
      break;
  }
};

/**
 * Logger instance with methods for different log levels
 */
export const logger = {
  debug: (message: string, context?: LogContext): void => {
    outputLog(createLogEntry('debug', message, context));
  },
  
  info: (message: string, context?: LogContext): void => {
    outputLog(createLogEntry('info', message, context));
  },
  
  warn: (message: string, context?: LogContext): void => {
    outputLog(createLogEntry('warn', message, context));
  },
  
  error: (message: string, context?: LogContext, error?: unknown): void => {
    outputLog(createLogEntry('error', message, context, error));
  },
  
  /**
   * Logs the performance of async operations
   */
  logPerformance: async <T>(
    operation: string, 
    fn: () => Promise<T>,
    context?: LogContext
  ): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      logger.debug(`${operation} completed`, {
        ...context,
        durationMs: Math.round(duration),
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      logger.error(
        `${operation} failed`, 
        {
          ...context,
          durationMs: Math.round(duration),
        },
        error
      );
      
      throw error;
    }
  }
};

/**
 * Error types for better error classification
 */
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
