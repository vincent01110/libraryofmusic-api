import { Router } from 'express';
import { container } from 'tsyringe';
import { ShelfController } from '../../../controllers/v1/shelf/ShelfController';

const shelfRouter = Router();
const shelfController = container.resolve(ShelfController);

shelfRouter.post('/', shelfController.createShelf);

export default shelfRouter;