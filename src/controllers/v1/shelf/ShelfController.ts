import { Request, Response } from 'express';
import { ShelfModel } from '../../../models/Shelf';
import { autoInjectable } from 'tsyringe';
import { BaseController } from '../BaseController';
import { getTokenFromCookie } from '../../../utils/utils';

@autoInjectable()
export class ShelfController extends BaseController {

    constructor() {
        super();
        this.getShelves = this.getShelves.bind(this);
        this.getShelfById = this.getShelfById.bind(this);
        this.createShelf = this.createShelf.bind(this);
        this.updateShelf = this.updateShelf.bind(this);
        this.deleteShelfById = this.deleteShelfById.bind(this);
    }

    async getShelves(req: Request, res: Response) {
        try {
            const token = getTokenFromCookie(req);

            if (!token) throw new Error('Couldn\'t read token!');

            const user = this.jwtService.getUser(token);

            const shelves = await ShelfModel.find({ user: user });
            res.status(200).json(shelves);
            return;
        } catch (e) {
            this.logger.error(`Error: ${(e as Error).message}`);
            res.status(500).json({code: 500, message: 'Error retrieving shelves!'});;
            throw new Error('Error retrieving shelves');
        }
    }

    async getShelfById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                res.status(400).json({ code: 400, message: `The given id:${id} is not valid!` });
                return;
            }

            const token = getTokenFromCookie(req);

            if (!token) throw new Error('Couldn\'t read token!');

            const user = this.jwtService.getUser(token);

            const shelf = await ShelfModel.find({ _id: id, user: user});

            if (!shelf || shelf.length === 0) {
                res.status(404).json({ code: 404, message: `Shelf:${req.params.id} not found!` });
                return;
            }
            res.status(200).json(shelf);
            return;
        } catch (e) {
            this.logger.error(`Error: ${(e as Error).message}`);
            res.status(500).json({code: 500, message: 'Error retrieving Shelf!'});
        }
    }

    async createShelf(req: Request, res: Response) {
        try {
            const rawShelf = req.body;

            const token = getTokenFromCookie(req);

            if (!token) throw new Error('Couldn\'t read token!');

            const user = this.jwtService.getUser(token);
            
            await ShelfModel.create({...rawShelf, user: user, createdAt: new Date(Date.now())});

            res.status(201).send('Shelf created');
            return;
        } catch (e) {
            this.logger.error(`Error: ${(e as Error).message}`);
            res.status(500).json({code: 500, message: 'Error saving Shelf!'});
            throw new Error(`Error saving Shelf ${(e as Error).message}`);
        }
    }

    async updateShelf(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                res.status(400).json({ code: 400, message: `The given id:${id} is not valid!` });
                return;
            }

            const token = getTokenFromCookie(req);

            if (!token) throw new Error('Couldn\'t read token!');

            const user = this.jwtService.getUser(token);

            const shelf = await ShelfModel.findOneAndUpdate({_id: id, user: user}, {...req.body, user: user}, { new: true });

            if (!shelf) {
                res.status(404).json({ code: 404, message: 'Shelf not found!' });
                return;
            }
        
            res.status(200).json({ code: 200, message: 'Shelf updated successfully!', shelf});
            return;
        } catch (e) {
            this.logger.error(`Error: ${(e as Error).message}`);
            res.status(500).json({code: 500, message: 'Error updating Shelf!'});
            return;
        }
    }

    async deleteShelfById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id.match(/^[0-9a-fA-F]{24}$/)) {
                res.status(400).json({ code: 400, message: `The given id:${id} is not valid!` });
                return;
            }

            const token = getTokenFromCookie(req);

            if (!token) throw new Error('Couldn\'t read token!');

            const user = this.jwtService.getUser(token);

            this.logger.debug(user);

            const shelf = await ShelfModel.findOneAndDelete({_id: id, user: user});

            if (!shelf) {
                res.status(404).json({ code: 404, message: 'Shelf not found!' });
                return;
            }

            res.status(200).json({ code: 200, message: 'Shelf deleted successfully!', shelf });
            return;
        } catch (e) {
            this.logger.error(`Error: ${(e as Error).message}`);
            res.status(500).json({code: 500, message: 'Error deleting Shelf!'});
            return;
        }
    }
}