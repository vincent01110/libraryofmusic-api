import { prop } from '@typegoose/typegoose';
import { Image } from './Image';
import mongoose from 'mongoose';

export class Album {
    @prop()
    public _id!: mongoose.Types.ObjectId;

    @prop({ required: true })
    public id: string;

    @prop({ required: true })
    public name: string;

    @prop({ type: () => Image, required: true })
    public images: Image[];

    constructor(id: string, name: string, images: Image[]) {
        this.id = id;
        this.name = name;
        this.images = images;
    }
}