import { autoInjectable } from 'tsyringe';
import { BaseController } from '../BaseController';
import { Request, Response } from 'express';
import { UserModel } from '../../../models/User';
import SpotifyAuthService from '../../../services/SpotifyAuthService';
import { getTokenFromCookie } from '../../../utils/utils';

@autoInjectable()
export class AuthController extends BaseController {
    private spotifyAuthService: SpotifyAuthService;

    constructor(spotifyAuthService: SpotifyAuthService) {
        super();
        this.spotifyAuthService = spotifyAuthService;

        this.login = this.login.bind(this);
        this.callback = this.callback.bind(this);
    }

    public async login(req: Request, res: Response) {
        try {
            // if (!req.body || !req.body.email) {
            //     res.status(400).json({ code: 400, message: 'Payload data is incorrect!' });
            //     return;
            // }

            const token = getTokenFromCookie(req);
            
            if (!token) {
                await this.spotifyAuthService.authorize(res);
                return;
            }

            const email = this.jwtService.getUser(token);

            const user = await UserModel.findOne({ email: email});

            if (!user) {
                await this.spotifyAuthService.authorize(res);
                res.status(200);
                return;
            } else {
                const isTokenValid = this.jwtService.verifyJWT(user.token);
                if (isTokenValid && email === user.email) {
                    await user.updateOne({lastLoggedIn: new Date(Date.now())});
                    res.cookie('API_TOKEN', user.token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 3600000
                    });
                } else if (email === user.email) {
                    const token = this.jwtService.createJWT(email);
                    await user.updateOne({token: token, lastLoggedIn: new Date(Date.now())});
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
        }
    }

    public async callback (req: Request, res: Response) {
        try {
            const resp = await this.spotifyAuthService.callback(req, res);
            this.logger.debug(JSON.stringify(resp));
            res.send('lyó');
        } catch (e) {
            this.logger.error((e as Error).message);
            res.send('fuck');
        }

    } 
}