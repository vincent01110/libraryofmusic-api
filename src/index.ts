import 'reflect-metadata';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { container } from 'tsyringe';
import Logger from './utils/Logger';
import { loggerMiddleware } from './middlewares/LoggerMiddleware';
import { Transport } from './models/interfaces/ITransport';

dotenv.config();

const app: Express = express();

const port = process.env.PORT || 3001;
const logger = container.resolve(Logger);

app.use(cors());

app.use(loggerMiddleware);

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`, Transport.ALL);
});