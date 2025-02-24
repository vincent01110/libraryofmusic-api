import { container } from 'tsyringe';
import Logger from '../../utils/Logger';


export class BaseController {
    public logger: Logger;

    constructor() {
        this.logger = container.resolve(Logger);
    }
}