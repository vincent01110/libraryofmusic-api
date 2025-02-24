import mongoose from 'mongoose';
import { inject, injectable, singleton } from 'tsyringe';
import Logger from './Logger';
import dotenv from 'dotenv';
dotenv.config();

@singleton()
@injectable()
export class MongoClient {
    private url: string;
    private logger: Logger;

    constructor(@inject(Logger) logger: Logger) {
        this.logger = logger;

        const user = process.env.MONGO_USER;
        const password = process.env.MONGO_PASSWORD;
        const cluster = process.env.MONGO_CLUSTER;
        const appName = process.env.MONGO_APP_NAME;
        if (!user || !password || !cluster || !appName) throw new Error('Mongo cridentials not specified!');

        this.url = `mongodb+srv://${user}:${password}@${cluster}.qdtzx9e.mongodb.net/?retryWrites=true&w=majority&appName=${appName}`;
    }

    public async connect(): Promise<mongoose.Mongoose> {
        try {
            const client = await mongoose.connect(this.url, {
                dbName: process.env.MONGO_DB_NAME || 'LibraryOfMusic'
            });
            this.logger.info('Connected to MongoDB');

            return client;
        } catch (error) {
            this.logger.error(`MongoDB connection error: ${(error as Error).message}`);
            throw new Error('MongoDB connection failed');
        }
    }

    public async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            this.logger.info('Disconnected from MongoDB');
        } catch (error) {
            this.logger.error(`MongoDB disconnection error: ${(error as Error).message}`);
            throw new Error('MongoDB disconnection failed');
        }
    }
}