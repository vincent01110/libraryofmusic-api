import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';

@modelOptions({
    schemaOptions: {
        collection: 'Shelves'
    }
})
export class Shelf {
    @prop()
    public id!: mongoose.Types.ObjectId;

    @prop({required: true})
    public user: string;

    @prop({required: true})
    public name: string;

    @prop()
    public color: string;

    @prop({type: [String]})
    public items: string[];

    @prop({required: true})
    public createdAt: Date;

    constructor (user: string, name: string, color: string, items: string[], createdAt: Date) {
        this.user = user;
        this.name = name;
        this.color = color;
        this.items = items;
        this.createdAt = createdAt;
    }
}

export const ShelfModel = getModelForClass(Shelf);