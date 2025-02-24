import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
    schemaOptions: {
        collection: 'Users'
    }
})
export class User {
    @prop({ required: true})
    public name: string;

    @prop({ required: true })
    public createdAt: Date;

    @prop({ required: true })
    public lastLoggedIn: Date;

    constructor(name: string, createdAt: Date, lastLoggedIn: Date) {
        this.name = name;
        this.createdAt = createdAt;
        this.lastLoggedIn = lastLoggedIn;
    }
}

export const UserModel = getModelForClass(User);