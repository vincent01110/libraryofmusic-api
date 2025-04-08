import { Router } from 'express';
import { container } from 'tsyringe';
import { ShelfController } from '../../../controllers/v1/shelf/ShelfController';
import { authMiddleware } from '../../../middlewares/AuthMiddleware';

const shelfRouter = Router();
const shelfController = container.resolve(ShelfController);

shelfRouter.use(authMiddleware);

shelfRouter.get('/', shelfController.getShelves);

shelfRouter.get('/:id', shelfController.getShelfById);

shelfRouter.post('/', shelfController.createShelf);

shelfRouter.put('/:id', shelfController.updateShelf);

shelfRouter.delete('/:id', shelfController.deleteShelfById);

export default shelfRouter;