import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabaseClient';
import { User } from '@supabase/supabase-js';
import logger from '../utils/logger';

// Extend Express Request interface to include user with proper typing
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/**
 * Middleware to verify JWT token from Supabase
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized: No token provided' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the token with Supabase
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      logger.warn('Invalid authentication token', { 
        error: error?.message, 
        ip: req.ip, 
        path: req.path 
      });
      
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized: Invalid token' 
      });
    }
    
    // Add the user to the request object
    req.user = data.user;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    logger.error('Authentication middleware error', { error, path: req.path });
    
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error during authentication' 
    });
  }
};

/**
 * Middleware to check if the user has the required role
 * 
 * @param roles - Array of roles allowed to access the resource
 * @returns Express middleware function
 */
export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists (should be set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized: User not authenticated' 
      });
    }
    
    // Check if user has the required role
    const userRole = req.user.app_metadata?.role || 'user';
    
    if (!roles.includes(userRole)) {
      logger.warn('Insufficient permissions', { 
        userId: req.user.id, 
        requiredRoles: roles, 
        userRole: userRole,
        path: req.path
      });
      
      return res.status(403).json({ 
        success: false, 
        error: 'Forbidden: Insufficient permissions' 
      });
    }
    
    // User has the required role, continue
    next();
  };
};
