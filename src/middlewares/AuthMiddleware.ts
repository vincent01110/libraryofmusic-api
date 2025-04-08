import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { JWTService } from '../services/JWTService';
import Logger from '../utils/Logger';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const jwtService = container.resolve(JWTService);
    const logger = container.resolve(Logger);

    try {
        if (req.path.endsWith('/login') || req.path.includes('/callback')) {
            next();
        };
        
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) throw new Error('Token not included!');

        const isTokenValid = jwtService.verifyJWT(token);

        if (!isTokenValid) {
            res.status(401).json({ code: 401, message: 'Token is invalid!' });
            return;
        }

        next();

    } catch (e) {
        logger.error('Invalid Token Error: ' + (e as Error).message);
        res.status(401).json({ code: 401, message: (e as Error).message});
        return;
    }
};