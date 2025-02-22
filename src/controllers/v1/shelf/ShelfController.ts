import { Request, Response } from 'express';
import { Shelf, ShelfModel } from '../../../models/Shelf';
import Logger from '../../../utils/Logger';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ShelfController {
    private logger: Logger;

    constructor(@inject(Logger) logger: Logger) {
        this.logger = logger;
    }

    async createShelf(req: Request, res: Response) {
        const shelf = new ShelfModel(new Shelf('me', 'idk', 'green', [], new Date(Date.now())));
        try {
            await shelf.save();
        } catch (e) {
            res.status(500).send('Error saving Shelf!');
            throw new Error(`Error saving Shelf ${(e as Error).message}`);

        }
        res.status(201).send('Shelf created');
    }
}