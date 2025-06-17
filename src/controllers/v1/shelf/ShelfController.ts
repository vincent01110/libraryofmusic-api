import { Request, Response } from 'express';
import { ShelfModel } from '../../../models/Shelf';
import Logger from '../../../utils/Logger';
import { autoInjectable, inject } from 'tsyringe';
import { JWTService } from '../../../services/JWTService';
import { getTokenFromCookie, isIdValid } from '../../../utils/utils';
import UserNotFoundError from '../../../models/errors/UserNotFoundError';
import ShelfNotFoundError from '../../../models/errors/ShelfNotFoundError';
import { ShelfDTO } from '../../../models/dto/ShelfDTO';
import InvalidShelfError from '../../../models/errors/InvalidShelfError';
import { Album } from '../../../models/Album';

@autoInjectable()
export class ShelfController {
    private logger: Logger;
    private jwtService: JWTService;

    constructor(@inject(Logger) logger: Logger, 
                @inject(JWTService) jwtService: JWTService) {

        this.logger = logger;
        this.jwtService = jwtService;

        this.getShelves = this.getShelves.bind(this);
        this.getShelfById = this.getShelfById.bind(this);
        this.createShelf = this.createShelf.bind(this);
        this.addAlbumToShelf = this.addAlbumToShelf.bind(this);
        this.updateShelf = this.updateShelf.bind(this);
        this.deleteShelfById = this.deleteShelfById.bind(this);
    }

    async getShelves(req: Request, res: Response) {
        try {
            const user = this.jwtService.getUser(getTokenFromCookie(req) || '');

            if (!user) throw new UserNotFoundError('User not found!');

            const shelves = await ShelfModel.find({user: user});
            res.status(200).json(shelves);
            return;
        } catch (e: unknown) {
            if (e instanceof UserNotFoundError) {
                res.status(404).json({ code: 404, message: (e as UserNotFoundError).message });
                return;
            }
            this.logger.error(`Error: ${(e as Error).message}`);
            res.status(500).json({code: 500, message: 'Error retrieving shelves!'});
        }
    }

    async getShelfById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!isIdValid(id)) {
                res.status(400).json({ code: 400, message: `The given id:${id} is not valid!` });
                return;
            }

            const user = this.jwtService.getUser(getTokenFromCookie(req) || '');

            if (!user) throw new UserNotFoundError('User not found!');

            const shelf = await ShelfModel.findOne({ _id: id, user: user});

            if (!shelf) throw new ShelfNotFoundError(`Shelf:${req.params.id} not found!`);

            res.status(200).json(shelf);
            return;
        } catch (e) {
            if (e instanceof UserNotFoundError) {
                res.status(404).json({ code: 404, message: (e as UserNotFoundError).message });
                return;
            }
            if (e instanceof ShelfNotFoundError) {
                res.status(404).json({ code: 404, message: (e as ShelfNotFoundError).message });
                return;
            }
            this.logger.error(`Error: ${(e as Error).message}`);
            res.status(500).json({code: 500, message: 'Error retrieving Shelf!'});
        }
    }

    async createShelf(req: Request, res: Response) {
        try {
            const user = this.jwtService.getUser(getTokenFromCookie(req) || '');

            if (!user) throw new UserNotFoundError('User not found!');

            if (!req.body.name || !req.body.color) {
                throw new InvalidShelfError('Shelf structure is invalid!');
            }

            this.logger.debug(JSON.stringify(req.body));

            const payload = new ShelfDTO(req.body.name, req.body.color);

            const createdShelf = await ShelfModel.create({...payload, items: [], user: user, createdAt: new Date(Date.now())});
            res.status(201).json(createdShelf);
            return;
        } catch (e) {
            if (e instanceof UserNotFoundError) {
                res.status(404).json({ code: 404, message: (e as UserNotFoundError).message });
                return;
            }
            if (e instanceof InvalidShelfError) {
                res.status(400).json({ code: 400, message: (e as InvalidShelfError).message });
                return;
            }
            this.logger.error(`Error: ${(e as Error).message}`);
            res.status(500).json({code: 500, message: 'Error saving Shelf!'});
        }
    }

    async updateShelf(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!isIdValid(id)) {
                res.status(400).json({ code: 400, message: `The given id:${id} is not valid!` });
                return;
            }

            const user = this.jwtService.getUser(getTokenFromCookie(req) || '');

            if (!user) throw new UserNotFoundError('User not found!');

            const shelf = await ShelfModel.findOne({ _id: id, user: user });

            if (!shelf) throw new ShelfNotFoundError(`Shelf:${req.params.id} not found!`);

            req.body = {...req.body, _id: id};

            await ShelfModel.updateOne({_id: id}, {...shelf.toObject(), ...req.body});
            const updated = await ShelfModel.findOne({ _id: id, user: user });

            res.status(200).json({ code: 200, message: 'Shelf updated successfully!', updated });
            return;
        } catch (e) {
            if (e instanceof ShelfNotFoundError) {
                res.status(404).json({ code: 404, message: (e as ShelfNotFoundError).message });
                return;
            }
            this.logger.error(`Error: ${(e as Error).message}`);
            res.status(500).json({code: 500, message: 'Error updating Shelf!'});
            return;
        }
    }

    async addAlbumToShelf(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id || !isIdValid(id)) {
                res.status(400).json({ code: 400, message: `The given id:${id} is not valid!` });
                return;
            }

            const user = this.jwtService.getUser(getTokenFromCookie(req) || '');

            if (!user) throw new UserNotFoundError('User not found!');

            const shelf = await ShelfModel.findOne({ _id: id, user: user });

            if (!shelf) throw new ShelfNotFoundError(`Shelf:${req.params.id} not found!`);

            const album: Album = req.body;

            const updated = await ShelfModel.updateOne(
                { _id: shelf._id },
                { $push: { items: album } }
            );

            res.status(200).json({ code: 200, message: 'Album added to shelf!', updated });
            return;
        } catch (e) {
            if (e instanceof ShelfNotFoundError) {
                res.status(404).json({ code: 404, message: (e as ShelfNotFoundError).message });
                return;
            }
            this.logger.error(`Error: ${(e as Error).message}`);
            res.status(500).json({code: 500, message: 'Error updating Shelf!'});
            return;
        }
    }

    async deleteShelfById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!isIdValid(id)) {
                res.status(400).json({ code: 400, message: `The given id:${id} is not valid!` });
                return;
            }

            const user = this.jwtService.getUser(getTokenFromCookie(req) || '');

            if (!user) throw new UserNotFoundError('User not found!');

            const shelf = await ShelfModel.findOne({ _id: id, user: user });

            if (!shelf) throw new ShelfNotFoundError(`Shelf:${req.params.id} not found!`);

            await ShelfModel.deleteOne(shelf._id);

            res.status(200).json({ code: 200, message: 'Shelf deleted successfully!', shelf });
            return;
        } catch (e) {
            if (e instanceof UserNotFoundError) {
                res.status(404).json({ code: 404, message: (e as UserNotFoundError).message });
                return;
            }
            if (e instanceof ShelfNotFoundError) {
                res.status(404).json({ code: 404, message: (e as ShelfNotFoundError).message });
                return;
            }
            this.logger.error(`Error: ${(e as Error).message}`);
            res.status(500).json({code: 500, message: 'Error deleting Shelf!'});
            return;
        }
    }
}