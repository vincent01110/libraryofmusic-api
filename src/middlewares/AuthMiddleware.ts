import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { JWTService } from '../services/JWTService';
import Logger from '../utils/Logger';
import { getTokenFromCookie } from '../utils/utils';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const jwtService = container.resolve(JWTService);
    const logger = container.resolve(Logger);

    try {      
        const token = getTokenFromCookie(req);

        if (!token) throw new Error('Token not included!');

        const isTokenValid = jwtService.verifyJWT(token);

        if (!isTokenValid) throw new Error('Token is invalid!');

        next();

    } catch (e) {
        logger.error('Authentication Error: ' + (e as Error).message);
        res.status(401).json({ code: 401, message: (e as Error).message});
        return;
    }
};