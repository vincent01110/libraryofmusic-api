import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { container } from 'tsyringe';
import Logger from './utils/Logger';
import { loggerMiddleware } from './middlewares/LoggerMiddleware';
import { MongoClient } from './utils/MongoClient';
import v1Router from './routes/v1/v1Router';
import cookieParser from 'cookie-parser';

dotenv.config();

export const app: Express = express();

const logger = container.resolve(Logger);
const mongoClient = container.resolve(MongoClient);

mongoClient.connect().catch((error) => {
    logger.error(`Connection error: ${(error as Error).message}`);
    process.exit(1);
});

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use(loggerMiddleware);
app.use('/v1', v1Router);

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

// export things for test teardown
export { mongoClient, logger };