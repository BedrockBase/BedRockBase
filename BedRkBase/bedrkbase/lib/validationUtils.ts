/**
 * Validation utilities for BedRkBase
 * 
 * Contains helper functions for input validation
 */
import logger from './logger';

/**
 * Validates an email address format
 * 
 * @param email - Email address to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  // Simple regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * 
 * @param password - Password to validate
 * @param options - Validation options
 * @returns Validation result with boolean and message
 */
export function validatePassword(
  password: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): { isValid: boolean; message?: string } {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options;

  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < minLength) {
    return { 
      isValid: false,
      message: `Password must be at least ${minLength} characters long`
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { 
      isValid: false,
      message: 'Password must contain at least one uppercase letter'
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { 
      isValid: false,
      message: 'Password must contain at least one lowercase letter'
    };
  }

  if (requireNumbers && !/\d/.test(password)) {
    return { 
      isValid: false,
      message: 'Password must contain at least one number'
    };
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { 
      isValid: false,
      message: 'Password must contain at least one special character'
    };
  }

  return { isValid: true };
}

/**
 * Sanitizes a string to prevent XSS attacks
 * 
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Creates a validation error
 * 
 * @param field - The field with the error
 * @param message - Error message
 * @returns Validation error object
 */
export function createValidationError(field: string, message: string): Record<string, string> {
  logger.debug(`Validation error: ${field} - ${message}`);
  return { [field]: message };
}

export default {
  isValidEmail,
  validatePassword,
  sanitizeString,
  createValidationError
};
