import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { config } from './config/config';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = config.port || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Riftbound Simulator API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Riftbound Simulator API',
    version: '1.0.0',
    documentation: '/api/docs',
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Riftbound Simulator server is running on port ${PORT}`);
  logger.info(`📖 Health check available at http://localhost:${PORT}/health`);
});
