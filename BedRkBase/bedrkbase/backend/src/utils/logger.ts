import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Utility to sanitize sensitive fields in log objects
const SENSITIVE_KEYS = ['password', 'token', 'secret', 'key', 'authorization'];

function sanitizeLogObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeLogObject);
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key of Object.keys(obj)) {
      if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeLogObject(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
}

// Create logger
const baseLogger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'bedrkbase-backend' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // File transport for all logs
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log') 
    }),
    // File transport for error logs
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error' 
    }),
  ],
});

// Wrap logger methods to sanitize metadata
const logger = {
  info: (message: string, meta?: any) => baseLogger.info(message, sanitizeLogObject(meta)),
  warn: (message: string, meta?: any) => baseLogger.warn(message, sanitizeLogObject(meta)),
  error: (message: string, meta?: any) => baseLogger.error(message, sanitizeLogObject(meta)),
  debug: (message: string, meta?: any) => baseLogger.debug(message, sanitizeLogObject(meta)),
  // Add other methods as needed
};

// Add request logger middleware for Express
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  // Log when the request completes
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent') || 'unknown',
    });
  });
  
  next();
};

export default logger;
