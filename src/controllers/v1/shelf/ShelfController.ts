import { Request, Response } from 'express';
import { ShelfModel } from '../../../models/Shelf';
import Logger from '../../../utils/Logger';
import { autoInjectable, inject } from 'tsyringe';

@autoInjectable()
export class ShelfController {
    private logger: Logger;

    constructor(@inject(Logger) logger: Logger) {
        this.logger = logger;

        this.getShelves = this.getShelves.bind(this);
        this.createShelf = this.createShelf.bind(this);
    }

    async getShelves(req: Request, res: Response) {
        const shelves = await ShelfModel.find();
        res.status(200).json(shelves);
    }

    async createShelf(req: Request, res: Response) {
        try {
            await ShelfModel.create({...req.body, createdAt: new Date(Date.now())});
        } catch (e) {
            res.status(500).send('Error saving Shelf!');
            throw new Error(`Error saving Shelf ${(e as Error).message}`);

        }
        res.status(201).send('Shelf created');
    }
}