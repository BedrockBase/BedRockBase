// Add this near the top of your file
import { checkAndRunDiagnostics } from '../../utils/logDiagnostic';

// Run diagnostics before server starts
checkAndRunDiagnostics();

// ...existing server code...

// Add this after server initialization but before server start
console.log('Server initializing with log level:', process.env.LOG_LEVEL);
console.log(`Log output configured to: ${process.env.LOG_TO_STDOUT === 'true' ? 'STDOUT' : 'Default'}`);

// When your server starts, add explicit messaging
console.log(`Server started on port ${port}`);
console.log('Application logs should be visible in the terminal');
