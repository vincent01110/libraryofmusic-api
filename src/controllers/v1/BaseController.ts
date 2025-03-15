import { container } from 'tsyringe';
import Logger from '../../utils/Logger';
import { JWTService } from '../../services/JWTService';


export class BaseController {
    public logger: Logger;
    public jwtService: JWTService;

    constructor() {
        this.logger = container.resolve(Logger);
        this.jwtService = container.resolve(JWTService);
    }
}