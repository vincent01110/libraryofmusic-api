import { prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';



export class Artist {
    @prop()
    public _id!: mongoose.Types.ObjectId;

    @prop({ required: true })
    public id: string;

    @prop({ required: true })
    public name: string;

    @prop({ required: true })
    public type: string;

    @prop({ required: true })
    public uri: string;

    constructor(id: string, name: string, type: string, uri: string) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.uri = uri;
    }
}