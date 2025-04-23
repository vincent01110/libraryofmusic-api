import { autoInjectable } from 'tsyringe';
import Logger from '../../../utils/Logger';
import { CarouselModel } from '../../../models/Carousel';
import { Response, Request } from 'express';

@autoInjectable()
export class CarouselController {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;

        this.getCarouselAlbums = this.getCarouselAlbums.bind(this);
    }

    async getCarouselAlbums(req: Request, res: Response) {
        try {
            const carousel = (await CarouselModel.find()).slice(0, 7);

            res.status(200).json(carousel);
            return;
        } catch (e) {
            res.status(500).json({ code: 500, message: (e as Error).message });
            this.logger.error((e as Error).message);
        }
    }

}