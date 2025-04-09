export default class TokenNotIncludedError extends Error {
    constructor(message: string) {
        super(message);
    }
}