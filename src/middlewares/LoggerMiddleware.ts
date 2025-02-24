import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import Logger from '../utils/Logger';
import { Transport } from '../models/interfaces/ITransport';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const logger = container.resolve(Logger);
    logger.info(`${req.method}: ${req.url}`);

    res.on('finish', () => {
        const statusCategory = Math.floor(res.statusCode / 100);
        const message = `${req.method} ${res.statusCode} ${req.url}`;

        if (statusCategory === 4 || statusCategory === 5) {
            logger.error(message);
        } else {
            logger.info(message, Transport.ALL);
        }
    });

    next();
};