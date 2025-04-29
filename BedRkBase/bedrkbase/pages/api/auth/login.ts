import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import logger from '../../../lib/logger';
import { login as authLogin } from '../../../lib/authService';

/**
 * API Route: POST /api/auth/login
 * Handles user authentication using the unified authService and standardized logging.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    logger.warn('Method not allowed', { method: req.method });
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn('Authentication attempt with missing credentials');
    return res.status(400).json({ 
      success: false, 
      error: 'Email and password are required.' 
    });
  }

  // Validate email format using proper regex literal
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    logger.warn('Invalid email format provided', { email });
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid email format.' 
    });
  }

  try {
    const { user, error } = await authLogin(email, password);

    if (error || !user) {
      logger.warn('Failed login attempt', { email, error });
      return res.status(401).json({ 
        success: false, 
        error: error || 'Authentication failed.' 
      });
    }

    // Set session cookie if available (assume access_token is available on user object or via session)
    // If not, this logic may need to be adapted to your session management
    if (!user.id) {
      logger.error('Authentication failed: No user ID returned', { email });
      return res.status(500).json({ 
        success: false, 
        error: 'Authentication failed. No user returned.' 
      });
    }

    // NOTE: If you want to set a session token, you may need to adapt this to your session/token structure
    // For now, just log the success
    logger.info('User logged in successfully', { userId: user.id, email });

    // Optionally, set a cookie or return tokens as needed
    // res.setHeader('Set-Cookie', cookie.serialize('sb:token', accessToken, { ... }));

    return res.status(200).json({ 
      success: true, 
      data: { user } 
    });
  } catch (err) {
    logger.error('Unexpected error during authentication', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
