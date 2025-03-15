import { autoInjectable, inject } from 'tsyringe';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Logger from '../utils/Logger';
import { JWTPayload } from '../models/interfaces/IJWTPayload';
dotenv.config();

@autoInjectable()
export class JWTService {
    private logger: Logger;

    constructor(@inject(Logger) logger: Logger) {
        this.logger = logger;
    }
    
    public createJWT(email: string): string{
        const expirationTime = Math.floor(Date.now() / 1000) + 3600;
        const secret = process.env.JWT_SECRET;
        
        if (!secret) throw new Error('JWT secret not found');

        const token = jwt.sign({email, expires: expirationTime}, secret);
        this.logger.debug(token);

        return token;
    }

    public verifyJWT(token: string): boolean {
        const secret = process.env.JWT_SECRET;
        
        if (!secret) throw new Error('JWT secret not found');

        try {
            jwt.verify(token, secret);
            return true;
        } catch (e) {
            this.logger.error('Invalid or Expired JWT: ' + (e as Error).message);
            return false;
        }
    }

    public getUser(token: string): string {
        const secret = process.env.JWT_SECRET;
        
        if (!secret) throw new Error('JWT secret not found');

        try {
            const decoded = jwt.decode(token);

            if (!decoded) throw new Error('Error decoding JWT');

            return (decoded as JWTPayload).email;
        } catch (e) {
            throw new Error('Coudn\'t decode JWT: ' + (e as Error).message);
        }
    }
}