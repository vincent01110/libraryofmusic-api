export class LoginError extends Error {

    constructor(message: string) {
        super(`LoginError: ${message}`);
        this.name = 'LoginError';
    }    
}