export default class InvalidJWTError extends Error {
    constructor(message: string) {
        super(message);
    }
}