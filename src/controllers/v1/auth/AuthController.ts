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
                const token = this.jwtService.createJWT(rawUser.user.email);
                await UserModel.create({
                    email: rawUser.user.email,
                    token: token,
                    createdAt: new Date(Date.now()),
                    lastLoggedIn: new Date(Date.now()),
                });
                
                res.cookie('API_TOKEN', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 3600000
                });
                res.status(201).json({ code: 201, message: 'User registered!' });
                return;
            } else {
                const isTokenValid = this.jwtService.verifyJWT(user.token);
                if (isTokenValid && rawUser.user.email === user.email) {
                    await user.updateOne({lastLoggedIn: new Date(Date.now())});
                    res.cookie('API_TOKEN', user.token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 3600000
                    });
                } else if (rawUser.user.email === user.email) {
                    const token = this.jwtService.createJWT(rawUser.user.email);
                    await user.updateOne({lastLoggedIn: new Date(Date.now())});
                    res.cookie('API_TOKEN', token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 3600000
                    });
                }
                res.status(200).json({ code: 200, message: 'User logged in!' });
                return;
            }
        } catch (e) {
            this.logger.error((e as Error).message);
            throw new Error('Error identifying/creating user');
        }
    }
}