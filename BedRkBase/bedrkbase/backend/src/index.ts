import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import prisma from './utils/prisma';
import { errorMiddleware } from './middleware/error.middleware';

// Import utilities and middleware
import logger, { requestLogger } from './utils/logger';
import { testConnection as testSupabaseConnection } from './utils/supabaseClient';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(requestLogger); // Use our custom request logger

// Import routes
import establishmentRoutes from './routes/establishment.routes';
import healthRoutes from './routes/health.routes';

// Use routes
app.use('/api/establishments', establishmentRoutes);
app.use('/api/health', healthRoutes);

// Global error handler
app.use(errorMiddleware);

// Root route
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'BedRkBase API Server',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start server
const server = app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Test Supabase connection on startup
  try {
    const supabaseResult = await testSupabaseConnection();
    if (supabaseResult.success) {
      logger.info('Supabase connection successful');
    } else {
      logger.error('Supabase connection failed, shutting down server.', { error: supabaseResult.error });
      process.exit(1);
    }
  } catch (error) {
    logger.error('Error testing Supabase connection, shutting down server.', { error });
    process.exit(1);
  }
});

// Handle shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down server...');
  
  // Close database connection
  await prisma.$disconnect();
  logger.info('Database connection closed');
  
  // Close server
  server.close(() => {
    logger.info('Server shut down successfully');
    process.exit(0);
  });
  
  // Force exit after timeout
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 5000);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { error });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled promise rejection', { reason, promise });
});

export default app;
