import { autoInjectable, inject } from 'tsyringe';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import dotenv from 'dotenv';
import Logger from '../utils/Logger';
import { JWTPayload } from '../models/interfaces/IJWTPayload';
import { InvalidTokenError } from '../models/errors/InvalidTokenError';
dotenv.config();

@autoInjectable()
export class JWTService {
    private logger: Logger;

    constructor(@inject(Logger) logger: Logger) {
        this.logger = logger;
    }
    
    public createJWT(email: string): string{
        //const expirationTime = Date.now() + 3600;
        const secret = process.env.JWT_SECRET;
        
        if (!secret) throw new Error('JWT secret not found');

        const token = jwt.sign({email}, secret, { expiresIn: '1h'});

        return token;
    }

    public verifyJWT(token: string): boolean {
        const secret = process.env.JWT_SECRET;
        
        if (!secret) throw new Error('JWT secret not found');

        try {
            jwt.verify(token, secret);

            return true;
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                this.logger.error(e.message);
                return false;
            }

            this.logger.error((e as InvalidTokenError).message);
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