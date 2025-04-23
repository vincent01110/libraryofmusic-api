import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { Image } from './Image';
import { Artist } from './Artist';

@modelOptions({
    schemaOptions: {
        collection: 'Carousel'
    }
})
export class Carousel {
    @prop()
    public _id!: mongoose.Types.ObjectId;

    @prop({ required: true })
    public id: string;

    @prop({ required: true, type: () => Image })
    public images: Image[];

    @prop({ required: true })
    public name: string;

    @prop({ required: true, type: () => Artist })
    public artists: Artist[];

    constructor(id: string, images: Image[], name: string, artists: Artist[]) {
        this.id = id;
        this.images = images;
        this.name = name;
        this.artists = artists;
    }
}

export const CarouselModel = getModelForClass(Carousel);