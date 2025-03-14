import { autoInjectable } from 'tsyringe';
import { BaseController } from '../BaseController';
import { Request, Response } from 'express';
import { UserModel } from '../../../models/User';
import { LoginUser } from '../../../models/interfaces/ILoginUser';

@autoInjectable()
export class AuthController extends BaseController {

    constructor() {
        super();
        this.logIn = this.logIn.bind(this);
    }

    async logIn(req: Request, res: Response) {
        try {
            const rawUser: LoginUser = req.body;

            const user = await UserModel.findOne({ email: rawUser.user.email});

            if (!user) {
                await UserModel.create({
                    email: rawUser.user.email,
                    createdAt: new Date(Date.now()),
                    lastLoggedIn: new Date(Date.now()),
                });
                res.status(201).json({ code: 201, message: 'User registered!' });
                return;
            } else {
                await user.updateOne({lastLoggedIn: new Date(Date.now())});
                res.status(200).json({ code: 200, message: 'User logged in!' });
                return;
            }
        } catch (e) {
            this.logger.error((e as Error).message);
            throw new Error('Error identifying/creating user');
        }
    }
}