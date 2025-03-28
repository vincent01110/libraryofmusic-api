export class InvalidTokenError extends Error {

    constructor(message: string) {
        super(`InvalidTokenError: ${message}`);
        this.name = 'InvalidTokenError';
    }    
}