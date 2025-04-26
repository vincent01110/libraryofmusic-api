import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { JWTService } from '../services/JWTService';
import Logger from '../utils/Logger';
import { getTokenFromCookie } from '../utils/utils';
import TokenNotIncludedError from '../models/errors/TokenNotIncludedError';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const jwtService = container.resolve(JWTService);
    const logger = container.resolve(Logger);

    try {      
        const token = getTokenFromCookie(req);

        if (!token) throw new TokenNotIncludedError('Token not included!');

        const isTokenValid = await jwtService.verifyJWT(token);

        if (!isTokenValid) throw new Error('Token is invalid!');

        next();

    } catch (e) {
        logger.error('Authentication Error: ' + (e as Error).message);

        res.status(401).json({ code: 401, message: (e as Error).message});
        return;
    }
};