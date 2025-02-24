import winston from 'winston';
import { Map } from 'immutable';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import { Transport } from '../models/interfaces/ITransport';
import { injectable, singleton } from 'tsyringe';

@singleton()
@injectable()
export default class Logger {
    private logger: winston.Logger;
    private fileLoggers = Map<string, winston.Logger>();
    private date = moment();
    private format;

    constructor() {
        this.format = winston.format.printf(({ level, message, timestamp, ms }) => {
            // Narrow the type of timestamp
            const time = typeof timestamp === 'string' || timestamp instanceof Date
                ? moment(timestamp).format('YYYY-MM-DD HH:mm:ss')
                : '';

            // Ensure ms is handled safely
            const milliseconds = ms ? String(ms).padEnd(7) : ''.padEnd(7);

            // Construct the log message
            return `${time} ${milliseconds} ${level} ${message}`;
        });

        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.ms(),
                this.format
            ),
            transports: [
                new winston.transports.Console({ level: 'debug' })
            ]
        });
    }

    public error(message: unknown, transport: Transport = Transport.ALL): void {
        this.log(String(message), this.getLogMethod(transport, 'error'));
    }

    public debug(message: string, transport: Transport = Transport.CONSOLE_TRANSPORT): void {
        this.log(message, this.getLogMethod(transport, 'debug'));
    }

    public info(message: string, transport: Transport = Transport.CONSOLE_TRANSPORT): void {
        this.log(message, this.getLogMethod(transport, 'info'));
    }

    public warning(message: string, transport: Transport = Transport.ALL): void {
        this.log(message, this.getLogMethod(transport, 'warn'));
    }

    public logToCustomFile(message: string, fileName: string) {
        const path = `${process.cwd()}/logs/${this.date.format('Y-MM-DD')}/${fileName.split('.')[0]}.log`;
        const dir = path.split('/').slice(0, -1).join('/');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.appendFileSync(path, `${message}\n`);
    }

    // eslint-disable-next-line no-unused-vars
    private getLogMethod(transport: Transport, level: string): (message: string) => void {
        return (message: string) => {
            if (transport === Transport.CONSOLE_TRANSPORT || transport === Transport.ALL) {
                if (level === 'info') this.logger.info(message);
                if (level === 'error') this.logger.error(message);
                if (level === 'debug') this.logger.debug(message);
                if (level === 'warn') this.logger.warn(message);
            }
            if (transport === Transport.FILE_TRANSPORT || transport === Transport.ALL) {
                this.logToFile(message, level);
            }
        };
    }

    private logToFile(message: string, level: string): void {
        const fileLogger = this.fileLoggers.get(level);
        if (fileLogger) {
            fileLogger.log(level, message);

            return;
        }
        const logDirectory = this.getDirectory();

        const tempLogger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                this.format
            ),
            transports: [
                new winston.transports.File({ filename: path.join(logDirectory, `${level}.log`), level })
            ]
        });
        this.fileLoggers = this.fileLoggers.set(level, tempLogger);

        tempLogger.log(level, message);
    }

    private getDirectory(): string {
        const dir = path.join(
            process.cwd(),
            'logs',
            this.date.format('YYYY-MM-DD')
        );

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        return dir;
    }

    // eslint-disable-next-line no-unused-vars
    private log(message: string, method: (message: string) => void) {
        method(message);
    }
}