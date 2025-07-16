"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = require("./generated/prisma");
const prisma = new prisma_1.PrismaClient();
const env_1 = require("./config/env");
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const index_1 = __importDefault(require("./routes/index"));
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
// Middlewares de base
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)());
(0, index_1.default)(app);
// Middleware de gestion des erreurs
app.use(errorHandler_1.default);
// Fonction d'arrêt propre
const gracefulShutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('Shutting down gracefully...');
    try {
        yield prisma.$disconnect();
        logger_1.default.info('Database connection closed');
    }
    catch (error) {
        logger_1.default.error('Error during shutdown:', error);
    }
    process.exit(1);
});
// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
    logger_1.default.error('Uncaught Exception:', error);
    gracefulShutdown();
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.default.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown();
});
// Fonction de démarrage du serveur
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.default.info('Attempting to connect to the database...');
        yield prisma.$connect();
        logger_1.default.info('Successfully connected to the database');
        const userCount = yield prisma.user.count();
        logger_1.default.info(`Database connection test successful. User count: ${userCount}`);
        const server = app.listen(env_1.PORT, () => {
            logger_1.default.info(`Server is running on port ${env_1.PORT}`);
        });
        const shutdown = () => __awaiter(void 0, void 0, void 0, function* () {
            logger_1.default.info('Received shutdown signal, closing server...');
            server.close(() => __awaiter(void 0, void 0, void 0, function* () {
                logger_1.default.info('HTTP server closed');
                yield prisma.$disconnect();
                logger_1.default.info('Database connection closed');
                process.exit(0);
            }));
        });
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        yield prisma.$disconnect();
        process.exit(1);
    }
});
startServer();
