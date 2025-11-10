import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { config } from './config/config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { GameManager } from './engine/managers/GameManager.js';
import { createApiV1Router } from './api/v1/index.js';

dotenv.config();

const app = express();
const PORT = config.port || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialize GameManager
const gameManager = new GameManager();

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Riftbound Simulator API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Riftbound Simulator API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      auth: '/api/v1/auth',
      games: '/api/v1/games',
    },
  });
});

// Mount API v1 routes
app.use('/api/v1', createApiV1Router(gameManager));

// Error handler (must be last)
app.use(errorHandler);

// Initialize and start server
async function startServer() {
  try {
    // Initialize GameManager (loads card scripts)
    await gameManager.initialize();
    logger.info('GameManager initialized successfully');

    app.listen(PORT, () => {
      logger.info(`🚀 Riftbound Simulator server is running on port ${PORT}`);
      logger.info(`📖 Health check available at http://localhost:${PORT}/health`);
      logger.info(`🎮 Game API available at http://localhost:${PORT}/api/v1/games`);
      logger.info(`🔐 Auth API available at http://localhost:${PORT}/api/v1/auth`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
