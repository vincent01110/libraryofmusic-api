export default class SpotifyAPIError extends Error {
    private code: number;

    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }

    public getCode(): number {
        return this.code;
    }
}