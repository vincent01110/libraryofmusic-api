export default class InvalidShelfError extends Error {
    constructor(message: string) {
        super(message);
    }
}