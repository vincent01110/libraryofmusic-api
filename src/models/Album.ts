import { prop } from '@typegoose/typegoose';
import { Image } from './Image';
import mongoose from 'mongoose';

export class Album {
    @prop()
    public _id!: mongoose.Types.ObjectId;

    @prop()
    public id: string;

    @prop()
    public name: string;

    @prop({type: () => Image})
    public images: Image[];

    constructor(id: string, name: string, images: Image[]) {
        this.id = id;
        this.name = name;
        this.images = images;
    }
}