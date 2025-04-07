export default class ShelfNotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}