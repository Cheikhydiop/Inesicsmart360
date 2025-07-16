import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

import { PORT } from './config/env';
import errorHandler from './middlewares/errorHandler';
import Routes from './routes/index';
import logger from './utils/logger';
import { swaggerUi, specs } from './config/swagger';

const app = express();

// Middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());
app.use(cors());

Routes(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



// Middleware de gestion des erreurs
app.use(errorHandler);

// Fonction d'arrêt propre
const gracefulShutdown = async () => {
  logger.info('Shutting down gracefully...');
  try {
    await prisma.$disconnect();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error during shutdown:', error);
  }
  process.exit(1);
};

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});

// Fonction de démarrage du serveur
const startServer = async () => {
  try {
    logger.info('Attempting to connect to the database...');

    await prisma.$connect();
    logger.info('Successfully connected to the database');

    const userCount = await prisma.user.count();
    logger.info(`Database connection test successful. User count: ${userCount}`);

    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

    const shutdown = async () => {
      logger.info('Received shutdown signal, closing server...');
      server.close(async () => {
        logger.info('HTTP server closed');
        await prisma.$disconnect();
        logger.info('Database connection closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    logger.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();





