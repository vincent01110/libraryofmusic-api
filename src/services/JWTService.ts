import { autoInjectable, inject } from 'tsyringe';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Logger from '../utils/Logger';
import { JWTPayload } from '../models/interfaces/IJWTPayload';
import { UserModel } from '../models/User';
import UserNotFoundError from '../models/errors/UserNotFoundError';
dotenv.config();

@autoInjectable()
export class JWTService {
    private logger: Logger;

    constructor(@inject(Logger) logger: Logger) {
        this.logger = logger;
    }
    
    public createJWT(email: string): string{
        const secret = process.env.JWT_SECRET;
        
        if (!secret) throw new Error('JWT secret not found');

        const token = jwt.sign({email}, secret, { expiresIn: '48h' });

        return token;
    }

    public async verifyJWT(token: string): Promise<boolean> {
        const secret = process.env.JWT_SECRET;
        
        if (!secret) throw new Error('JWT secret not found');

        try {
            jwt.verify(token, secret);
            const user = await UserModel.findOne({ token });

            if (!user) throw new UserNotFoundError('Token doesnt exists!');

            return true;
        } catch (e) {
            this.logger.error('Invalid or Expired JWT: ' + (e as Error).message);
            return false;
        }
    }

    public getUser(token: string): string {
        try {
            const decoded = jwt.decode(token);

            if (!decoded) throw new Error('Error decoding JWT');

            return (decoded as JWTPayload).email;
        } catch (e) {
            throw new Error('Coudn\'t decode JWT: ' + (e as Error).message);
        }
    }
}