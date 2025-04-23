import { Router } from 'express';
import { container } from 'tsyringe';
import { CarouselController } from '../../../controllers/v1/carousel/CarouselController';

const carouselRouter = Router();

const carouselController = container.resolve(CarouselController);

carouselRouter.get('/', carouselController.getCarouselAlbums);

export default carouselRouter;