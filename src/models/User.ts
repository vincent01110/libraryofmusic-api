import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

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

    @prop({ required: true })
    public createdAt: Date;

    @prop({ required: true })
    public lastLoggedIn: Date;

    constructor(email: string, token: string, createdAt: Date, lastLoggedIn: Date) {
        this.email = email;
        this.token = token;
        this.createdAt = createdAt;
        this.lastLoggedIn = lastLoggedIn;
    }
}

export const UserModel = getModelForClass(User);