import { prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';

export class Image {
    @prop()
    public _id!: mongoose.Types.ObjectId;

    @prop({ required: true })
    public height: number;

    @prop({ required: true })
    public width: number;

    @prop({ required: true })
    public url: string;

    constructor(height: number, width: number, url: string) {
        this.height = height;
        this.width = width;
        this.url = url;
    }
}