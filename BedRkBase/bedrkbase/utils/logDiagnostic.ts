/**
 * Log diagnostic utility to verify logging configuration is working properly
 * This can be used to troubleshoot logging issues in different environments
 */

/**
 * Run a series of diagnostic logs across different output methods
 * to help identify where the logging pipeline might be broken
 */
export function runLogDiagnostic(): void {
  const timestamp = new Date().toISOString();
  const prefix = `[LOG-DIAGNOSTIC ${timestamp}]`;
  
  // Configuration info
  const config = {
    nodeEnv: process.env.NODE_ENV,
    logLevel: process.env.LOG_LEVEL,
    logFormat: process.env.LOG_FORMAT,
    debugEnabled: !!process.env.DEBUG,
    debugValue: process.env.DEBUG,
    consoleOutputEnabled: process.env.ENABLE_CONSOLE_OUTPUT === 'true',
    forceColor: process.env.FORCE_COLOR,
    logToStdout: process.env.LOG_TO_STDOUT === 'true',
  };
  
  // Log to different outputs using different methods
  
  // 1. Direct console methods
  console.log(`${prefix} Console.log test message`);
  console.info(`${prefix} Console.info test message`);
  console.warn(`${prefix} Console.warn test message`);
  console.error(`${prefix} Console.error test message`);
  console.debug(`${prefix} Console.debug test message (may be hidden based on log level)`);
  
  // 2. Standard output
  process.stdout.write(`${prefix} Direct stdout write test message\n`);
  process.stderr.write(`${prefix} Direct stderr write test message\n`);
  
  // 3. Configuration information
  console.log(`${prefix} Environment configuration:`, JSON.stringify(config, null, 2));
  
  // 4. Check if running in Docker
  const inDocker = process.env.DOCKER_NETWORK_MODE === 'true';
  console.log(`${prefix} Running in Docker: ${inDocker}`);
  
  // 5. Add a recognizable pattern for troubleshooting
  console.log(`
  ******************************
  * ${prefix}
  * If you can see this message,
  * console.log is working!
  ******************************
  `);
}

/**
 * Check if diagnostic logging is enabled and run diagnostics if so
 */
export function checkAndRunDiagnostics(): void {
  if (process.env.DIAGNOSTIC_LOG_CHECK === 'true') {
    console.log('Starting log diagnostics...');
    runLogDiagnostic();
  }
}

// Auto-run on import if in development and explicitly enabled
if (process.env.NODE_ENV === 'development' && process.env.DIAGNOSTIC_LOG_CHECK === 'true') {
  checkAndRunDiagnostics();
}
