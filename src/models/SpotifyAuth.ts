import { prop } from '@typegoose/typegoose';

export class SpotifyAuth {
    @prop({ required: true})
    public accessToken: string;

    @prop({ required: true })
    public tokenType: string;

    @prop({ required: true })
    public scope: string;

    @prop({ required: true })
    public expiresAt: number;

    @prop({ required: true })
    public refreshToken: string;

    constructor(accessToken: string, tokenType: string, scope: string, expiresAt: number, refreshToken: string) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.scope = scope;
        this.expiresAt = expiresAt;
        this.refreshToken = refreshToken;
    }
}