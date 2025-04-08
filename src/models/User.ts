import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { SpotifyAuth } from './SpotifyAuth';

@modelOptions({
    schemaOptions: {
        collection: 'Users'
    }
})
export class User {
    @prop({ required: true})
    public email: string;

    @prop({ required: true })
    public token: string;

    @prop({required: false})
    public spotifyAuth?: SpotifyAuth;

    @prop({ required: true })
    public createdAt: Date;

    @prop({ required: true })
    public lastLoggedIn: Date;

    constructor(email: string, token: string, createdAt: Date, lastLoggedIn: Date, spotifyAuth?: SpotifyAuth) {
        this.email = email;
        this.token = token;
        this.createdAt = createdAt;
        this.lastLoggedIn = lastLoggedIn;
        this.spotifyAuth = spotifyAuth || undefined;
    }
}

export const UserModel = getModelForClass(User);