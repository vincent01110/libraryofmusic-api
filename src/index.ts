import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { container } from 'tsyringe';
import Logger from './utils/Logger';
import { loggerMiddleware } from './middlewares/LoggerMiddleware';
import { Transport } from './models/interfaces/ITransport';
import { MongoClient } from './utils/MongoClient';
import v1Router from './routes/v1/v1Router';

dotenv.config();

const app: Express = express();

const port = process.env.PORT || 3001;
const logger = container.resolve(Logger);
const mongoClient = container.resolve(MongoClient);
mongoClient.connect().catch((error) => {
    logger.error(`Connection error: ${(error as Error).message}`);
    process.exit(1);
});

app.use(cors());

app.use(loggerMiddleware);

app.use('/v1', v1Router);

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`, Transport.ALL);
});