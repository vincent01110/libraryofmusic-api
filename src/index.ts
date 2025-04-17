import { app, mongoClient, logger } from './app';
import { Transport } from './models/interfaces/ETransport';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`, Transport.ALL);
});

process.on('SIGINT', async () => {
    logger.info('Received SIGINT. Closing MongoDB connection...');
    await mongoClient.disconnect();
    server.close(() => process.exit(0));
});

process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM. Closing MongoDB connection...');
    await mongoClient.disconnect();
    server.close(() => process.exit(0));
});

process.on('uncaughtException', async (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    await mongoClient.disconnect();
    server.close(() => process.exit(1));
});

process.on('unhandledRejection', async (reason) => {
    logger.error(`Unhandled Promise Rejection: ${reason}`);
    await mongoClient.disconnect();
    server.close(() => process.exit(1));
});