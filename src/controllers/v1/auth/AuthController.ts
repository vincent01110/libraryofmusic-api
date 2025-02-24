import { autoInjectable } from 'tsyringe';
import { BaseController } from '../BaseController';
import { Request, Response } from 'express';
import { Transport } from '../../../models/interfaces/ITransport';
import { PostBack } from '../../../models/interfaces/IPostBack';

@autoInjectable()
export class AuthController extends BaseController {

    constructor() {
        super();
        this.postBack = this.postBack.bind(this);
    }

    async postBack(req: Request, res: Response) {
        const authData: PostBack = req.body;
        this.logger.debug(JSON.stringify(authData), Transport.ALL);
        res.status(200);
        return;
    }
}