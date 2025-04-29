/**
 * Style Utilities for BedRkBase
 * 
 * Contains helper functions to ensure proper CSS loading and error handling
 */
import logger from './logger';

/**
 * Combines multiple CSS class names into a single string
 * 
 * @param classes - Array of class names to combine
 * @returns Combined class names string
 * 
 * @example
 * // Returns "btn btn-primary isActive"
 * classNames('btn', 'btn-primary', isActive && 'isActive')
 */
export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Diagnostic function to verify CSS module loading
 * 
 * @param module - CSS module to check
 * @param componentName - Name of the component for logging
 * @returns The original module
 */
export function verifyCssModule<T>(module: T, componentName: string): T {
  if (!module || Object.keys(module).length === 0) {
    const errorMessage = `CSS module failed to load correctly for ${componentName}`;
    logger.error(errorMessage);
    
    if (typeof window !== 'undefined') {
      console.error(errorMessage);
    }
    
    // Return empty object as fallback to prevent runtime errors
    return {} as T;
  }
  
  return module;
}

/**
 * Ensures consistent loading of CSS modules across environments
 * 
 * @param styles - CSS module styles object
 * @param className - CSS class name to retrieve
 * @param fallback - Fallback class name if the module or class doesn't exist
 * @returns The class name from the module or the fallback
 */
export function getClassName(
  styles: Record<string, string>,
  className: string,
  fallback: string = className
): string {
  return styles[className] || fallback;
}

export default {
  classNames,
  verifyCssModule,
  getClassName
};
