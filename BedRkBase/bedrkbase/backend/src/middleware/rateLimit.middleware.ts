/**
 * Rate Limiting Middleware for Express
 * 
 * Provides two middlewares:
 * - publicRateLimiter: for unauthenticated/public endpoints (limits by IP)
 * - authRateLimiter: for authenticated endpoints (limits by user ID if available, else IP)
 * 
 * Uses express-rate-limit. For distributed deployments, swap MemoryStore for RedisStore.
 * 
 * @see https://www.npmjs.com/package/express-rate-limit
 * @see [Checklist 8] and snippets.md
 */

import rateLimit from 'express-rate-limit';
import { Request } from 'express';

// Public rate limiter: limits by IP address
export const publicRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});

// Authenticated rate limiter: limits by user ID if available, else IP
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // higher limit for authenticated users
  keyGenerator: (req: Request) => {
    // Use user ID if available, else fallback to IP (always returns a string)
    return req.user?.id || req.ip || '';
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});

// For production/distributed: use RedisStore from 'rate-limit-redis'
// Example:
// import RedisStore from 'rate-limit-redis';
// store: new RedisStore({ sendCommand: ... })
